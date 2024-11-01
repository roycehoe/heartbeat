import random

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import SelectedMood, TreeDisplayState
from exceptions import DBException, NoRecordFoundException
from gateway import send_sad_user_notification_message
from models import Mood
from schemas import MoodIn, MoodOut, MoodRequest
from utils.token import get_token_data

SHOULD_ALERT_ADMIN_CRITERION = 2
DEFAULT_COINS_INCREASE_ON_MOOD_RECORDED = 10
DEFAULT_BONUS_COINS = 250
DEFAULT_MOOD_MESSAGES = (
    "Every day is a new beginning.",
    "You are stronger than you think.",
    "One small step today, a big difference tomorrow.",
    "Your smile is your superpower.",
    "Keep going, brighter days are ahead.",
    "You matter, and your story matters.",
    "Even slow progress is progress.",
    "You’re never too old to dream.",
    "Your strength inspires others.",
    "Embrace today with hope.",
    "Your heart has seen many sunsets, and each is beautiful.",
    "You’re not alone in this journey.",
    "Peace comes with patience.",
    "The best is yet to come.",
    "Take one moment at a time.",
    "Your courage brings light to others.",
    "Believe in yourself today.",
    "You are loved and cherished.",
    "Each breath is a blessing.",
    "Small joys can fill big hearts.",
    "You’ve overcome before, you will again.",
    "Happiness is within you.",
    "You’re more capable than you know.",
    "You are a gift to the world.",
    "Strength grows from every challenge.",
    "Your presence makes the world brighter.",
    "Today is yours to make beautiful.",
    "Focus on the good around you.",
    "Your resilience is your power.",
    "Cherish each day as a new adventure.",
)


def _get_mood_message(mood_messages: tuple[str, ...] = DEFAULT_MOOD_MESSAGES) -> str:
    return random.choice(mood_messages)


def _should_alert_admin(user_id: int, db: Session) -> bool:
    try:
        previous_moods = CRUDMood(db).get_latest(user_id, SHOULD_ALERT_ADMIN_CRITERION)
        if len(previous_moods) < SHOULD_ALERT_ADMIN_CRITERION:
            return False
        for previous_mood in previous_moods:
            if previous_mood.mood != SelectedMood.SAD:
                return False
        return True

    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUser(db).get(user_id).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def _get_next_tree_display_state(
    tree_display_state: TreeDisplayState,
) -> TreeDisplayState:
    if tree_display_state == TreeDisplayState.SEEDLING:
        return TreeDisplayState.TEEN_TREE
    if tree_display_state == TreeDisplayState.TEEN_TREE:
        return TreeDisplayState.ADULT_TREE
    if tree_display_state == TreeDisplayState.ADULT_TREE:
        return TreeDisplayState.ADULT_TREE_WITH_FLOWERS
    return TreeDisplayState.SEEDLING


def _get_next_consecutive_checkins(
    consecutive_counter: int,
) -> int:
    if consecutive_counter != 1:
        return consecutive_counter - 1
    return 5


def _should_move_tree_to_next_tree_display_state(consecutive_counter: int) -> bool:
    return consecutive_counter % 5 == 0


def _should_automatically_disburse_gift(
    previous_tree_display_state: TreeDisplayState,
    current_tree_display_state: TreeDisplayState,
) -> bool:
    return (
        previous_tree_display_state == TreeDisplayState.ADULT_TREE_WITH_FLOWERS
        and current_tree_display_state == TreeDisplayState.SEEDLING
    )


def _update_user(user_id: int, db: Session) -> None:
    try:
        CRUDUser(db).update(user_id, "can_record_mood", False)

        user = CRUDUser(db).get(user_id)
        CRUDUser(db).update(
            user_id, "coins", user.coins + DEFAULT_COINS_INCREASE_ON_MOOD_RECORDED
        )
        CRUDUser(db).update(
            user_id,
            "consecutive_checkins",
            user.consecutive_checkins + 1,
        )

        user = CRUDUser(db).get(user_id)
        if _should_move_tree_to_next_tree_display_state(user.consecutive_checkins):
            next_tree_display_state = _get_next_tree_display_state(
                user.tree_display_state
            )
            if _should_automatically_disburse_gift(
                user.tree_display_state, next_tree_display_state
            ):
                CRUDUser(db).update(
                    user_id,
                    "coins",
                    user.coins + DEFAULT_BONUS_COINS,
                )

            CRUDUser(db).update(user_id, "tree_display_state", next_tree_display_state)

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_create_user_mood_response(
    request: MoodRequest, token: str, db: Session
) -> MoodOut:
    try:
        user_id = get_token_data(token, "user_id")
        if not _can_record_mood(user_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        mood_in_model = MoodIn(mood=request.mood, user_id=user_id)
        db_mood_model = Mood(
            user_id=mood_in_model.user_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        CRUDMood(db).create(db_mood_model)
        _update_user(user_id, db)

        if _should_alert_admin(user_id, db):
            user = CRUDUser(db).get(user_id)
            admin = CRUDAdmin(db).get(user.admin_id)
            send_sad_user_notification_message(
                user.name, SHOULD_ALERT_ADMIN_CRITERION, f"+65{admin.contact_number}"
            )

        updated_user = CRUDUser(db).get(user_id)
        moods = CRUDMood(db).get_by({"user_id": user_id})
        return MoodOut(
            user_id=user_id,
            moods=[
                MoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
                for mood in moods
            ],
            coins=updated_user.coins,
            tree_display_state=updated_user.tree_display_state,
            consecutive_checkins=updated_user.consecutive_checkins,
            claimable_gifts=updated_user.claimable_gifts,
            can_record_mood=updated_user.can_record_mood,
            mood_message=_get_mood_message(),
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
