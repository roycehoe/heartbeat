from datetime import datetime

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDUser
from schemas.crud import CRUDUserOut
from settings import AppSettings
from utils.whatsapp import (
    get_non_compliant_whatsapp_message_data,
    get_suspend_errant_user_whatsapp_message_data,
)
from gateway import send_whatsapp_message


def _is_errant_user(
    user: CRUDUserOut,
    errant_user_consecutive_non_checkin_criterion: int = AppSettings.ERRANT_USER_CONSECUTIVE_NON_CHECKIN_CRITERION,
) -> bool:
    return (
        user.consecutive_non_checkins % errant_user_consecutive_non_checkin_criterion
        == 0
    )


def _get_errant_users(db: Session) -> list[CRUDUserOut]:
    non_compliant_non_suspended_users = [
        CRUDUserOut.model_validate(user)
        for user in CRUDUser(db).get_by_all(
            {"can_record_mood": True, "is_suspended": False}
        )
    ]
    return [user for user in non_compliant_non_suspended_users if _is_errant_user(user)]


def _get_non_compliant_users(db: Session) -> list[CRUDUserOut]:
    return [
        CRUDUserOut.model_validate(user)
        for user in CRUDUser(db).get_by_all({"can_record_mood": True})
    ]


def _reset_all_user_can_record_mood_state(db: Session) -> None:
    all_users = [
        CRUDUserOut.model_validate(user) for user in CRUDUser(db).get_by_all({})
    ]
    for user in all_users:
        CRUDUser(db).update(user.id, "can_record_mood", True)


def _reset_non_compliant_users_consecutive_checkins(
    db: Session, non_compliant_users: list[CRUDUserOut]
) -> None:
    for user in non_compliant_users:
        CRUDUser(db).update(user.id, "consecutive_checkins", 0)


def _update_non_compliant_users_non_consecutive_checkins(
    db: Session, non_compliant_users: list[CRUDUserOut]
) -> None:
    for user in non_compliant_users:
        CRUDUser(db).update(
            user.id, "consecutive_non_checkins", user.consecutive_non_checkins + 1
        )


def _suspend_notifications_for_errant_users(
    db: Session, non_compliant_users: list[CRUDUserOut]
) -> None:
    for user in non_compliant_users:
        if not _is_errant_user(user):
            continue
        CRUDUser(db).update(user.id, "is_suspended", True)


def _notify_admins_of_errant_user_suspension(
    db: Session, non_compliant_users: list[CRUDUserOut]
) -> None:
    for user in non_compliant_users:
        if user.is_suspended:
            continue
        admin = CRUDAdmin(db).get(user.user_id)
        whatsapp_message_data = get_suspend_errant_user_whatsapp_message_data(
            f"65{admin.contact_number}",
            admin.name,
            user.name,
            datetime.now(pytz.timezone("Asia/Singapore")),
        )
        send_whatsapp_message(whatsapp_message_data)


def _notify_admin_of_non_compliant_users(
    db: Session, non_compliant_users: list[CRUDUserOut]
) -> None:
    for user in non_compliant_users:
        if user.is_suspended:
            continue
        admin = CRUDAdmin(db).get(user.user_id)
        whatsapp_message_data = get_non_compliant_whatsapp_message_data(
            f"65{admin.contact_number}",
            user.name,
            datetime.now(pytz.timezone("Asia/Singapore")),
        )
        send_whatsapp_message(whatsapp_message_data)


def _run_end_of_day_cron_job(db: Session) -> None:
    non_compliant_users = _get_non_compliant_users(db)
    _notify_admin_of_non_compliant_users(db, non_compliant_users)
    _reset_non_compliant_users_consecutive_checkins(db, non_compliant_users)
    _update_non_compliant_users_non_consecutive_checkins(db, non_compliant_users)

    errant_users = _get_errant_users(db)
    _notify_admins_of_errant_user_suspension(db, errant_users)
    _suspend_notifications_for_errant_users(db, errant_users)

    _reset_all_user_can_record_mood_state(db)


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(lambda: _run_end_of_day_cron_job(db), "cron", hour=0, minute=0)
    return scheduler
