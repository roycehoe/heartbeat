from datetime import datetime

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from crud import CRUDCaregiver, CRUDCareReceipient
from schemas.crud import CRUDCareReceipientOut
from settings import AppSettings
from utils.whatsapp import (
    get_non_compliant_whatsapp_message_data,
    get_suspend_errant_user_whatsapp_message_data,
)
from gateway import send_whatsapp_message


def _is_errant_care_receipient(
    care_receipient: CRUDCareReceipientOut,
    errant_care_receipient_consecutive_non_checkin_criterion: int = AppSettings.ERRANT_USER_CONSECUTIVE_NON_CHECKIN_CRITERION,
) -> bool:
    return (
        care_receipient.consecutive_non_checkins
        % errant_care_receipient_consecutive_non_checkin_criterion
        == 0
    )


def _get_errant_care_receipients(db: Session) -> list[CRUDCareReceipientOut]:
    non_compliant_non_suspended = [
        CRUDCareReceipientOut.model_validate(cr)
        for cr in CRUDCareReceipient(db).get_by_all(
            {"can_record_mood": True, "is_suspended": False}
        )
    ]
    return [
        cr for cr in non_compliant_non_suspended if _is_errant_care_receipient(cr)
    ]


def _get_non_compliant_care_receipients(db: Session) -> list[CRUDCareReceipientOut]:
    return [
        CRUDCareReceipientOut.model_validate(cr)
        for cr in CRUDCareReceipient(db).get_by_all({"can_record_mood": True})
    ]


def _reset_all_care_receipient_can_record_mood_state(db: Session) -> None:
    all_care_receipients = [
        CRUDCareReceipientOut.model_validate(cr)
        for cr in CRUDCareReceipient(db).get_by_all({})
    ]
    for care_receipient in all_care_receipients:
        CRUDCareReceipient(db).update(care_receipient.id, "can_record_mood", True)


def _reset_non_compliant_care_receipients_consecutive_checkins(
    db: Session, non_compliant_care_receipients: list[CRUDCareReceipientOut]
) -> None:
    for care_receipient in non_compliant_care_receipients:
        CRUDCareReceipient(db).update(care_receipient.id, "consecutive_checkins", 0)


def _update_non_compliant_care_receipients_non_consecutive_checkins(
    db: Session, non_compliant_care_receipients: list[CRUDCareReceipientOut]
) -> None:
    for care_receipient in non_compliant_care_receipients:
        CRUDCareReceipient(db).update(
            care_receipient.id,
            "consecutive_non_checkins",
            care_receipient.consecutive_non_checkins + 1,
        )


def _suspend_errant_care_receipients(
    db: Session, non_compliant_care_receipients: list[CRUDCareReceipientOut]
) -> None:
    for care_receipient in non_compliant_care_receipients:
        if not _is_errant_care_receipient(care_receipient):
            continue
        CRUDCareReceipient(db).update(care_receipient.id, "is_suspended", True)


def _notify_caregivers_of_errant_care_receipient_suspension(
    db: Session, non_compliant_care_receipients: list[CRUDCareReceipientOut]
) -> None:
    for care_receipient in non_compliant_care_receipients:
        if care_receipient.is_suspended:
            continue
        caregiver = CRUDCaregiver(db).get(care_receipient.user_id)
        whatsapp_message_data = get_suspend_errant_user_whatsapp_message_data(
            f"65{caregiver.contact_number}",
            care_receipient.name,
        )
        send_whatsapp_message(whatsapp_message_data)


def _notify_caregiver_of_non_compliant_care_receipients(
    db: Session, non_compliant_care_receipients: list[CRUDCareReceipientOut]
) -> None:
    for care_receipient in non_compliant_care_receipients:
        if care_receipient.is_suspended:
            continue
        caregiver = CRUDCaregiver(db).get(care_receipient.user_id)
        whatsapp_message_data = get_non_compliant_whatsapp_message_data(
            f"65{caregiver.contact_number}",
            care_receipient.name,
            datetime.now(pytz.timezone("Asia/Singapore")),
        )
        send_whatsapp_message(whatsapp_message_data)


def _run_end_of_day_cron_job(db: Session) -> None:
    non_compliant_care_receipients = _get_non_compliant_care_receipients(db)
    _notify_caregiver_of_non_compliant_care_receipients(db, non_compliant_care_receipients)
    _reset_non_compliant_care_receipients_consecutive_checkins(
        db, non_compliant_care_receipients
    )
    _update_non_compliant_care_receipients_non_consecutive_checkins(
        db, non_compliant_care_receipients
    )

    errant_care_receipients = _get_errant_care_receipients(db)
    _notify_caregivers_of_errant_care_receipient_suspension(
        db, errant_care_receipients
    )
    _suspend_errant_care_receipients(db, errant_care_receipients)

    _reset_all_care_receipient_can_record_mood_state(db)


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(lambda: _run_end_of_day_cron_job(db), "cron", hour=0, minute=0)
    return scheduler
