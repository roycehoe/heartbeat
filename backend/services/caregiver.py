from datetime import datetime

from fastapi import HTTPException, status
from sqlmodel import Session

from crud import CRUDMood, CRUDCaregiver, CRUDCareReceipient
from utils.mood import get_admin_dashboard_moods_out
from utils.token import (
    get_clerk_id_from_verified_clerk_token,
    get_token_data,
)
from exceptions import (
    ClerkAuthenticationFailedException,
    DBDuplicateAccountException,
    NoRecordFoundException,
)
from models.caregiver import Caregiver
from schemas.caregiver import (
    CaregiverCreateRequest,
    CaregiverToken,
    CaregiverDashboardMoodData,
    CaregiverDashboardData,
)
from utils.token import create_access_token


def get_create_caregiver_response(request: CaregiverCreateRequest, db: Session) -> None:
    try:
        db_caregiver_model = Caregiver(
            clerk_id=request.clerk_id,
            contact_number=str(request.contact_number),
        )
        CRUDCaregiver(db).create(db_caregiver_model)
        return

    except DBDuplicateAccountException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with username already exists",
        )


def authenticate_caregiver(token: str, db: Session) -> CaregiverToken:
    try:
        caregiver_clerk_id = get_clerk_id_from_verified_clerk_token(token)

        caregiver = CRUDCaregiver(db).get_by({"clerk_id": caregiver_clerk_id})
        if not caregiver:
            raise NoRecordFoundException
        access_token = create_access_token(
            {
                "caregiver_id": caregiver.id,
            }
        )
        return CaregiverToken(access_token=access_token, token_type="bearer")

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    except ClerkAuthenticationFailedException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication with Clerk failed",
        )


def _can_record_mood(care_receipient_id: int, db: Session) -> bool:
    care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
    if not care_receipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care receipient record found",
        )
    return care_receipient.can_record_mood


def get_care_receipient_dashboard_response(
    token: str, db: Session
) -> CaregiverDashboardData:
    care_receipient_id: int = get_token_data(token, "care_receipient_id")
    mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})
    care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
    if not care_receipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care receipient record found",
        )

    return CaregiverDashboardData(
        care_receipient_id=care_receipient_id,
        name=care_receipient.name,
        alias=care_receipient.alias,
        age_range=care_receipient.age_range,
        race=care_receipient.race,
        gender=care_receipient.gender,
        postal_code=care_receipient.postal_code,
        floor=care_receipient.floor,
        moods=[
            CaregiverDashboardMoodData(mood=mood.mood, created_at=mood.created_at)
            for mood in mood_models
        ],
        contact_number=int(care_receipient.contact_number),
        consecutive_checkins=care_receipient.consecutive_checkins,
        consecutive_non_checkins=care_receipient.consecutive_non_checkins,
        can_record_mood=_can_record_mood(care_receipient_id, db),
    )


def get_caregiver_dashboard_response(
    token: str, db: Session, sort: str, sort_direction: int
) -> list[CaregiverDashboardData]:
    response: list[CaregiverDashboardData] = []

    caregiver_id = get_token_data(token, "caregiver_id")
    care_receipient_models = CRUDCareReceipient(db).get_by_all(
        {"user_id": caregiver_id}, sort, sort_direction
    )
    if not care_receipient_models:
        return []

    for care_receipient in care_receipient_models:
        mood_models = CRUDMood(db).get_by(
            {"care_receipient_id": care_receipient.id}
        )

        dashboard_moods_out = get_admin_dashboard_moods_out(
            mood_models, care_receipient.created_at, datetime.today()
        )

        response.append(
            CaregiverDashboardData(
                care_receipient_id=care_receipient.id,
                contact_number=int(care_receipient.contact_number),
                name=care_receipient.name,
                alias=care_receipient.alias,
                age_range=care_receipient.age_range,
                race=care_receipient.race,
                gender=care_receipient.gender,
                postal_code=care_receipient.postal_code,
                floor=care_receipient.floor,
                moods=dashboard_moods_out,
                consecutive_checkins=care_receipient.consecutive_checkins,
                consecutive_non_checkins=care_receipient.consecutive_non_checkins,
                can_record_mood=_can_record_mood(care_receipient.id, db),
            )
        )
    return response
