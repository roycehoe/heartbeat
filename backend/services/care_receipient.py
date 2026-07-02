import random
import secrets
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlmodel import Session

from crud import CRUDCaregiver, CRUDCareReceipient, CRUDMagicLinkToken, CRUDMood
from enums import AppLanguage, SelectedMood
from exceptions import (
    CareReceipientNotFoundException,
    CareReceipientNotUnderCurrentCaregiverException,
    DBDuplicateAccountException,
    DifferentPasswordAndConfirmPasswordException,
    InvalidCredentialsToAccessCareReceipient,
    NoRecordFoundException,
)
from models.care_receipient import CareReceipient
from models.magic_link_token import MagicLinkToken
from models.mood import Mood
from schemas.care_receipient import (
    CareReceipientCreateRequest,
    CareReceipientDashboardMoodData,
    GetCareReceipientDashboardResponse,
    CareReceipientDetailMoodData,
    GetCareReceipientDetailResponse,
    CareReceipientLoginUrlResponse,
    CreateCareReceipientMoodResponse,
    CareReceipientMoodRequest,
    CareReceipientToken,
    CareReceipientUpdateRequest,
    MagicLinkVerifyRequest,
)
from settings import AppSettings
from utils.mood import get_admin_dashboard_moods_out
from utils.token import create_access_token, get_optional_token_data, get_token_data
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

DEFAULT_MOOD_MESSAGES_MALAY = (
    "Setiap hari adalah permulaan baru.",
    "Anda lebih kuat dari yang anda sangka.",
    "Satu langkah kecil hari ini, perubahan besar esok.",
    "Senyuman anda adalah kekuatan anda.",
    "Teruskan, hari yang lebih cerah menanti.",
    "Anda penting, dan kisah anda bermakna.",
    "Walaupun lambat, ia tetap kemajuan.",
    "Tidak pernah terlambat untuk bermimpi.",
    "Kekuatan anda memberi inspirasi kepada orang lain.",
    "Sambut hari ini dengan penuh harapan.",
    "Hati anda telah menyaksikan banyak senja, setiap satunya indah.",
    "Anda tidak bersendirian dalam perjalanan ini.",
    "Ketenangan datang bersama kesabaran.",
    "Yang terbaik masih belum tiba.",
    "Ambil satu langkah pada satu masa.",
    "Keberanian anda menerangi orang lain.",
    "Percayalah pada diri anda hari ini.",
    "Anda dicintai dan dihargai.",
    "Setiap nafas adalah satu nikmat.",
    "Kegembiraan kecil boleh memenuhi hati yang besar.",
    "Anda pernah mengatasi cabaran sebelum ini, anda boleh lakukan lagi.",
    "Kebahagiaan ada dalam diri anda.",
    "Anda lebih mampu dari yang anda tahu.",
    "Anda adalah hadiah kepada dunia.",
    "Kekuatan tumbuh daripada setiap cabaran.",
    "Kehadiran anda menerangi dunia.",
    "Hari ini milik anda untuk dijadikan indah.",
    "Fokus pada kebaikan di sekeliling anda.",
    "Ketabahan anda adalah kekuatan anda.",
    "Hargai setiap hari sebagai pengembaraan baru.",
)

