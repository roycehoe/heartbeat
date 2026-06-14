from sqlalchemy import func, distinct, select, Integer
from sqlalchemy.orm.session import Session
from sqlalchemy.sql import literal_column
from datetime import datetime, timedelta, timezone

from database import SessionLocal
from models import CareReceipient, Mood
from enums import SelectedMood

def _get_sgt_now():
    """Get the current time in Singapore Time (SGT, UTC+8)"""
    # Define the SGT timezone (UTC+8)
    sgt_timezone = timezone(timedelta(hours=8))

    # Get the current time in UTC
    utc_now = datetime.now(timezone.utc)

    # Convert to Singapore Time (SGT)
    sgt_now = utc_now.astimezone(sgt_timezone)

    return sgt_now

def get_cutoff(days=7):
    """Get cutoff window, default is 7 days"""
    return _get_sgt_now() - timedelta(days=days)

# helper functions
def get_active_users_last_7_days_subq():
    """Get the number of unique active users in the last 7 days."""

    cutoff_date = get_cutoff(days=365)

    return (
        select(Mood.care_receipient_id)
        .where(Mood.created_at > cutoff_date)
        .group_by(Mood.care_receipient_id)
        .subquery()
    )

def get_total_onboarded_users(db: Session):
    """Get the total number of users who have onboarded onto the platform"""
    count = (
        db.query(func.count(CareReceipient.id))
        .filter(CareReceipient.is_suspended == False)
        .scalar()
    )

    return count

def get_weekly_compliance_rate(db: Session):
    """Calculate the weekly compliance rate, defined as number of users who did not check in over total number of users"""

    active_users_subq = get_active_users_last_7_days_subq()

    # calculate number of non compliant users
    non_compliant_users = db.execute(
        select(func.count(CareReceipient.id))
        .where(~CareReceipient.id.in_(select(active_users_subq.c.care_receipient_id)))
    ).scalar()

    # calculate total users
    total_users = db.execute(
        select(func.count(CareReceipient.id))
        .distinct()
    ).scalar()

    # return compliance rate
    return round(non_compliant_users/total_users, 4)


def get_users_sad_2plus_last_7_days(db: Session) -> list:
    """Return a list of users who recorded 'sad' on more than 2 distinct days in the last 7 days."""

    cutoff_date = get_cutoff(days=365)

    # distinct sad moods
    distinct_sad_users = (
        select(Mood.care_receipient_id, func.date(Mood.created_at).label('date_h'))
        .where(Mood.created_at >= cutoff_date, Mood.mood == SelectedMood.SAD)
        .group_by(Mood.care_receipient_id, func.date(Mood.created_at))
        .subquery("distinct_sad_users")
    )

    # group consecutive days
    consecutive_sad_moods = (
        select(
            distinct_sad_users.c.care_receipient_id,
            (
                func.date(distinct_sad_users.c.date_h) - func.row_number().over(partition_by=distinct_sad_users.c.care_receipient_id, order_by=distinct_sad_users.c.date_h).cast(Integer)
            ).label("start_date_group")
        ).subquery("consecutive_sad_moods")
    )

    # group by care_receipient_id, start_date_group with > 2 consecutive days
    sad_user_ids = (
        select(consecutive_sad_moods.c.care_receipient_id)
        .group_by(consecutive_sad_moods.c.care_receipient_id, consecutive_sad_moods.c.start_date_group)
        .having(func.count(literal_column("*")) >= 2)
        .subquery("sad_user_ids")
    )

    # Join to care_receipient table to get user details
    res = (
        db.execute(select(CareReceipient.name, CareReceipient.postal_code)
        .where(
            CareReceipient.is_suspended.is_(False),
            CareReceipient.id.in_(select(sad_user_ids.c.care_receipient_id))
        )
    )).all()
    
    return res

db = SessionLocal()

if __name__ == "__main__":
    compliance_rate = get_weekly_compliance_rate(db)
    sad_users_last_7_days = get_users_sad_2plus_last_7_days(db)

