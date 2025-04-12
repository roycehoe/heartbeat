import hashlib
import io
from time import time
from typing import BinaryIO

import qrcode
from sqlalchemy.orm import Session

from crud import CRUDCalendar
from exceptions import (
    CalendarCreateException,
    DBCreateAccountException,
    DBGetAccountException,
    MedicineLabelReadException,
    NoRecordFoundException,
)
from models import Calendar
from schemas import MedicineLabel
from utils.label_reader import get_medicine_label
from utils.medicine_calendar import get_medicine_calendar


def _create_hash(plaintext: str) -> str:
    return hashlib.sha256(plaintext.encode("utf-8")).hexdigest()


def _create_calendar_hash(patient_name: str) -> str:
    """Creates a more or less unique hash by concatenating patient name with unix time"""
    return _create_hash(f"{patient_name}{time()}")


def get_upload_medicine_label_response(file: BinaryIO) -> MedicineLabel:
    try:
        medicine_label = get_medicine_label(file)
    except MedicineLabelReadException:
        raise MedicineLabelReadException

    return medicine_label


def get_calendar_qr_code_response(
    medicine_label: MedicineLabel, db: Session, base_url: str
) -> io.BytesIO:
    try:
        medicine_calendar = get_medicine_calendar(medicine_label)
    except CalendarCreateException:
        raise CalendarCreateException

    try:
        calendar_hash = _create_calendar_hash(medicine_label.patient_name)
        CRUDCalendar(db).create(
            Calendar(
                hash=calendar_hash,
                calendar=medicine_calendar.serialize(),
            )
        )
        # return GetCalendarHashResponse(path=calendar_hash)
    except DBCreateAccountException:
        raise DBCreateAccountException

    calendar = CRUDCalendar(db).get(hash=calendar_hash)
    qrcode_file = qrcode.make(f"{base_url}{calendar.hash}")

    buffer = io.BytesIO()
    qrcode_file.save(buffer, format="png")
    buffer.seek(0)
    return buffer


def get_calendar_file_response(hash: str, db: Session) -> io.StringIO:
    try:
        calendar = CRUDCalendar(db).get(hash=hash)
    except DBGetAccountException:
        raise DBGetAccountException
    except NoRecordFoundException:
        raise NoRecordFoundException

    ical_file = io.StringIO(str(calendar.calendar))
    return ical_file