DEFAULT_MOOD_MESSAGES_TAMIL = (
    "ஒவ்வொரு நாளும் ஒரு புதிய தொடக்கம்.",
    "நீங்கள் நினைப்பதை விட வலிமையானவர்.",
    "இன்றைய சிறிய அடி, நாளைய பெரிய மாற்றம்.",
    "உங்கள் புன்னகை உங்கள் ஆற்றல்.",
    "தொடர்ந்து செல்லுங்கள், பிரகாசமான நாட்கள் காத்திருக்கின்றன.",
    "நீங்கள் முக்கியமானவர், உங்கள் கதையும் முக்கியமானது.",
    "மெதுவான முன்னேற்றமும் முன்னேற்றமே.",
    "கனவு காண்பதற்கு ஒருபோதும் தாமதமில்லை.",
    "உங்கள் வலிமை மற்றவர்களுக்கு உத்வேகம் அளிக்கிறது.",
    "இன்றை நம்பிக்கையுடன் வரவேற்கவும்.",
    "உங்கள் இதயம் பல அஸ்தமனங்களை கண்டது, ஒவ்வொன்றும் அழகானது.",
    "இந்த பயணத்தில் நீங்கள் தனியாக இல்லை.",
    "பொறுமையுடன் அமைதி வரும்.",
    "சிறந்தது இன்னும் வரவில்லை.",
    "ஒரு நேரத்தில் ஒரு அடி எடுத்து வையுங்கள்.",
    "உங்கள் தைரியம் மற்றவர்களுக்கு ஒளி தருகிறது.",
    "இன்று உங்களை நம்புங்கள்.",
    "நீங்கள் நேசிக்கப்படுகிறீர்கள், மதிக்கப்படுகிறீர்கள்.",
    "ஒவ்வொரு மூச்சும் ஒரு ஆசீர்வாதம்.",
    "சிறிய மகிழ்ச்சிகள் பெரிய இதயங்களை நிரப்பலாம்.",
    "நீங்கள் முன்பும் சவால்களை வென்றீர்கள், மீண்டும் வெல்வீர்கள்.",
    "மகிழ்ச்சி உங்களுக்குள்ளேயே உள்ளது.",
    "உங்களுக்குத் தெரிவதை விட நீங்கள் அதிகம் செய்யக்கூடியவர்.",
    "நீங்கள் உலகிற்கு ஒரு கொடை.",
    "ஒவ்வொரு சவாலிலும் வலிமை வளர்கிறது.",
    "உங்கள் இருப்பு உலகை பிரகாசமாக்குகிறது.",
    "இன்று உங்களுக்கு அழகாக்கும் நாள்.",
    "உங்கள் சுற்றுப்புறத்தில் உள்ள நன்மைகளில் கவனம் செலுத்துங்கள்.",
    "உங்கள் மனவுறுதி உங்கள் ஆற்றல்.",
    "ஒவ்வொரு நாளையும் ஒரு புதிய சாகசமாக மதியுங்கள்.",
)


def _can_record_mood(care_receipient_id: int, db: Session) -> bool:
    care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
    if care_receipient is None:
        raise CareReceipientNotFoundException
    return care_receipient.can_record_mood


def _authenticate_care_receipient(
    care_receipient_id: int, token: str, db: Session
) -> None:
    """Reject the request unless the caller's token belongs to this care receipient
    and the magic-link session that issued it has not been revoked."""
    token_care_receipient_id = get_token_data(token, "care_receipient_id")
    if int(token_care_receipient_id) != care_receipient_id:
        raise InvalidCredentialsToAccessCareReceipient

    token_magic_link_token_id = get_optional_token_data(token, "magic_link_token_id")
    if token_magic_link_token_id is None:
        raise InvalidCredentialsToAccessCareReceipient
    if CRUDMagicLinkToken(db).get_by_id(int(token_magic_link_token_id)) is None:
        raise InvalidCredentialsToAccessCareReceipient


def get_care_receipient_dashboard_response(
    care_receipient_id: int, token: str, db: Session
) -> GetCareReceipientDashboardResponse:
    try:
        _authenticate_care_receipient(care_receipient_id, token, db)
        mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})
        care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
        if care_receipient is None:
            raise NoRecordFoundException

        return GetCareReceipientDashboardResponse(
            care_receipient_id=care_receipient_id,
            app_language=care_receipient.app_language,
            moods=[
                CareReceipientDashboardMoodData(mood=mood.mood, created_at=mood.created_at)
                for mood in mood_models
            ],
            consecutive_checkins=care_receipient.consecutive_checkins,
            can_record_mood=_can_record_mood(care_receipient_id, db),
        )

    except InvalidCredentialsToAccessCareReceipient:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials to access care receipient",
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


_MOOD_MESSAGES: dict[AppLanguage, tuple[str, ...]] = {
    AppLanguage.ENGLISH: DEFAULT_MOOD_MESSAGES_ENGLISH,
    AppLanguage.CHINESE: DEFAULT_MOOD_MESSAGES_CHINESE,
    AppLanguage.MALAY: DEFAULT_MOOD_MESSAGES_MALAY,
    AppLanguage.TAMIL: DEFAULT_MOOD_MESSAGES_TAMIL,
}


def _get_mood_message(language: AppLanguage) -> str:
    messages = _MOOD_MESSAGES.get(language, DEFAULT_MOOD_MESSAGES_ENGLISH)
    return random.choice(messages)


def _should_alert_caregiver(care_receipient_id: int, db: Session) -> bool:
    previous_moods = CRUDMood(db).get_latest(
        care_receipient_id, SHOULD_ALERT_CAREGIVER_CRITERION
    )
    if len(previous_moods) < SHOULD_ALERT_CAREGIVER_CRITERION:
        return False
    for mood in previous_moods:
        if mood.mood != SelectedMood.SAD:
            return False
    return True


