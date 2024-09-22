from datetime import datetime, timedelta
from random import choice, sample

from enums import TreeDisplayState
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


def generate_mood_data() -> list[dict]:
    return [
        *_generate_mood_data_compliant_user(),
        *_generate_mood_data_4_consecutive_sad(),
        *_generate_mood_data_non_compliant_user(),
    ]


def generate_user_data(created_at_days_offset=24) -> list[dict]:
    created_at = datetime.today() - timedelta(days=created_at_days_offset)
    return [
        {
            "id": 1,
            "email": "user1@heartbeatmail.com",
            "password": hash_password("user1@heartbeatmail.com"),
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins_to_next_tree_display_state": 5,
            "can_claim_gifts": False,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 2,
            "email": "user2@heartbeatmail.com",
            "password": hash_password("user2@heartbeatmail.com"),
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins_to_next_tree_display_state": 5,
            "can_claim_gifts": False,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
        {
            "id": 3,
            "email": "user3@heartbeatmail.com",
            "password": hash_password("user3@heartbeatmail.com"),
            "coins": 0,
            "tree_display_state": TreeDisplayState.SEEDLING,
            "consecutive_checkins_to_next_tree_display_state": 5,
            "can_claim_gifts": False,
            "created_at": created_at,
            "admin_id": 1,
            "can_record_mood": True,
        },
    ]


def generate_admin_data(created_at_days_offset=24) -> list[dict]:
    created_at = datetime.today() - timedelta(days=created_at_days_offset)
    return [
        {
            "id": 1,
            "email": "admin@heartbeatmail.com",
            "password": hash_password("admin@heartbeatmail.com"),
            "created_at": created_at,
        }
    ]
