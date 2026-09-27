from datetime import date, datetime, time, timezone
from zoneinfo import ZoneInfo

APP_TIMEZONE_NAME = "Asia/Singapore"
APP_TIMEZONE = ZoneInfo(APP_TIMEZONE_NAME)


def now() -> datetime:
    """The current time, as a timezone-aware datetime in the app's timezone."""
    return datetime.now(APP_TIMEZONE)


def today() -> date:
    """The calendar date it is right now in the app's timezone."""
    return now().date()


def to_app_timezone(value: datetime) -> datetime:
    """Convert `value` to the app's timezone.

    A naive datetime is assumed to be UTC: `mood.created_at` and
    `care_receipient.created_at` were written as naive UTC before they became
    timezone-aware columns, so rows created then still read back naive.
    """
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc).astimezone(APP_TIMEZONE)
    return value.astimezone(APP_TIMEZONE)


def app_date(value: datetime) -> date:
    """The calendar date `value` falls on in the app's timezone.

    A check-in is "today's" check-in if it happened on today's Singapore date,
    which is what the nightly cron job and the caregiver dashboard both mean by
    a day. Bucketing by the UTC date instead puts every check-in made between
    midnight and 8am into the previous day.
    """
    return to_app_timezone(value).date()


def end_of_day(value: date) -> datetime:
    """The last minute of `value`, in the app's timezone."""
    return datetime.combine(value, time(23, 59), tzinfo=APP_TIMEZONE)
