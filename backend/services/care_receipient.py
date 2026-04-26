import random
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDCaregiver, CRUDMood, CRUDCareReceipient
from enums import AppLanguage, SelectedMood
from exceptions import (
    CareReceipientNotFoundException,
    DBDuplicateAccountException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
    InvalidCredentialsToAccessCareReceipient,
    NoRecordFoundException,
    CareReceipientNotUnderCurrentCaregiverException,
)
from models.care_receipient import CareReceipient
from models.mood import Mood
from schemas.crud import CRUDMoodOut, CRUDCareReceipientOut
from schemas.care_receipient import (
    CareReceipientDetailMoodOut,
    CareReceipientDetailOut,
    CareReceipientCreateRequest,
    CareReceipientDashboardMoodOut,
    CareReceipientDashboardOut,
    CareReceipientIn,
    CareReceipientLogInRequest,
    CareReceipientLoginUrlResponse,
    CareReceipientMoodIn,
    CareReceipientMoodOut,
    CareReceipientMoodRequest,
    CareReceipientToken,
    CareReceipientUpdateRequest,
)
from utils.mood import get_admin_dashboard_moods_out
from utils.token import create_access_token, get_token_data
from utils.whatsapp import get_consecutive_sad_moods_whatsapp_message_data
from gateway import send_whatsapp_message

SHOULD_ALERT_CAREGIVER_CRITERION = 2
DEFAULT_MOOD_MESSAGES_ENGLISH = (
    "Every day is a new beginning.",
    "You are stronger than you think.",
    "One small step today, a big difference tomorrow.",
    "Your smile is your superpower.",
    "Keep going, brighter days are ahead.",
    "You matter, and your story matters.",
    "Even slow progress is progress.",
    "You're never too old to dream.",
    "Your strength inspires others.",
    "Embrace today with hope.",
    "Your heart has seen many sunsets, and each is beautiful.",
    "You're not alone in this journey.",
    "Peace comes with patience.",
    "The best is yet to come.",
    "Take one moment at a time.",
    "Your courage brings light to others.",
    "Believe in yourself today.",
    "You are loved and cherished.",
    "Each breath is a blessing.",
    "Small joys can fill big hearts.",
    "You've overcome before, you will again.",
    "Happiness is within you.",
    "You're more capable than you know.",
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


def authenticate_care_receipient(
    request: CareReceipientLogInRequest, token: str, db: Session
) -> CareReceipientToken:
    try:
        care_receipient = CRUDCareReceipient(db).get(request.care_receipient_id)
        care_receipient_out = CRUDCareReceipientOut.model_validate(care_receipient)
        token_caregiver_id = int(get_token_data(token, "caregiver_id"))

        if care_receipient_out.user_id != token_caregiver_id:
            raise InvalidCredentialsToAccessCareReceipient

        access_token = create_access_token(
            {"care_receipient_id": care_receipient.id, "app_language": care_receipient.app_language}
        )
        return CareReceipientToken(access_token=access_token, token_type="bearer")

    except InvalidCredentialsToAccessCareReceipient:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials to access care receipient",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(care_receipient_id: int, db: Session) -> bool:
    try:
        return CRUDCareReceipientOut.model_validate(
            CRUDCareReceipient(db).get(care_receipient_id)
        ).can_record_mood
    except NoRecordFoundException:
        raise CareReceipientNotFoundException
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_care_receipient_dashboard_response(
    care_receipient_id: int, db: Session
) -> CareReceipientDashboardOut:
    try:
        mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})
        crud_moods_out = [CRUDMoodOut.model_validate(mood) for mood in mood_models]

        care_receipient_model = CRUDCareReceipient(db).get(care_receipient_id)
        crud_care_receipient_out = CRUDCareReceipientOut.model_validate(care_receipient_model)

        return CareReceipientDashboardOut(
            care_receipient_id=care_receipient_id,
            name=crud_care_receipient_out.name,
            alias=crud_care_receipient_out.alias,
            age=crud_care_receipient_out.age,
            race=crud_care_receipient_out.race,
            gender=crud_care_receipient_out.gender,
            postal_code=crud_care_receipient_out.postal_code,
            floor=crud_care_receipient_out.floor,
            moods=[
                CareReceipientDashboardMoodOut(mood=mood.mood, created_at=mood.created_at)
                for mood in crud_moods_out
            ],
            contact_number=crud_care_receipient_out.contact_number,
            consecutive_checkins=crud_care_receipient_out.consecutive_checkins,
            consecutive_non_checkins=crud_care_receipient_out.consecutive_non_checkins,
            can_record_mood=_can_record_mood(care_receipient_id, db),
        )

    except CareReceipientNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care receipient not found",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care receipient not found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def _get_mood_message(
    language: AppLanguage,
    english_mood_messages: tuple[str, ...] = DEFAULT_MOOD_MESSAGES_ENGLISH,
    chinese_mood_messages: tuple[str, ...] = DEFAULT_MOOD_MESSAGES_CHINESE,
) -> str:
    if language == AppLanguage.ENGLISH:
        return random.choice(english_mood_messages)
    return random.choice(chinese_mood_messages)


