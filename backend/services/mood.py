from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from enums import SelectedMood, TreeDisplayState
from exceptions import DBException, NoRecordFoundException
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_token_data

SHOULD_ALERT_CAREGIVER_CRITERION = 5
DEFAULT_COINS_INCREASE_ON_MOOD_RECORDED = 10
DEFAULT_BONUS_COINS = 250


def _should_alert_caregiver(user_id: int, db: Session) -> bool:
    try:
        previous_moods = CRUDMood(db).get_latest(
            user_id, SHOULD_ALERT_CAREGIVER_CRITERION
        )
        if len(previous_moods) < SHOULD_ALERT_CAREGIVER_CRITERION:
            return False
        for previous_mood in previous_moods:
            if previous_mood != SelectedMood.SAD:
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
) -> None:
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

        if _should_alert_caregiver(user_id, db):
            print("ALERT CAREGIVER!!!!!")  # TODO: Implement caregiver alert here

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
