from datetime import datetime, time, timedelta

from models.mood import Mood
from schemas.caregiver import CaregiverDashboardMoodData


def get_admin_dashboard_moods_out(
    moods_in: list[Mood], start_date: datetime, end_date: datetime
) -> list[CaregiverDashboardMoodData]:
    if not moods_in:
        return []

    result: list[CaregiverDashboardMoodData] = []
    current_date = start_date.date()
    end_date_only = end_date.date()

    for mood_in in moods_in:
        mood_in_date = mood_in.created_at.date()

        while current_date < mood_in_date:
            if current_date > end_date_only:
                break
            missing_datetime = datetime.combine(current_date, time(23, 59))
            result.append(CaregiverDashboardMoodData(mood=None, created_at=missing_datetime))
            current_date += timedelta(days=1)

        if current_date <= end_date_only:
            result.append(
                CaregiverDashboardMoodData(mood=mood_in.mood, created_at=mood_in.created_at)
            )
        current_date = mood_in_date + timedelta(days=1)

    while current_date <= end_date_only:
        missing_datetime = datetime.combine(current_date, time(23, 59))
        result.append(CaregiverDashboardMoodData(mood=None, created_at=missing_datetime))
        current_date += timedelta(days=1)

    return result[::-1]  # TODO: Refactor this
