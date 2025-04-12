from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import StrEnum
from typing import Optional


class Mood(StrEnum):
    HAPPY = "Happy"
    OK = "Ok"
    SAD = "Sad"


@dataclass
class MoodOut:
    mood: Optional[Mood]
    created_at: datetime


@dataclass
class MoodIn:
    mood: Mood
    created_at: datetime


def get_mood_out(moods_in: list[MoodIn], start_date: datetime) -> list[MoodOut]:
    results = []
    current_date = start_date.date()

    for mood_in in moods_in:
        mood_in_date = mood_in.created_at.date()

        while current_date < mood_in_date:
            missing_datetime = datetime.combine(
                current_date, datetime.max.time()
            ).replace(hour=23, minute=59, second=0, microsecond=0)

            results.append(MoodOut(mood=None, created_at=missing_datetime))
            current_date = (
                datetime.combine(current_date, datetime.min.time()) + timedelta(days=1)
            ).date()

        results.append(MoodOut(mood=mood_in.mood, created_at=mood_in.created_at))
        current_date = (
            datetime.combine(mood_in_date, datetime.min.time()) + timedelta(days=1)
        ).date()

    return results
