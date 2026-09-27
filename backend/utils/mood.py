from datetime import date, datetime, timedelta

from models.mood import Mood
from schemas.caregiver import CaregiverDashboardMoodData
from utils.dates import app_date, end_of_day


def _get_latest_mood_per_day(moods_in: list[Mood]) -> dict[date, Mood]:
    """Index moods by the Singapore date they were recorded on.

    A care receipient can only check in once a day, but `can_record_mood` resets
    at Singapore midnight, so two check-ins can still share a UTC date. Keying
    off the Singapore date keeps them in separate days; the latest check-in wins
    if one day somehow holds more than one.
    """
    latest_mood_per_day: dict[date, Mood] = {}
    for mood_in in moods_in:
        day = app_date(mood_in.created_at)
        existing = latest_mood_per_day.get(day)
        if existing is None or mood_in.created_at > existing.created_at:
            latest_mood_per_day[day] = mood_in
    return latest_mood_per_day


def get_admin_dashboard_moods_out(
    moods_in: list[Mood], start_date: datetime, end_date: datetime
) -> list[CaregiverDashboardMoodData]:
    """Build one entry per day from `start_date` to `end_date`, newest first.

    Days without a check-in get a `None` mood so that the nth entry is always
    n days ago, which is what the dashboard's day columns assume.
    """
    if not moods_in:
        return []

    latest_mood_per_day = _get_latest_mood_per_day(moods_in)

    result: list[CaregiverDashboardMoodData] = []
    current_date = app_date(start_date)
    end_date_only = app_date(end_date)

    while current_date <= end_date_only:
        mood_in = latest_mood_per_day.get(current_date)
        if mood_in is None:
            result.append(
                CaregiverDashboardMoodData(
                    mood=None, created_at=end_of_day(current_date)
                )
            )
        else:
            result.append(
                CaregiverDashboardMoodData(
                    mood=mood_in.mood, created_at=mood_in.created_at
                )
            )
        current_date += timedelta(days=1)

    return result[::-1]
