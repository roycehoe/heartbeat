from datetime import datetime, timedelta
from random import choice, sample

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import TreeDisplayState
from gateway import send_non_compliant_user_notification_message
from models import Admin, Mood, User
from utils.hashing import hash_password


def _generate_mood_data_compliant_user(user_id=1, end_date=datetime.now(), num_days=24):
    moods = []
    mood_options = ["happy", "ok"]

    for day_offset in range(num_days):
        mood_date = end_date - timedelta(days=day_offset)
        mood = choice(mood_options)

        mood_data = {
            "user_id": user_id,
            "mood": mood,
            "created_at": mood_date,
        }

        moods.append(mood_data)

    return moods


def _generate_mood_data_4_consecutive_sad(
    user_id=2, end_date=datetime.now(), num_days=24
):
    happy_or_ok_mood_options = ["happy", "ok"]  # First 20 days
    sad_mood = "sad"  # Last 4 days
    moods = []

    for day_offset in range(num_days):
        mood_date = end_date - timedelta(days=day_offset)

        if day_offset < 4:  # Most recent 4 days should be "sad"
            mood = sad_mood
        else:  # First 20 days should be randomly "happy" or "ok"
            mood = choice(happy_or_ok_mood_options)

        mood_data = {
            "user_id": user_id,
            "mood": mood,
            "created_at": mood_date,
        }

        moods.append(mood_data)

    return moods


def _generate_mood_data_non_compliant_user(
    user_id=3, end_date=datetime.now(), num_days=24, non_compliant_day_count=5
):
    moods = []
    mood_options = ["happy", "ok", "sad"]

    start_date = end_date - timedelta(days=num_days)
    mood_dates = [(start_date + timedelta(days=i)) for i in range(num_days + 1)]
    dates_to_remove = sample(mood_dates, non_compliant_day_count)
    for date_to_remove in dates_to_remove:
        mood_dates.remove(date_to_remove)

    for mood_date in mood_dates:
        mood = choice(mood_options)
        mood_data = {
            "user_id": user_id,
            "mood": mood,
            "created_at": mood_date,
        }

        moods.append(mood_data)

    return moods


def _generate_mood_data() -> list[dict]:
    return [
        *_generate_mood_data_compliant_user(),
        *_generate_mood_data_4_consecutive_sad(),
        *_generate_mood_data_non_compliant_user(),
    ]


def _generate_user_data(created_at_days_offset=24) -> list[dict]:
    created_at = datetime.today() - timedelta(days=created_at_days_offset)
    return [
        {
            "id": 1,
            "email": "user1@heartbeatmail.com",
            "password": hash_password("user1@heartbeatmail.com"),
            "name": "user1",
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins": 5,
            "claimable_gifts": 3,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 2,
            "email": "user2@heartbeatmail.com",
            "password": hash_password("user2@heartbeatmail.com"),
            "name": "user2",
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins": 5,
            "claimable_gifts": 3,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 3,
            "email": "user3@heartbeatmail.com",
            "password": hash_password("user3@heartbeatmail.com"),
            "name": "user3",
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins": 5,
            "claimable_gifts": 3,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
    ]


def _generate_admin_data(created_at_days_offset=24) -> list[dict]:
    created_at = datetime.today() - timedelta(days=created_at_days_offset)
    return [
        {
            "id": 1,
            "email": "admin@heartbeatmail.com",
            "password": hash_password("admin@heartbeatmail.com"),
            "created_at": created_at,
        }
    ]


def populate_db(db: Session) -> None:
    mood_data = _generate_mood_data()
    for data in mood_data:
        CRUDMood(db).create(Mood(**data))

    user_data = _generate_user_data()
    for data in user_data:
        CRUDUser(db).create(User(**data))

    admin_data = _generate_admin_data()
    for data in admin_data:
        CRUDAdmin(db).create(Admin(**data))


def delete_all_db_data(db: Session) -> None:
    CRUDMood(db).delete_all()
    CRUDUser(db).delete_all()
    CRUDAdmin(db).delete_all()


def repopulate_db(db: Session) -> None:
    delete_all_db_data(db)
    populate_db(db)


def _reset_all_user_can_record_mood_state(db: Session) -> None:
    all_users = CRUDUser(db).get_by_all({})
    for user in all_users:
        CRUDUser(db).update(user.id, "can_record_mood", True)


def _update_non_compliant_users_states(db: Session) -> None:
    non_compliant_users = CRUDUser(db).get_by_all({"can_record_mood": True})
    for user in non_compliant_users:
        CRUDUser(db).update(user.id, "tree_display_state", TreeDisplayState.SEEDLING)
        CRUDUser(db).update(user.id, "consecutive_checkins", 0)


def _notify_admin_of_non_compliant_users(db: Session) -> None:
    non_compliant_users = CRUDUser(db).get_by_all({"can_record_mood": True})
    for user in non_compliant_users:
        send_non_compliant_user_notification_message(
            user.email, datetime.today() - timedelta(days=1)
        )


def _run_end_of_day_cron_job(db: Session) -> None:
    _notify_admin_of_non_compliant_users(db)
    _update_non_compliant_users_states(db)
    _reset_all_user_can_record_mood_state(db)


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(lambda: _run_end_of_day_cron_job(db), "cron", hour=0, minute=0)
    return scheduler
