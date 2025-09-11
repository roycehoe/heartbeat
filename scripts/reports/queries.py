from sqlalchemy import text
from sqlalchemy.orm.session import Session
from datetime import timedelta

from utils.datetime import now
from database import SessionLocal

def get_active_users_last_7_days(db: Session):
    """Get the number of unique active users in the last 7 days."""
    seven_days_ago = now() - timedelta(days=7)

    stmt = text("""
        SELECT COUNT(DISTINCT user_id)
        FROM mood
        WHERE created_at > :seven_days_ago
    """)

    result = db.execute(stmt, {"seven_days_ago": seven_days_ago}).scalar()

    return result


db = SessionLocal()