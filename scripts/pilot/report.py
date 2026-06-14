"""
Pilot program ad-hoc report — 19 April 2026 to 17 May 2026.

Usage (run from the scripts/ directory):
    python pilot/report.py

Output:
    pilot/output/<YYYY_MM_DD>/pilot_report.html
"""

import importlib.util
import os
import sys
from datetime import date

# reports/ provides database.py, models.py, enums.py
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "reports"))
# pilot/ must come first so `queries` resolves to pilot/queries.py, not reports/queries.py
sys.path.insert(0, os.path.dirname(__file__))

if importlib.util.find_spec("database") is None:
    raise RuntimeError(
        "Cannot find 'database' module — run from the scripts/ directory:\n"
        "    cd scripts && python pilot/report.py"
    )

from jinja2 import Environment, FileSystemLoader

from database import SessionLocal
from queries import (
    PILOT_START,
    PILOT_END,
    PILOT_DAYS,
    get_total_enrolled,
    get_total_participants,
    get_onboarding_by_day,
    get_per_user_engagement,
    get_never_checked_in,
    get_checkin_distribution,
    get_avg_checkin_days,
    get_checkin_hour_distribution,
    get_daily_checkin_trend,
    get_week1_vs_last_week_retention,
    get_cohort_retention,
    get_overall_mood_distribution,
    get_daily_mood_trend,
    get_weekly_mood_trend,
    get_consecutive_sad_users,
    get_demographics,
    get_suspended_users,
    get_high_non_checkin_users,
    get_early_dropoffs,
)


def report():
    db = SessionLocal()

    try:
        # ── Output directory ─────────────────────────────────────────────
        current_date = str(date.today()).replace("-", "_")
        out_dir = os.path.join(os.path.dirname(__file__), "output", current_date)
        os.makedirs(out_dir, exist_ok=True)

        # ── Gather data ──────────────────────────────────────────────────
        enrolled = get_total_enrolled(db)
        participants = get_total_participants(db)
        never_checked_in = get_never_checked_in(db)
        # Compute once — reused by checkin_distribution and avg_checkin_days
        engagement = get_per_user_engagement(db)

        context = {
            "title": "Heartbeat Pilot Program Report",
            "pilot_start": PILOT_START.strftime("%d %b %Y"),
            "pilot_end":   PILOT_END.strftime("%d %b %Y"),
            "pilot_days":  PILOT_DAYS,
            "generated_at": date.today().strftime("%d %b %Y"),

            # 1. Executive summary
            "summary": {
                "enrolled":           enrolled,
                "participants":       participants,
                "participation_rate": (
                    round(participants / enrolled, 4) if enrolled > 0 else 0.0
                ),
                "never_checked_in":   len(never_checked_in),
                "avg_checkin_days":   get_avg_checkin_days(db, _engagement=engagement),
            },

            # 2. Onboarding timeline
            "onboarding": get_onboarding_by_day(db),

            # 3. Engagement
            "engagement":       engagement,
            "never_checked_in": never_checked_in,

            # 4. Consistency
            "checkin_distribution":      get_checkin_distribution(db, _engagement=engagement),
            "checkin_hour_distribution": get_checkin_hour_distribution(db),
            "daily_checkin_trend":       get_daily_checkin_trend(db),
            "retention":                 get_week1_vs_last_week_retention(db),
            "cohort_retention":          get_cohort_retention(db),

            # 5. Mood distribution
            "mood_distribution":     get_overall_mood_distribution(db),
            "daily_mood_trend":      get_daily_mood_trend(db),
            "weekly_mood_trend":     get_weekly_mood_trend(db),
            "consecutive_sad_users": get_consecutive_sad_users(db),

            # 6. Demographics
            "demographics": get_demographics(db),

            # 7. Notable flags
            "suspended_users":        get_suspended_users(db),
            "high_non_checkin_users": get_high_non_checkin_users(db),
            "early_dropoffs":         get_early_dropoffs(db),
        }

        # ── Render ───────────────────────────────────────────────────────
        templates_dir = os.path.join(os.path.dirname(__file__), "templates")
        env = Environment(loader=FileSystemLoader(templates_dir))
        template = env.get_template("template.html")
        html = template.render(**context)

        # ── Write output ─────────────────────────────────────────────────
        out_path = os.path.join(out_dir, "pilot_report.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"✅  Report written to: {out_path}")

    except Exception as e:
        print(f"❌  Error generating report: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    report()