def _update_care_receipient_mood_checkin(care_receipient_id: int, db: Session) -> None:
    care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
    if care_receipient is None:
        raise NoRecordFoundException
    CRUDCareReceipient(db).unsuspend(care_receipient)
    CRUDCareReceipient(db).mark_mood_recorded(care_receipient)
    CRUDCareReceipient(db).increment_consecutive_checkins(care_receipient)
    CRUDCareReceipient(db).reset_consecutive_non_checkins(care_receipient)


def get_create_care_receipient_mood_response(
    request: CareReceipientMoodRequest, care_receipient_id: int, token: str, db: Session
) -> CreateCareReceipientMoodResponse:
    try:
        _authenticate_care_receipient(care_receipient_id, token, db)
        if not _can_record_mood(care_receipient_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        db_mood_model = Mood(
            care_receipient_id=care_receipient_id,
            mood=request.mood,
            created_at=datetime.now(timezone.utc),
        )
        CRUDMood(db).create(db_mood_model)
        _update_care_receipient_mood_checkin(care_receipient_id, db)

        care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
        if care_receipient is None:
            raise NoRecordFoundException
        if _should_alert_caregiver(care_receipient_id, db):
            caregiver = CRUDCaregiver(db).get(care_receipient.user_id)
            if caregiver is not None:
                whatsapp_message = get_consecutive_sad_moods_whatsapp_message_data(
                    f"+65{caregiver.contact_number}",
                    care_receipient.name,
                    SHOULD_ALERT_CAREGIVER_CRITERION,
                )
                send_whatsapp_message(whatsapp_message)

        mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})
        return CreateCareReceipientMoodResponse(
            care_receipient_id=care_receipient_id,
            moods=mood_models,
            consecutive_checkins=care_receipient.consecutive_checkins,
            consecutive_non_checkins=care_receipient.consecutive_non_checkins,
            can_record_mood=care_receipient.can_record_mood,
            mood_message=_get_mood_message(care_receipient.app_language),
        )

    except InvalidCredentialsToAccessCareReceipient:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials to access care receipient",
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


def get_create_care_receipient_response(
    request: CareReceipientCreateRequest, token: str, db: Session
) -> None:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        db_care_receipient_model = CareReceipient(
            name=request.name,
            contact_number=request.contact_number,
            age_range=request.age_range,
            app_language=request.app_language,
            race=request.race,
            gender=request.gender,
            postal_code=request.postal_code,
            floor=request.floor,
            block=request.block,
            unit=request.unit,
            consecutive_checkins=0,
            consecutive_non_checkins=0,
            user_id=token_caregiver_id,
            can_record_mood=True,
            created_at=datetime.now(timezone.utc),
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


def get_delete_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": token_caregiver_id}
        )
        care_receipient = next(
            (
                care_receipient
                for care_receipient in care_receipients_under_caregiver
                if care_receipient.id == care_receipient_id
            ),
            None,
        )
        if care_receipient is None:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDMagicLinkToken(db).delete_by_care_receipient_id(care_receipient_id)
        CRUDCareReceipient(db).delete(care_receipient)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot delete care receipient that is not under current caregiver",
        )


def get_update_care_receipient_response(
    care_receipient_id: int,
    request: CareReceipientUpdateRequest,
    token: str,
    db: Session,
) -> None:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": token_caregiver_id}
        )
        care_receipient = next(
            (
                care_receipient
                for care_receipient in care_receipients_under_caregiver
                if care_receipient.id == care_receipient_id
            ),
            None,
        )
        if care_receipient is None:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDCareReceipient(db).update_profile(
            care_receipient, request.model_dump(exclude={"confirm_password"})
        )
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )


def get_suspend_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": token_caregiver_id}
        )
        care_receipient = next(
            (
                care_receipient
                for care_receipient in care_receipients_under_caregiver
                if care_receipient.id == care_receipient_id
            ),
            None,
        )
        if care_receipient is None:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDCareReceipient(db).suspend(care_receipient)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )


def get_unsuspend_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> None:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": token_caregiver_id}
        )
        care_receipient = next(
            (
                care_receipient
                for care_receipient in care_receipients_under_caregiver
                if care_receipient.id == care_receipient_id
            ),
            None,
        )
        if care_receipient is None:
            raise CareReceipientNotUnderCurrentCaregiverException
        CRUDCareReceipient(db).unsuspend(care_receipient)
        return

    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update care receipient that is not under current caregiver",
        )


