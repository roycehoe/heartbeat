import random

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import AppLanguage, SelectedMood
from exceptions import (
    DBException,
    InvalidCredentialsToAccessUser,
    NoRecordFoundException,
)
from models import Mood
from schemas.crud import CRUDMoodOut, CRUDUserOut
from schemas.user import (
    UserDashboardMoodOut,
    UserDashboardOut,
    UserLogInRequest,
    UserMoodIn,
    UserMoodOut,
    UserMoodRequest,
    UserToken,
)
from utils.hashing import verify_password
from utils.token import create_access_token, get_token_data
from utils.whatsapp import get_consecutive_sad_moods_whatsapp_message_data
from gateway import send_whatsapp_message

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


def authenticate_user(request: UserLogInRequest, token: str, db: Session) -> UserToken:
    try:
        user = CRUDUser(db).get(request.user_id)
        user_out = CRUDUserOut.model_validate(user)
        token_admin_id = int(get_token_data(token, "admin_id"))

        if user_out.user_id != token_admin_id:
            raise InvalidCredentialsToAccessUser

        access_token = create_access_token(
            {"user_id": user.id, "app_language": user.app_language}
        )
        return UserToken(access_token=access_token, token_type="bearer")

    except InvalidCredentialsToAccessUser:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials to access user",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUserOut.model_validate(CRUDUser(db).get(user_id)).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_user_dashboard_response(token: str, db: Session) -> UserDashboardOut:
    user_id: int = get_token_data(token, "user_id")
    mood_models = CRUDMood(db).get_by({"care_receipient_id": user_id})
    crud_moods_out = [CRUDMoodOut.model_validate(mood) for mood in mood_models]

    user_model = CRUDUser(db).get(user_id)
    crud_user_out = CRUDUserOut.model_validate(user_model)

    return UserDashboardOut(
        user_id=user_id,
        name=crud_user_out.name,
        alias=crud_user_out.alias,
        age=crud_user_out.age,
        race=crud_user_out.race,
        gender=crud_user_out.gender,
        postal_code=crud_user_out.postal_code,
        floor=crud_user_out.floor,
        moods=[
            UserDashboardMoodOut(mood=mood.mood, created_at=mood.created_at)
            for mood in crud_moods_out
        ],
        contact_number=crud_user_out.contact_number,
        consecutive_checkins=crud_user_out.consecutive_checkins,
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
        previous_mood_models = CRUDMood(db).get_latest(
            user_id, SHOULD_ALERT_ADMIN_CRITERION
        )
        previous_moods_crud_mood_out = [
            CRUDMoodOut.model_validate(i) for i in previous_mood_models
        ]
        if len(previous_moods_crud_mood_out) < SHOULD_ALERT_ADMIN_CRITERION:
            return False
        for previous_mood in previous_moods_crud_mood_out:
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
        user_id: int = get_token_data(token, "user_id")
        if not _can_record_mood(user_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        mood_in_model = UserMoodIn(mood=request.mood, user_id=user_id)
        db_mood_model = Mood(
            care_receipient_id=mood_in_model.user_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        CRUDMood(db).create(db_mood_model)
        _update_user(user_id, db)

        if _should_alert_admin(user_id, db):
            user = CRUDUser(db).get(user_id)
            crud_user_out = CRUDUserOut.model_validate(user)
            admin = CRUDAdmin(db).get(crud_user_out.user_id)
            whatsapp_message = get_consecutive_sad_moods_whatsapp_message_data(
                f"+65{admin.contact_number}",
                crud_user_out.name,
                SHOULD_ALERT_ADMIN_CRITERION,
            )
            send_whatsapp_message(whatsapp_message)

        updated_user = CRUDUser(db).get(user_id)
        crud_updated_user_out = CRUDUserOut.model_validate(updated_user)

        mood_models = CRUDMood(db).get_by({"care_receipient_id": user_id})
        crud_moods_out = [CRUDMoodOut.model_validate(mood) for mood in mood_models]

        app_language: AppLanguage = get_token_data(token, "app_language")

        return UserMoodOut(
            user_id=user_id,
            moods=[
                UserMoodIn(
                    mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at
                )
                for mood in crud_moods_out
            ],
            consecutive_checkins=crud_updated_user_out.consecutive_checkins,
            can_record_mood=crud_updated_user_out.can_record_mood,
            mood_message=_get_mood_message(app_language),
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
