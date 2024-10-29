from datetime import datetime, timedelta
from random import choice, sample
from enums import Gender, Race

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import TreeDisplayState
from gateway import send_non_compliant_user_notification_message
from models import Admin, Mood, User
from utils.hashing import hash_password


def _generate_mood_data_compliant_user(
    user_id=1,
    start_date=datetime(year=2024, month=9, day=2),
    end_date=datetime.now() - timedelta(days=1),
):
    moods = []
    delta = end_date - start_date
    for day_offset in range(delta.days + 1):
        moods.append(
            {
                "user_id": user_id,
                "mood": choice(["happy", "ok"]),
                "created_at": start_date + timedelta(days=day_offset),
            }
        )
    return moods


def _generate_mood_data_4_consecutive_sad(
    user_id=2,
    start_date=datetime(year=2024, month=9, day=3),
    end_date=datetime.now() - timedelta(days=1),
):
    moods = []
    delta = end_date - start_date

    for day_offset in range(delta.days + 1):
        mood_data = {
            "user_id": user_id,
            # Last 4 days should be sad
            "mood": choice(["happy", "ok"]) if day_offset < 4 else "sad",
            "created_at": start_date + timedelta(days=day_offset),
        }

        moods.append(mood_data)

    return moods


def _generate_mood_data_non_compliant_user(
    user_id=3,
    start_date=datetime(year=2024, month=9, day=4),
    end_date=datetime.now() - timedelta(days=1),
):
    mood_data_compliant_user = _generate_mood_data_compliant_user(
        user_id, start_date, end_date
    )
    # We want to retain the first date for frontend rendering purposes to show that this is the third user
    mood_data_to_remove = sample(mood_data_compliant_user[1:], 5)
    return [
        mood_data_compliant_user[0],
        *[
            mood_data
            for mood_data in mood_data_compliant_user
            if mood_data not in mood_data_to_remove
        ],
    ]


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
            "alias": "alias1",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "coins": 1500,
            "tree_display_state": TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS,
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
            "alias": "alias1",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "coins": 800,
            "tree_display_state": TreeDisplayState.TEEN_TREE,
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
            "alias": "alias1",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "coins": 50,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins": 0,
            "claimable_gifts": 0,
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
            "name": "admin1",
            "contact_number": 91231231,
            "password": hash_password("admin@heartbeatmail.com"),
            "created_at": created_at,
        }
    ]


def is_db_empty(db: Session) -> bool:
    if len(CRUDMood(db).get_all()) == 0:
        return True
    return False


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