def get_care_receipient_response(
    care_receipient_id: int, token: str, db: Session
) -> GetCareReceipientDetailResponse:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
            {"user_id": token_caregiver_id}
        )
        if care_receipient_id not in [
            care_receipient.id
            for care_receipient in care_receipients_under_caregiver
        ]:
            raise CareReceipientNotUnderCurrentCaregiverException

        care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
        if care_receipient is None:
            raise NoRecordFoundException
        dashboard_moods_out = get_admin_dashboard_moods_out(
            care_receipient.moods, care_receipient.created_at, datetime.today()
        )

        return GetCareReceipientDetailResponse(
            care_receipient_id=care_receipient.id,
            contact_number=care_receipient.contact_number,
            name=care_receipient.name,
            age_range=care_receipient.age_range,
            race=care_receipient.race,
            gender=care_receipient.gender,
            postal_code=care_receipient.postal_code,
            floor=care_receipient.floor,
            block=care_receipient.block,
            unit=care_receipient.unit,
            app_language=care_receipient.app_language,
            moods=[
                CareReceipientDetailMoodData(mood=mood.mood, created_at=mood.created_at)
                for mood in dashboard_moods_out
            ],
            consecutive_checkins=care_receipient.consecutive_checkins,
            consecutive_non_checkins=care_receipient.consecutive_non_checkins,
            can_record_mood=_can_record_mood(care_receipient.id, db),
            is_suspended=care_receipient.is_suspended,
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


def _assert_caregiver_owns_care_receipient(
    caregiver_id: int, care_receipient_id: int, db: Session
) -> None:
    care_receipients_under_caregiver = CRUDCareReceipient(db).get_by_all(
        {"user_id": caregiver_id}
    )
    if care_receipient_id not in [care_receipient.id for care_receipient in care_receipients_under_caregiver]:
        raise CareReceipientNotUnderCurrentCaregiverException


def _create_magic_link_token(care_receipient_id: int, db: Session) -> str:
    raw_token = secrets.token_urlsafe(32)
    CRUDMagicLinkToken(db).create(
        MagicLinkToken(token=raw_token, care_receipient_id=care_receipient_id)
    )
    return raw_token


def get_care_receipient_login_url_response(
    care_receipient_id: int, token: str, db: Session
) -> CareReceipientLoginUrlResponse:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        _assert_caregiver_owns_care_receipient(token_caregiver_id, care_receipient_id, db)

        existing = CRUDMagicLinkToken(db).get_by_care_receipient_id(care_receipient_id)
        raw_token = (
            existing.token
            if existing is not None
            else _create_magic_link_token(care_receipient_id, db)
        )

        return CareReceipientLoginUrlResponse(
            url=f"{AppSettings.FRONTEND_BASE_URL}/login/{raw_token}"
        )
    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot get login URL for care receipient that is not under current caregiver",
        )


def revoke_magic_link_token_response(
    care_receipient_id: int, token: str, db: Session
) -> CareReceipientLoginUrlResponse:
    try:
        token_caregiver_id = get_token_data(token, "caregiver_id")
        _assert_caregiver_owns_care_receipient(token_caregiver_id, care_receipient_id, db)

        CRUDMagicLinkToken(db).delete_by_care_receipient_id(care_receipient_id)
        raw_token = _create_magic_link_token(care_receipient_id, db)

        return CareReceipientLoginUrlResponse(
            url=f"{AppSettings.FRONTEND_BASE_URL}/login/{raw_token}"
        )
    except CareReceipientNotUnderCurrentCaregiverException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot revoke login URL for care receipient that is not under current caregiver",
        )


def verify_magic_link_token_response(
    request: MagicLinkVerifyRequest, db: Session
) -> CareReceipientToken:
    try:
        magic_link = CRUDMagicLinkToken(db).get_by_token(request.token)
        if magic_link is None:
            raise NoRecordFoundException

        care_receipient = CRUDCareReceipient(db).get(magic_link.care_receipient_id)
        if care_receipient is None:
            raise NoRecordFoundException
        access_token = create_access_token(
            {
                "care_receipient_id": care_receipient.id,
                "magic_link_token_id": magic_link.id,
            }
        )
        return CareReceipientToken(access_token=access_token, token_type="bearer")

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked login link",
        )
