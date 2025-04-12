import random

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import AppLanguage, SelectedMood
from exceptions import (
    DBException,
    InvalidUsernameOrPasswordException,
    NoRecordFoundException,
)
from gateway import send_sad_user_notification_message
from models import Mood
from schemas.user import (
    UserDashboardOut,
    UserLogInRequest,
    UserMoodIn,
    UserMoodOut,
    UserMoodRequest,
    UserToken,
)
from utils.hashing import verify_password
from utils.token import create_access_token, get_token_data

SHOULD_ALERT_ADMIN_CRITERION = 2
DEFAULT_MOOD_MESSAGES_ENGLISH = (
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

DEFAULT_MOOD_MESSAGES_CHINESE = (
    "每一天都是新的开始。",
    "你比自己想象的更坚强。",
    "今天的一小步，明天的一大步。",
    "你的微笑是你的超能力。",
    "继续前行，光明的日子在前方。",
    "你很重要，你的故事也很重要。",
    "哪怕进展缓慢，也是进步。",
    "梦想永远不嫌晚。",
    "你的坚强激励着他人。",
    "以希望迎接今天。",
    "你的心目睹了许多日落，每一个都很美。",
    "你并不孤单，这是一段共同的旅程。",
    "宁静源于耐心。",
    "最好的尚未到来。",
    "一步一个脚印，慢慢来。",
    "你的勇气照亮他人。",
    "相信今天的自己。",
    "你被爱着，被珍惜着。",
    "每一次呼吸都是恩赐。",
    "小小的快乐也能填满一颗大大的心。",
    "你曾经战胜困难，现在也可以。",
    "幸福源于你的内心。",
    "你比自己所知的更有能力。",
    "你是这个世界的礼物。",
    "力量在每一次挑战中成长。",
    "有你的世界更明亮。",
    "今天是你创造美好的一天。",
    "关注你周围的美好。",
    "你的坚韧就是你的力量。",
    "珍惜每一天，把它当作新的冒险。",
)


def authenticate_user(request: UserLogInRequest, db: Session) -> UserToken:
    try:
        user = CRUDUser(db).get_by({"username": request.username})
        if not verify_password(request.password, str(user.password)):
            raise InvalidUsernameOrPasswordException

        access_token = create_access_token(
            {"user_id": user.id, "app_language": user.app_language}
        )
        return UserToken(access_token=access_token, token_type="bearer")

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
        )
    except InvalidUsernameOrPasswordException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
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


def get_user_dashboard_response(token: str, db: Session) -> UserDashboardOut:
    user_id = get_token_data(token, "user_id")
    moods = CRUDMood(db).get_by({"user_id": user_id})
    user = CRUDUser(db).get(user_id)
    return UserDashboardOut(
        user_id=user_id,
        username=user.username,
        name=user.name,
        alias=user.alias,
        age=user.age,
        race=user.race,
        gender=user.gender,
        postal_code=user.postal_code,
        floor=user.floor,
        moods=[
            UserMoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
            for mood in moods
        ],
        contact_number=user.contact_number,
        consecutive_checkins=user.consecutive_checkins,
        can_record_mood=_can_record_mood(user_id, db),
    )


def _get_mood_message(
    language: AppLanguage,
    english_mood_messages: tuple[str, ...] = DEFAULT_MOOD_MESSAGES_ENGLISH,
    chinese_mood_messages: tuple[str, ...] = DEFAULT_MOOD_MESSAGES_CHINESE,
) -> str:
    if language == AppLanguage.ENGLISH:
        return random.choice(english_mood_messages)
    return random.choice(chinese_mood_messages)


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


def _update_user(user_id: int, db: Session) -> None:
    try:
        CRUDUser(db).update(user_id, "can_record_mood", False)

        user = CRUDUser(db).get(user_id)
        CRUDUser(db).update(
            user_id,
            "consecutive_checkins",
            user.consecutive_checkins + 1,
        )

        user = CRUDUser(db).get(user_id)

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_create_user_mood_response(
    request: UserMoodRequest, token: str, db: Session
) -> UserMoodOut:
    try:
        user_id = get_token_data(token, "user_id")
        if not _can_record_mood(user_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        mood_in_model = UserMoodIn(mood=request.mood, user_id=user_id)
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

        app_language = get_token_data(token, "app_language")

        return UserMoodOut(
            user_id=user_id,
            moods=[
                UserMoodIn(
                    mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at
                )
                for mood in moods
            ],
            consecutive_checkins=updated_user.consecutive_checkins,
            can_record_mood=updated_user.can_record_mood,
            mood_message=_get_mood_message(app_language),
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
