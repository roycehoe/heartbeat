from datetime import datetime, timedelta
from random import choice, sample


def generate_mood_data_compliant_user(user_id=1, end_date=datetime.now(), num_days=24):
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


def generate_mood_data_4_consecutive_sad(
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


def generate_mood_data_non_compliant_user(
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
