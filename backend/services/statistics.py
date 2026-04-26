from sqlmodel import Session

from crud import CRUDCaregiver, CRUDMood, CRUDCareReceipient
from settings import AppSettings
from utils.token import get_token_data


def is_super_caregiver(
    token: str,
    db: Session,
    superadmin_clerk_id: str = AppSettings.SUPERADMIN_CLERK_ID,
):
    caregiver_id = get_token_data(token, "caregiver_id")
    caregiver = CRUDCaregiver(db).get_by(caregiver_id)

    return str(caregiver.clerk_id) == superadmin_clerk_id


def get_statistics(token: str, db: Session):
    if not is_super_caregiver(token, db):
        return []

    statistics = []
    all_caregivers = [i.__dict__ for i in CRUDCaregiver(db).get_by_all({})]
    for caregiver in all_caregivers:
        statistics.append(caregiver)

    for caregiver in statistics:
        care_receipients = [
            i.__dict__
            for i in CRUDCareReceipient(db).get_by_all({"user_id": caregiver["id"]})
        ]
        caregiver["care_receipients"] = care_receipients
        for care_receipient in care_receipients:
            care_receipient_mood = [
                CRUDMood(db).get_by({"care_receipient_id": care_receipient["id"]})
                for care_receipient in care_receipients
            ][0]
            care_receipient["mood"] = [i.__dict__ for i in care_receipient_mood]

    return statistics
