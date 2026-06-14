"""
Pilot program queries — 19 April 2026 to 17 May 2026.

All public functions accept a SQLAlchemy Session and return plain Python
objects (dicts, lists, scalars) so the template layer has no ORM dependency.
"""

import importlib.util
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "reports"))

if importlib.util.find_spec("models") is None:
    raise RuntimeError(
        "Cannot find 'models' module — run from the scripts/ directory:\n"
        "    cd scripts && python pilot/report.py"
    )

from datetime import date, datetime, timedelta
from sqlalchemy import func, select, Integer, case
from sqlalchemy.orm import Session

from models import CareReceipient, Mood
from enums import SelectedMood

# ---------------------------------------------------------------------------
# Pilot window — naive datetimes to match the DB's TIMESTAMP (no tz) columns
# ---------------------------------------------------------------------------

PILOT_START = datetime(2026, 4, 19)
PILOT_END = datetime(2026, 5, 17, 23, 59, 59)
PILOT_DAYS = (PILOT_END.date() - PILOT_START.date()).days + 1  # 29


# ---------------------------------------------------------------------------
# 1. Executive Summary
# ---------------------------------------------------------------------------


def get_total_enrolled(db: Session) -> int:
    """Care recipients onboarded on or before PILOT_END."""
    return (
        db.execute(
            select(func.count(CareReceipient.id)).where(
                CareReceipient.created_at <= PILOT_END
            )
        ).scalar()
        or 0
    )


def get_total_participants(db: Session) -> int:
    """Enrolled users who logged at least one mood during the pilot."""
    return (
        db.execute(
            select(func.count(func.distinct(Mood.care_receipient_id))).where(
                Mood.created_at >= PILOT_START,
                Mood.created_at <= PILOT_END,
            )
        ).scalar()
        or 0
    )


def get_participation_rate(db: Session) -> float:
    enrolled = get_total_enrolled(db)
    if enrolled == 0:
        return 0.0
    return round(get_total_participants(db) / enrolled, 4)


# ---------------------------------------------------------------------------
# 2. Onboarding Timeline
# ---------------------------------------------------------------------------


def get_onboarding_by_day(db: Session) -> list[dict]:
    """
    Returns a list of dicts {date: str, count: int, cumulative: int}
    one entry per day from PILOT_START to PILOT_END where ≥1 user joined.
    """
    rows = (
        db.execute(
            select(
                func.date(CareReceipient.created_at).label("day"),
                func.count(CareReceipient.id).label("count"),
            )
            .where(
                CareReceipient.created_at >= PILOT_START,
                CareReceipient.created_at <= PILOT_END,
            )
            .group_by(func.date(CareReceipient.created_at))
            .order_by(func.date(CareReceipient.created_at))
        ).all()
    )

    result = []
    cumulative = 0
    for row in rows:
        cumulative += row.count
        result.append(
            {"date": str(row.day), "count": row.count, "cumulative": cumulative}
        )
    return result


# ---------------------------------------------------------------------------
# 3. Engagement ("Login") Data
# ---------------------------------------------------------------------------


def get_per_user_engagement(db: Session) -> list[dict]:
    """
    Per enrolled care recipient: alias, first check-in, last check-in,
    total check-in days during pilot, ever_checked_in flag.
    """
    enrolled = (
        db.execute(
            select(CareReceipient.id, CareReceipient.alias, CareReceipient.created_at)
            .where(CareReceipient.created_at <= PILOT_END)
            .order_by(CareReceipient.id)
        ).all()
    )

    # mood stats per user during pilot
    mood_stats = (
        db.execute(
            select(
                Mood.care_receipient_id,
                func.min(Mood.created_at).label("first_checkin"),
                func.max(Mood.created_at).label("last_checkin"),
                func.count(func.distinct(func.date(Mood.created_at))).label(
                    "checkin_days"
                ),
            )
            .where(
                Mood.created_at >= PILOT_START,
                Mood.created_at <= PILOT_END,
            )
            .group_by(Mood.care_receipient_id)
        ).all()
    )
    stats_map = {row.care_receipient_id: row for row in mood_stats}

    result = []
    for user in enrolled:
        stats = stats_map.get(user.id)
        result.append(
            {
                "alias": user.alias,
                "onboarded_at": str(user.created_at)[:10],
                "first_checkin": str(stats.first_checkin)[:10] if stats else None,
                "last_checkin": str(stats.last_checkin)[:10] if stats else None,
                "checkin_days": stats.checkin_days if stats else 0,
                "ever_checked_in": stats is not None,
                "completion_pct": round(
                    # Divide by days actually available to this user, not the full 29.
                    stats.checkin_days
                    / max(
                        1,
                        (
                            PILOT_END.date()
                            - max(user.created_at.date(), PILOT_START.date())
                        ).days
                        + 1,
                    )
                    * 100,
                    1,
                )
                if stats
                else 0.0,
            }
        )
    return result