def _should_alert_caregiver(care_receipient_id: int, db: Session) -> bool:
    try:
        previous_mood_models = CRUDMood(db).get_latest(
            care_receipient_id, SHOULD_ALERT_CAREGIVER_CRITERION
        )
        previous_moods_crud_mood_out = [
            CRUDMoodOut.model_validate(i) for i in previous_mood_models
        ]
        if len(previous_moods_crud_mood_out) < SHOULD_ALERT_CAREGIVER_CRITERION:
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


def _update_care_receipient_mood_checkin(care_receipient_id: int, db: Session) -> None:
    try:
        CRUDCareReceipient(db).update(care_receipient_id, "is_suspended", False)
        CRUDCareReceipient(db).update(care_receipient_id, "can_record_mood", False)

        care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
        CRUDCareReceipient(db).update(
            care_receipient_id,
            "consecutive_checkins",
            care_receipient.consecutive_checkins + 1,
        )
        CRUDCareReceipient(db).update(
            care_receipient_id,
            "consecutive_non_checkins",
            0,
        )

        CRUDCareReceipient(db).get(care_receipient_id)

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care receipient mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_create_care_receipient_mood_response(
    request: CareReceipientMoodRequest, care_receipient_id: int, db: Session
) -> CareReceipientMoodOut:
    try:
        if not _can_record_mood(care_receipient_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        mood_in_model = CareReceipientMoodIn(mood=request.mood, care_receipient_id=care_receipient_id)
        db_mood_model = Mood(
            care_receipient_id=mood_in_model.care_receipient_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        CRUDMood(db).create(db_mood_model)
        _update_care_receipient_mood_checkin(care_receipient_id, db)

        care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
        crud_care_receipient_out = CRUDCareReceipientOut.model_validate(care_receipient)
        if _should_alert_caregiver(care_receipient_id, db):
            caregiver = CRUDCaregiver(db).get(crud_care_receipient_out.user_id)
            whatsapp_message = get_consecutive_sad_moods_whatsapp_message_data(
                f"+65{caregiver.contact_number}",
                crud_care_receipient_out.name,
                SHOULD_ALERT_CAREGIVER_CRITERION,
            )
            send_whatsapp_message(whatsapp_message)

        mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})

        crud_moods_out = [CRUDMoodOut.model_validate(mood) for mood in mood_models]
        app_language = crud_care_receipient_out.app_language
        return CareReceipientMoodOut(
            care_receipient_id=care_receipient_id,
            moods=[
                CareReceipientMoodIn(
                    mood=mood.mood,
                    care_receipient_id=mood.care_receipient_id,
                    created_at=mood.created_at,
                )
                for mood in crud_moods_out
            ],
            consecutive_checkins=crud_care_receipient_out.consecutive_checkins,
            consecutive_non_checkins=crud_care_receipient_out.consecutive_non_checkins,
            can_record_mood=crud_care_receipient_out.can_record_mood,
            mood_message=_get_mood_message(app_language),
        )

    except CareReceipientNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care receipient not found",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care receipient mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_create_care_receipient_response(
    request: CareReceipientCreateRequest, token: str, db: Session
) -> None:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipient_in_model = CareReceipientIn(**request.model_dump(by_alias=True))
        db_care_receipient_model = CareReceipient(
            name=care_receipient_in_model.name,
            contact_number=care_receipient_in_model.contact_number,
            age=care_receipient_in_model.age,
            alias=care_receipient_in_model.alias,
            app_language=care_receipient_in_model.app_language,
            race=care_receipient_in_model.race,
            gender=care_receipient_in_model.gender,
            postal_code=care_receipient_in_model.postal_code,
            floor=care_receipient_in_model.floor,
            block=care_receipient_in_model.block,
            unit=care_receipient_in_model.unit,
            consecutive_checkins=0,
            consecutive_non_checkins=0,
            user_id=caregiver_id,
            can_record_mood=True,
            created_at=care_receipient_in_model.created_at,
        )
        CRUDCareReceipient(db).create(db_care_receipient_model)
        return

    except DifferentPasswordAndConfirmPasswordException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
        )
    except DBDuplicateAccountException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with username already exists",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def get_delete_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [
            cr.id for cr in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException
        return CRUDCareReceipient(db).delete(care_receipient_id)

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot delete care receipient that is not under current caregiver",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of care receipient found",
        )


