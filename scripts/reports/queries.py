from sqlalchemy import func, distinct
from sqlalchemy.orm.session import Session
from datetime import datetime, timedelta, timezone

from database import SessionLocal
from models import Mood


def _get_sgt_now():
    """Get the current time in Singapore Time (SGT, UTC+8)"""
    # Define the SGT timezone (UTC+8)
    sgt_timezone = timezone(timedelta(hours=8))

    # Get the current time in UTC
    utc_now = datetime.now(timezone.utc)

    # Convert to Singapore Time (SGT)
    sgt_now = utc_now.astimezone(sgt_timezone)

    return sgt_now


def get_active_users_last_7_days(db: Session):
    """Get the number of unique active users in the last 7 days."""
    seven_days_ago = _get_sgt_now() - timedelta(days=7)

    count = (
        db.query(func.count(distinct(Mood.user_id)))
        .filter(Mood.created_at > seven_days_ago)
        .scalar()
    )

    return count


db = SessionLocal()