def get_never_checked_in(db: Session) -> list[dict]:
    """Enrolled users who never submitted a mood during the pilot."""
    participant_ids = select(
        func.distinct(Mood.care_receipient_id)
    ).where(
        Mood.created_at >= PILOT_START,
        Mood.created_at <= PILOT_END,
    )

    rows = db.execute(
        select(CareReceipient.alias, CareReceipient.created_at, CareReceipient.age)
        .where(
            CareReceipient.created_at <= PILOT_END,
            ~CareReceipient.id.in_(participant_ids),
        )
        .order_by(CareReceipient.created_at)
    ).all()

    return [
        {"alias": r.alias, "onboarded_at": str(r.created_at)[:10], "age": r.age}
        for r in rows
    ]


# ---------------------------------------------------------------------------
# 4. Consistency Analysis
# ---------------------------------------------------------------------------


def get_checkin_distribution(db: Session, _engagement: list[dict] | None = None) -> list[dict]:
    """
    Bucket enrolled users by number of check-in days during pilot.
    Buckets: 0, 1–7, 8–14, 15–21, 22–29
    """
    engagement = _engagement if _engagement is not None else get_per_user_engagement(db)
    buckets = {"0": 0, "1–7": 0, "8–14": 0, "15–21": 0, "22–29": 0}
    for u in engagement:
        days = u["checkin_days"]
        if days == 0:
            buckets["0"] += 1
        elif days <= 7:
            buckets["1–7"] += 1
        elif days <= 14:
            buckets["8–14"] += 1
        elif days <= 21:
            buckets["15–21"] += 1
        else:
            buckets["22–29"] += 1
    return [{"bucket": k, "count": v} for k, v in buckets.items()]


def get_avg_checkin_days(db: Session, _engagement: list[dict] | None = None) -> float:
    engagement = _engagement if _engagement is not None else get_per_user_engagement(db)
    enrolled = len(engagement)
    if enrolled == 0:
        return 0.0
    total_days = sum(u["checkin_days"] for u in engagement)
    return round(total_days / enrolled, 2)


def get_daily_checkin_trend(db: Session) -> list[dict]:
    """Number of unique users who checked in each day during the pilot."""
    rows = db.execute(
        select(
            func.date(Mood.created_at).label("day"),
            func.count(func.distinct(Mood.care_receipient_id)).label("users"),
        )
        .where(
            Mood.created_at >= PILOT_START,
            Mood.created_at <= PILOT_END,
        )
        .group_by(func.date(Mood.created_at))
        .order_by(func.date(Mood.created_at))
    ).all()

    return [{"date": str(r.day), "users": r.users} for r in rows]


