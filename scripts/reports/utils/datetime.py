from datetime import datetime, timedelta, timezone


def now():
    """Get the current time in Singapore Time (SGT, UTC+8)"""
    # Define the SGT timezone (UTC+8)
    sgt_timezone = timezone(timedelta(hours=8))

    # Get the current time in UTC
    utc_now = datetime.now(timezone.utc)

    # Convert to Singapore Time (SGT)
    sgt_now = utc_now.astimezone(sgt_timezone)

    return sgt_now
