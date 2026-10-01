from datetime import datetime

from enums import SelectedMood
from models.mood import Mood
from utils.mood import get_admin_dashboard_moods_out


def _mood(mood: SelectedMood, created_at: datetime) -> Mood:
    return Mood(care_receipient_id=1, mood=mood, created_at=created_at)


def test_no_moods_returns_empty_list() -> None:
    result = get_admin_dashboard_moods_out(
        [], datetime(2026, 10, 1), datetime(2026, 10, 5)
    )

    assert result == []


def test_fills_gaps_with_placeholders_newest_first() -> None:
    moods = [
        _mood(SelectedMood.HAPPY, datetime(2026, 10, 2, 8, 0)),
        _mood(SelectedMood.SAD, datetime(2026, 10, 4, 9, 30)),
    ]

    result = get_admin_dashboard_moods_out(
        moods, datetime(2026, 10, 1), datetime(2026, 10, 5)
    )

    assert [(r.created_at, r.mood) for r in result] == [
        (datetime(2026, 10, 5, 23, 59), None),
        (datetime(2026, 10, 4, 9, 30), SelectedMood.SAD),
        (datetime(2026, 10, 3, 23, 59), None),
        (datetime(2026, 10, 2, 8, 0), SelectedMood.HAPPY),
        (datetime(2026, 10, 1, 23, 59), None),
    ]


def test_moods_on_every_day_have_no_placeholders() -> None:
    moods = [
        _mood(SelectedMood.OK, datetime(2026, 10, 1, 10, 0)),
        _mood(SelectedMood.HAPPY, datetime(2026, 10, 2, 10, 0)),
        _mood(SelectedMood.SAD, datetime(2026, 10, 3, 10, 0)),
    ]

    result = get_admin_dashboard_moods_out(
        moods, datetime(2026, 10, 1), datetime(2026, 10, 3)
    )

    assert [r.mood for r in result] == [
        SelectedMood.SAD,
        SelectedMood.HAPPY,
        SelectedMood.OK,
    ]


def test_mood_on_boundary_days_is_included() -> None:
    moods = [
        _mood(SelectedMood.OK, datetime(2026, 10, 1, 0, 5)),
        _mood(SelectedMood.SAD, datetime(2026, 10, 5, 23, 55)),
    ]

    result = get_admin_dashboard_moods_out(
        moods, datetime(2026, 10, 1), datetime(2026, 10, 5)
    )

    assert [r.mood for r in result] == [
        SelectedMood.SAD,
        None,
        None,
        None,
        SelectedMood.OK,
    ]


def test_moods_after_end_date_are_excluded() -> None:
    moods = [
        _mood(SelectedMood.HAPPY, datetime(2026, 10, 2, 8, 0)),
        _mood(SelectedMood.SAD, datetime(2026, 10, 9, 8, 0)),
    ]

    result = get_admin_dashboard_moods_out(
        moods, datetime(2026, 10, 1), datetime(2026, 10, 3)
    )

    assert [r.mood for r in result] == [None, SelectedMood.HAPPY, None]


def test_multiple_moods_on_same_day_are_all_returned_newest_first() -> None:
    moods = [
        _mood(SelectedMood.HAPPY, datetime(2026, 10, 2, 8, 0)),
        _mood(SelectedMood.SAD, datetime(2026, 10, 2, 20, 0)),
    ]

    result = get_admin_dashboard_moods_out(
        moods, datetime(2026, 10, 2), datetime(2026, 10, 3)
    )

    assert [r.mood for r in result] == [None, SelectedMood.SAD, SelectedMood.HAPPY]
