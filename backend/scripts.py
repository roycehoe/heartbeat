import time
from datetime import datetime, timedelta
from random import choice, sample

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from enums import Gender, Race, AppLanguage
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
            "username": "user1",
            "password": hash_password("user1"),
            "name": "user1",
            "alias": "alias1",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "app_language": AppLanguage.ENGLISH,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "consecutive_checkins": 5,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 2,
            "username": "user2",
            "password": hash_password("user2"),
            "name": "user2",
            "alias": "alias1",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "app_language": AppLanguage.CHINESE,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "consecutive_checkins": 5,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 3,
            "username": "user3",
            "password": hash_password("user3"),
            "name": "user3",
            "alias": "user3",
            "age": 69,
            "race": Race.CHINESE,
            "gender": Gender.MALE,
            "app_language": AppLanguage.CHINESE,
            "postal_code": 123123,
            "floor": 9,
            "contact_number": 90001111,
            "consecutive_checkins": 0,
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
            "username": "admin",
            "name": "admin",
            "contact_number": 91348131,
            "password": hash_password("admin"),
            "created_at": created_at,
        }
    ]


def is_db_empty(db: Session) -> bool:
    if len(CRUDMood(db).get_all()) == 0:
        return True
    return False


def populate_db(db: Session) -> None:
    admin_data = _generate_admin_data()
    for data in admin_data:
        CRUDAdmin(db).create(Admin(**data))

    user_data = _generate_user_data()
    for data in user_data:
        CRUDUser(db).create(User(**data))

    mood_data = _generate_mood_data()
    for data in mood_data:
        CRUDMood(db).create(Mood(**data))


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
        CRUDUser(db).update(user.id, "consecutive_checkins", 0)


def delay_execution(func, delay_seconds=1):
    def wrapper(*args, **kwargs):
        time.sleep(delay_seconds)
        return func(*args, **kwargs)

    return wrapper


@delay_execution
def send_non_compliant_user_notification_message_with_delay(
    name: str, date: datetime, to: str
):
    return send_non_compliant_user_notification_message(name, date, to)


def _notify_admin_of_non_compliant_users(db: Session) -> None:
    non_compliant_users = CRUDUser(db).get_by_all({"can_record_mood": True})
    for user in non_compliant_users:
        admin = CRUDAdmin(db).get(user.admin_id)
        send_non_compliant_user_notification_message_with_delay(
            user.name,
            # datetime.now() - timedelta(days=1),
            datetime.now(pytz.timezone("Asia/Singapore")),
            f"+65{admin.contact_number}",
        )


def _run_end_of_day_cron_job(db: Session) -> None:
    _notify_admin_of_non_compliant_users(db)
    _update_non_compliant_users_states(db)
    _reset_all_user_can_record_mood_state(db)


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(lambda: _run_end_of_day_cron_job(db), "cron", hour=0, minute=0)
    return scheduler
