from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from crud import CRUDMood

from schemas.crud import CRUDMoodOut, CRUDCareReceipientOut
from utils.mood import get_admin_dashboard_moods_out
from utils.token import (
    get_clerk_id_from_verified_clerk_token,
    get_token_data,
)

from crud import CRUDCaregiver, CRUDCareReceipient
from exceptions import (
    ClerkAuthenticationFailedException,
    DBDuplicateAccountException,
    DBException,
    NoRecordFoundException,
)
from models.caregiver import Caregiver
from schemas.caregiver import (
    CaregiverCreateRequest,
    CaregiverIn,
    CaregiverToken,
    CaregiverDashboardMoodOut,
    CaregiverDashboardOut,
)

from utils.token import create_access_token


def get_create_caregiver_response(request: CaregiverCreateRequest, db: Session) -> None:
    try:
        caregiver_in_model = CaregiverIn(**request.model_dump(by_alias=True))
        db_caregiver_model = Caregiver(
            clerk_id=caregiver_in_model.clerk_id,
            contact_number=caregiver_in_model.contact_number,
        )
        CRUDCaregiver(db).create(db_caregiver_model)
        return

    except DBDuplicateAccountException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with username already exists",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def authenticate_caregiver(token: str, db: Session) -> CaregiverToken:
    try:
        caregiver_clerk_id = get_clerk_id_from_verified_clerk_token(token)

        caregiver = CRUDCaregiver(db).get_by({"clerk_id": caregiver_clerk_id})
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
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(care_receipient_id: int, db: Session) -> bool:
    try:
        return CRUDCareReceipientOut.model_validate(
            CRUDCareReceipient(db).get(care_receipient_id)
        ).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care receipient record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_care_receipient_dashboard_response(
    token: str, db: Session
) -> CaregiverDashboardOut:
    care_receipient_id: int = get_token_data(token, "care_receipient_id")
    mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})
    care_receipient_model = CRUDCareReceipient(db).get(care_receipient_id)

    crud_mood_out = [
        CRUDMoodOut.model_validate(mood_model) for mood_model in mood_models
    ]
    crud_care_receipient_out = CRUDCareReceipientOut.model_validate(care_receipient_model)

    return CaregiverDashboardOut(
        care_receipient_id=care_receipient_id,
        name=crud_care_receipient_out.name,
        alias=crud_care_receipient_out.alias,
        age=crud_care_receipient_out.age,
        race=crud_care_receipient_out.race,
        gender=crud_care_receipient_out.gender,
        postal_code=crud_care_receipient_out.postal_code,
        floor=crud_care_receipient_out.floor,
        moods=[
            CaregiverDashboardMoodOut(mood=mood.mood, created_at=mood.created_at)
            for mood in crud_mood_out
        ],
        contact_number=crud_care_receipient_out.contact_number,
        consecutive_checkins=crud_care_receipient_out.consecutive_checkins,
        consecutive_non_checkins=crud_care_receipient_out.consecutive_non_checkins,
        can_record_mood=_can_record_mood(care_receipient_id, db),
    )


def get_caregiver_dashboard_response(
    token: str, db: Session, sort: str, sort_direction: int
) -> list[CaregiverDashboardOut]:
    try:
        response: list[CaregiverDashboardOut] = []

        caregiver_id = get_token_data(token, "caregiver_id")
        care_receipient_models = CRUDCareReceipient(db).get_by_all(
            {"user_id": caregiver_id}, sort, sort_direction
        )
        if not care_receipient_models:
            return []

        for care_receipient_model in care_receipient_models:
            mood_models = CRUDMood(db).get_by(
                {"care_receipient_id": care_receipient_model.id}
            )

            crud_moods_out = [
                CRUDMoodOut.model_validate(CRUD_mood_out)
                for CRUD_mood_out in mood_models
            ]
            crud_care_receipient_out = CRUDCareReceipientOut.model_validate(
                care_receipient_model
            )

            dashboard_moods_out = get_admin_dashboard_moods_out(
                crud_moods_out, crud_care_receipient_out.created_at, datetime.today()
            )

            response.append(
                CaregiverDashboardOut(
                    care_receipient_id=crud_care_receipient_out.id,
                    contact_number=crud_care_receipient_out.contact_number,
                    name=crud_care_receipient_out.name,
                    alias=crud_care_receipient_out.alias,
                    age=crud_care_receipient_out.age,
                    race=crud_care_receipient_out.race,
                    gender=crud_care_receipient_out.gender,
                    postal_code=crud_care_receipient_out.postal_code,
                    floor=crud_care_receipient_out.floor,
                    moods=dashboard_moods_out,
                    consecutive_checkins=crud_care_receipient_out.consecutive_checkins,
                    consecutive_non_checkins=crud_care_receipient_out.consecutive_non_checkins,
                    can_record_mood=_can_record_mood(crud_care_receipient_out.id, db),
                )
            )
        return response

    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