def get_week1_vs_last_week_retention(db: Session) -> dict:
    """
    Week 1: 19 Apr – 25 Apr. Last week: 11 May – 17 May.
    Returns unique active users in each week and retention %.
    """
    week1_start = PILOT_START
    week1_end = datetime(2026, 4, 25, 23, 59, 59)
    last_week_start = datetime(2026, 5, 11)
    last_week_end = PILOT_END

    week1_users = (
        db.execute(
            select(func.count(func.distinct(Mood.care_receipient_id))).where(
                Mood.created_at >= week1_start,
                Mood.created_at <= week1_end,
            )
        ).scalar()
        or 0
    )
    last_week_users = (
        db.execute(
            select(func.count(func.distinct(Mood.care_receipient_id))).where(
                Mood.created_at >= last_week_start,
                Mood.created_at <= last_week_end,
            )
        ).scalar()
        or 0
    )
    retention = (
        round(last_week_users / week1_users, 4) if week1_users > 0 else 0.0
    )
    return {
        "week1_users": week1_users,
        "last_week_users": last_week_users,
        # Activity retention: ratio of unique active users (week 1 vs final week).
        # This is NOT cohort retention — see get_cohort_retention() for that.
        "activity_retention_rate": retention,
    }


def get_checkin_hour_distribution(db: Session) -> list[dict]:
    """Number of check-ins by hour of day (0–23) during the pilot."""
    rows = db.execute(
        select(
            func.extract("hour", Mood.created_at).cast(Integer).label("hour"),
            func.count(Mood.id).label("count"),
        )
        .where(
            Mood.created_at >= PILOT_START,
            Mood.created_at <= PILOT_END,
        )
        .group_by(func.extract("hour", Mood.created_at))
        .order_by(func.extract("hour", Mood.created_at))
    ).all()
    return [{"hour": r.hour, "count": r.count} for r in rows]


def get_weekly_mood_trend(db: Session) -> list[dict]:
    """
    Mood counts broken down by pilot week (one DB query, Python-side pivot).
    Week boundaries start on April 19; Week 5 covers the single remaining day.
    """
    weeks = [
        ("Wk 1 (19–25 Apr)", datetime(2026, 4, 19), datetime(2026, 4, 25, 23, 59, 59)),
        ("Wk 2 (26 Apr–2 May)", datetime(2026, 4, 26), datetime(2026, 5, 2, 23, 59, 59)),
        ("Wk 3 (3–9 May)", datetime(2026, 5, 3), datetime(2026, 5, 9, 23, 59, 59)),
        ("Wk 4 (10–16 May)", datetime(2026, 5, 10), datetime(2026, 5, 16, 23, 59, 59)),
        ("Wk 5 (17 May)", datetime(2026, 5, 17), PILOT_END),
    ]
    rows = db.execute(
        select(Mood.created_at, Mood.mood)
        .where(Mood.created_at >= PILOT_START, Mood.created_at <= PILOT_END)
    ).all()

    buckets: list[dict] = [
        {"week": lbl, "happy": 0, "ok": 0, "sad": 0} for lbl, _, _ in weeks
    ]
    for r in rows:
        mood_key = r.mood.value if hasattr(r.mood, "value") else str(r.mood)
        for i, (_, w_start, w_end) in enumerate(weeks):
            if w_start <= r.created_at <= w_end:
                buckets[i][mood_key] = buckets[i].get(mood_key, 0) + 1
                break
    return buckets


def get_cohort_retention(db: Session) -> dict:
    """
    True cohort retention: how many Week-1 active users were still active
    in the final week (May 11–17).  Complements the activity-count ratio in
    get_week1_vs_last_week_retention.
    """
    week1_start = PILOT_START
    week1_end = datetime(2026, 4, 25, 23, 59, 59)
    last_week_start = datetime(2026, 5, 11)
    last_week_end = PILOT_END

    week1_active_sq = (
        select(Mood.care_receipient_id.label("uid"))
        .where(Mood.created_at >= week1_start, Mood.created_at <= week1_end)
        .distinct()
        .subquery("week1_active")
    )

    week1_count = (
        db.execute(select(func.count()).select_from(week1_active_sq)).scalar() or 0
    )
    retained = (
        db.execute(
            select(func.count(func.distinct(Mood.care_receipient_id))).where(
                Mood.created_at >= last_week_start,
                Mood.created_at <= last_week_end,
                Mood.care_receipient_id.in_(select(week1_active_sq.c.uid)),
            )
        ).scalar()
        or 0
    )
    return {
        "week1_users": week1_count,
        "retained_users": retained,
        "cohort_retention_rate": (
            round(retained / week1_count, 4) if week1_count > 0 else 0.0
        ),
    }