def get_update_care_receipient_response(
    care_receipient_id: int,
    request: CareReceipientUpdateRequest,
    token: str,
    db: Session,
) -> None:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [
            cr.id for cr in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException

        for key, value in request.model_dump(exclude={"confirm_password"}).items():
            CRUDCareReceipient(db).update(care_receipient_id, key, value)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of care receipient found",
        )


def get_suspend_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [
            cr.id for cr in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDCareReceipient(db).update(care_receipient_id, "is_suspended", True)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of care receipient found",
        )


def get_unsuspend_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [
            cr.id for cr in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDCareReceipient(db).update(care_receipient_id, "is_suspended", False)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of care receipient found",
        )


def get_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> CareReceipientDetailOut:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [
            cr.id for cr in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException

        care_receipient_model = CRUDCareReceipient(db).get(care_receipient_id)
        crud_care_receipient_out = CRUDCareReceipientOut.model_validate(
            care_receipient_model
        )

        crud_moods_out = [
            CRUDMoodOut.model_validate(mood)
            for mood in crud_care_receipient_out.moods
        ]
        dashboard_moods_out = get_admin_dashboard_moods_out(
            crud_moods_out, crud_care_receipient_out.created_at, datetime.today()
        )

        return CareReceipientDetailOut(
            care_receipient_id=crud_care_receipient_out.id,
            contact_number=crud_care_receipient_out.contact_number,
            name=crud_care_receipient_out.name,
            alias=crud_care_receipient_out.alias,
            age=crud_care_receipient_out.age,
            race=crud_care_receipient_out.race,
            gender=crud_care_receipient_out.gender,
            postal_code=crud_care_receipient_out.postal_code,
            floor=crud_care_receipient_out.floor,
            block=crud_care_receipient_out.block,
            unit=crud_care_receipient_out.unit,
            moods=[
                CareReceipientDetailMoodOut.model_validate(mood)
                for mood in dashboard_moods_out
            ],
            consecutive_checkins=crud_care_receipient_out.consecutive_checkins,
            consecutive_non_checkins=crud_care_receipient_out.consecutive_non_checkins,
            can_record_mood=_can_record_mood(crud_care_receipient_out.id, db),
            is_suspended=crud_care_receipient_out.is_suspended,
        )

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot get care receipient that is not under current caregiver",
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of care receipient found",
        )


def get_care_receipient_login_url_response(
    care_receipient_id: int, token: str, db: Session
) -> CareReceipientLoginUrlResponse:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}
        )
        if care_receipient_id not in [care_receipient.id for care_receipient in care_receipients_under_caregiver]:
            raise CareReceipientNotUnderCurrentCaregiverException
        return CareReceipientLoginUrlResponse(
            url=f"https://heartbeat.carecompass.sg/{care_receipient_id}"
        )
    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot get login URL for care receipient that is not under current caregiver",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
