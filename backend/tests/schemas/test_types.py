from datetime import datetime, timedelta, timezone

from pydantic import BaseModel

from schemas.types import UtcDatetime


class _Model(BaseModel):
    created_at: UtcDatetime


def _serialized(value: datetime) -> str:
    return _Model(created_at=value).model_dump(mode="json")["created_at"]


def test_naive_datetime_is_serialized_as_utc() -> None:
    assert _serialized(datetime(2026, 10, 1, 3, 0, 0)) == "2026-10-01T03:00:00Z"


def test_utc_aware_datetime_is_serialized_with_z_suffix() -> None:
    assert _serialized(datetime(2026, 10, 1, 3, 0, 0, tzinfo=timezone.utc)) == (
        "2026-10-01T03:00:00Z"
    )


def test_non_utc_aware_datetime_is_converted_to_utc() -> None:
    sgt = timezone(timedelta(hours=8))

    assert _serialized(datetime(2026, 10, 1, 11, 0, 0, tzinfo=sgt)) == (
        "2026-10-01T03:00:00Z"
    )


def test_python_mode_dump_keeps_datetime() -> None:
    value = datetime(2026, 10, 1, 3, 0, 0)

    assert _Model(created_at=value).model_dump()["created_at"] == value