# ---------------------------------------------------------------------------
# 5. Mood Distribution
# ---------------------------------------------------------------------------
def get_overall_mood_distribution(db: Session) -> list[dict]:
    """Counts and percentages for each mood value during the pilot."""
    rows = db.execute(
        select(
            Mood.mood,
            func.count(Mood.id).label("count"),
        )
        .where(
            Mood.created_at >= PILOT_START,
            Mood.created_at <= PILOT_END,
        )
        .group_by(Mood.mood)
        .order_by(Mood.mood)
    ).all()

    total = sum(r.count for r in rows)
    return [
        {
            "mood": r.mood.value if hasattr(r.mood, "value") else str(r.mood),
            "count": r.count,
            "pct": round(r.count / total * 100, 1) if total else 0.0,
        }
        for r in rows
    ]


def get_daily_mood_trend(db: Session) -> list[dict]:
    """
    For each day in the pilot, counts of happy / ok / sad.
    Returns list of {date, happy, ok, sad}.
    """
    rows = db.execute(
        select(
            func.date(Mood.created_at).label("day"),
            Mood.mood,
            func.count(Mood.id).label("count"),
        )
        .where(
            Mood.created_at >= PILOT_START,
            Mood.created_at <= PILOT_END,
        )
        .group_by(func.date(Mood.created_at), Mood.mood)
        .order_by(func.date(Mood.created_at))
    ).all()

    # pivot into {date: {happy:0, ok:0, sad:0}}
    pivot: dict[str, dict] = {}
    for r in rows:
        day = str(r.day)
        pivot.setdefault(day, {"happy": 0, "ok": 0, "sad": 0})
        mood_key = r.mood.value if hasattr(r.mood, "value") else str(r.mood)
        pivot[day][mood_key] = r.count

    return [{"date": day, **counts} for day, counts in sorted(pivot.items())]


def get_consecutive_sad_users(db: Session) -> list[dict]:
    """Users with ≥2 consecutive sad-mood days during the pilot."""
    distinct_sad = (
        select(
            Mood.care_receipient_id,
            func.date(Mood.created_at).label("date_h"),
        )
        .where(
            Mood.created_at >= PILOT_START,
            Mood.created_at <= PILOT_END,
            Mood.mood == SelectedMood.SAD,
        )
        .group_by(Mood.care_receipient_id, func.date(Mood.created_at))
        .subquery("distinct_sad")
    )

    consecutive = (
        select(
            distinct_sad.c.care_receipient_id,
            # PostgreSQL-specific: DATE - INTEGER subtracts days, producing a constant
            # "group" value for each run of consecutive dates (gaps-and-islands pattern).
            (
                distinct_sad.c.date_h
                - func.row_number()
                .over(
                    partition_by=distinct_sad.c.care_receipient_id,
                    order_by=distinct_sad.c.date_h,
                )
                .cast(Integer)
            ).label("grp"),
        ).subquery("consecutive")
    )

    sad_ids = (
        select(consecutive.c.care_receipient_id)
        .group_by(consecutive.c.care_receipient_id, consecutive.c.grp)
        .having(func.count() >= 2)
        .subquery("sad_ids")
    )

    rows = db.execute(
        select(CareReceipient.alias, CareReceipient.age, CareReceipient.gender).where(
            CareReceipient.id.in_(select(sad_ids.c.care_receipient_id))
        )
    ).all()

    return [{"alias": r.alias, "age": r.age, "gender": r.gender} for r in rows]


# ---------------------------------------------------------------------------
# 6. Demographics
# ---------------------------------------------------------------------------


def _age_bucket(age: int) -> str:
    if age < 40:
        return "<40"
    elif age < 60:
        return "40–59"
    elif age < 75:
        return "60–74"
    else:
        return "75+"


