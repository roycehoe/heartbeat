from collections import defaultdict
from datetime import date, datetime, time, timedelta

from models.mood import Mood
from schemas.caregiver import CaregiverDashboardMoodData


def get_admin_dashboard_moods_out(
    moods_in: list[Mood], start_date: datetime, end_date: datetime
) -> list[CaregiverDashboardMoodData]:
    if not moods_in:
        return []

    moods_by_date: dict[date, list[Mood]] = defaultdict(list)
    for mood_in in moods_in:
        moods_by_date[mood_in.created_at.date()].append(mood_in)

    first_date = start_date.date()
    num_days = (end_date.date() - first_date).days + 1

    result: list[CaregiverDashboardMoodData] = []
    for offset in reversed(range(num_days)):
        day = first_date + timedelta(days=offset)
        day_moods = moods_by_date.get(day)
        if day_moods:
            result.extend(
                CaregiverDashboardMoodData(mood=m.mood, created_at=m.created_at)
                for m in reversed(day_moods)
            )
        else:
            result.append(
                CaregiverDashboardMoodData(
                    mood=None, created_at=datetime.combine(day, time(23, 59))
                )
            )
    return result
