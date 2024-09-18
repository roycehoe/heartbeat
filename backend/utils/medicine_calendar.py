from datetime import datetime, timedelta

from ics import AudioAlarm, Calendar, Event
from ics.event import BaseAlarm

from exceptions import CalendarCreateException
from schemas import MedicineLabel, SpecialDosageInstructions

SAMPLE_TEXT = """PARACETAMOL 500MG TABLET - 20 TABLET Take 2 tabs four times a day FOR FEVER AND PAIN DO NOT EXCEED 8 TABS PER DAY CONTAINS PARACETAMOL"""

DEFAULT_BREAKFAST_TIME = "08:00"
DEFAULT_LUNCH_TIME = "12:00"
DEFAULT_DINNER_TIME = "19:00"

DEFAULT_BEFORE_BEDTIME = "23:00"
DEFAULT_MORNING_TIME = "7:30"

DOSAGE_TIMES_BY_PRIORITY = (
    DEFAULT_LUNCH_TIME,
    DEFAULT_DINNER_TIME,
    DEFAULT_BREAKFAST_TIME,
    "15:00",
    "10:00",
    "22:00",
    "13:30",
    "23:00",
)

DEFAULT_AUDIO_ALARM_BEFORE_CONSUMPTION_TIME_MINUTES = 15
DEFAULT_EVENT_DURATION_MINUTES = 30

DEFAULT_TZ_SGT_OFFSET = -8


def _create_audio_alarm(
    medicine_consumption_time: datetime,
    audio_alarm_before_consuption_time_minutes: int,
) -> list[BaseAlarm]:
    return [
        AudioAlarm(
            trigger=medicine_consumption_time
            - timedelta(minutes=audio_alarm_before_consuption_time_minutes)
        )
    ]


def _create_calendar_event_with_alarm(
    medicine_label: MedicineLabel,
    medicine_consumption_time: datetime,
    event_duration_minutes: int = DEFAULT_EVENT_DURATION_MINUTES,
    audio_alarm_before_consuption_time_minutes: int = DEFAULT_AUDIO_ALARM_BEFORE_CONSUMPTION_TIME_MINUTES,
):
    event = Event()
    event.name = (
        f"💊x{medicine_label.dosage_frequency_count}:{medicine_label.medicine_name}"
    )
    event.begin = medicine_consumption_time
    event.duration = timedelta(minutes=event_duration_minutes)
    event.alarms = _create_audio_alarm(
        medicine_consumption_time, audio_alarm_before_consuption_time_minutes
    )

    return event


def _get_dosage_times(medicine_label: MedicineLabel) -> list[str]:
    if medicine_label.dosage_instructions == SpecialDosageInstructions.WHEN_NECESSARY:
        return []
    if medicine_label.dosage_instructions == SpecialDosageInstructions.NO_INSTRUCTIONS:
        return [
            dosage_time
            for dosage_time in DOSAGE_TIMES_BY_PRIORITY[
                : medicine_label.dosage_frequency_count
            ]
        ]

    dosage_times = []
    if medicine_label.dosage_instructions == SpecialDosageInstructions.EVERY_MORNING:
        dosage_times.append(DEFAULT_MORNING_TIME)
    if medicine_label.dosage_instructions == SpecialDosageInstructions.BEFORE_BEDTIME:
        dosage_times.append(DEFAULT_BEFORE_BEDTIME)
    return dosage_times


def _get_dosage_datetimes(
    medicine_label: MedicineLabel, timezone_offset: int = DEFAULT_TZ_SGT_OFFSET
) -> list[datetime]:
    dosage_times = _get_dosage_times(medicine_label)
    if not dosage_times:  # Medicine can be taken when necessary
        return []

    dosage_datetime = []
    time_now = datetime.now()
    days_from_today = 0

    while len(dosage_datetime) < medicine_label.total_doses:
        for dosage_time in dosage_times:
            current_dosage_time = datetime.strptime(dosage_time, "%H:%M").replace(
                year=datetime.today().year,
                month=datetime.today().month,
                day=datetime.today().day,
            ) + timedelta(days=days_from_today)
            if current_dosage_time < time_now:
                continue
            # Because calendar module converts all time to UTC-0
            # Temp fix
            dosage_datetime.append(
                current_dosage_time + timedelta(hours=timezone_offset)
            )
        days_from_today += 1
    return dosage_datetime[: medicine_label.total_doses]


def get_medicine_calendar(medicine_label: MedicineLabel) -> Calendar:
    try:
        calendar = Calendar()
        dosage_datetimes = _get_dosage_datetimes(medicine_label)
        calendar_event = [
            _create_calendar_event_with_alarm(medicine_label, dosage_datetime)
            for dosage_datetime in dosage_datetimes
        ]
        calendar.events = set(calendar_event)
        return calendar
    except Exception:
        raise CalendarCreateException