def get_demographics(db: Session) -> dict:
    """
    Returns demographic breakdowns for enrolled users.
    age: one entry per distinct age value, sorted ascending (bin size = 1).
    Other keys hold a list of {label, count} dicts.
    """
    users = db.execute(
        select(
            CareReceipient.age,
            CareReceipient.gender,
            CareReceipient.race,
            CareReceipient.app_language,
        ).where(CareReceipient.created_at <= PILOT_END)
    ).all()

    age_counts: dict[int, int] = {}
    gender_counts: dict[str, int] = {}
    race_counts: dict[str, int] = {}
    lang_counts: dict[str, int] = {}

    for u in users:
        age_counts[u.age] = age_counts.get(u.age, 0) + 1
        gender_counts[u.gender] = gender_counts.get(u.gender, 0) + 1
        race_counts[u.race] = race_counts.get(u.race, 0) + 1
        lang_counts[u.app_language] = lang_counts.get(u.app_language, 0) + 1

    def to_list(d: dict) -> list[dict]:
        return [
            {"label": k, "count": v}
            for k, v in sorted(d.items(), key=lambda x: (-x[1], str(x[0])))
        ]

    # age sorted ascending; keys are ints so the chart x-axis is ordered
    age_sorted = sorted(age_counts.items())

    return {
        "age": [{"age": age, "count": cnt} for age, cnt in age_sorted],
        "gender": to_list(gender_counts),
        "race": to_list(race_counts),
        "language": to_list(lang_counts),
    }


# ---------------------------------------------------------------------------
# 7. Notable Flags
# ---------------------------------------------------------------------------


def get_suspended_users(db: Session) -> list[dict]:
    """Users marked is_suspended=True who were enrolled during the pilot."""
    rows = db.execute(
        select(
            CareReceipient.alias,
            CareReceipient.consecutive_non_checkins,
            CareReceipient.created_at,
        )
        .where(
            CareReceipient.created_at <= PILOT_END,
            CareReceipient.is_suspended.is_(True),
        )
        .order_by(CareReceipient.consecutive_non_checkins.desc())
    ).all()

    return [
        {
            "alias": r.alias,
            "consecutive_non_checkins": r.consecutive_non_checkins,
            "onboarded_at": str(r.created_at)[:10],
        }
        for r in rows
    ]


def get_high_non_checkin_users(db: Session, threshold: int = 3) -> list[dict]:
    """Non-suspended users with consecutive_non_checkins >= threshold."""
    rows = db.execute(
        select(
            CareReceipient.alias,
            CareReceipient.consecutive_non_checkins,
            CareReceipient.consecutive_checkins,
        )
        .where(
            CareReceipient.created_at <= PILOT_END,
            CareReceipient.is_suspended.is_(False),
            CareReceipient.consecutive_non_checkins >= threshold,
        )
        .order_by(CareReceipient.consecutive_non_checkins.desc())
    ).all()

    return [
        {
            "alias": r.alias,
            "consecutive_non_checkins": r.consecutive_non_checkins,
            "consecutive_checkins": r.consecutive_checkins,
        }
        for r in rows
    ]


def get_early_dropoffs(db: Session) -> list[dict]:
    """
    Users active in Week 1 (19–25 Apr) but with zero check-ins in the
    last week (11–17 May) — indicating they dropped off.
    """
    week1_start = PILOT_START
    week1_end = datetime(2026, 4, 25, 23, 59, 59)
    last_week_start = datetime(2026, 5, 11)
    last_week_end = PILOT_END

    week1_active = select(func.distinct(Mood.care_receipient_id)).where(
        Mood.created_at >= week1_start,
        Mood.created_at <= week1_end,
    )
    last_week_active = select(func.distinct(Mood.care_receipient_id)).where(
        Mood.created_at >= last_week_start,
        Mood.created_at <= last_week_end,
    )

    rows = db.execute(
        select(CareReceipient.alias, CareReceipient.age).where(
            CareReceipient.id.in_(week1_active),
            ~CareReceipient.id.in_(last_week_active),
        )
    ).all()

    return [{"alias": r.alias, "age": r.age} for r in rows]
