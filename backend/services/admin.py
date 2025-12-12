from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, time, timedelta

from crud import CRUDMood

from schemas.crud import CRUDMoodOut, CRUDUserOut
from utils.mood import get_admin_dashboard_moods_out
from utils.token import get_token_data

from crud import CRUDAdmin, CRUDUser
from exceptions import (
    DBCreateAccountWithUsernameAlreadyExistsException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
    InvalidUsernameOrPasswordException,
    NoRecordFoundException,
)
from models import Admin
from schemas.admin import (
    AdminCreateRequest,
    AdminIn,
    AdminLogInRequest,
    AdminToken,
    AdminDashboardMoodOut,
    AdminDashboardOut,
)

from utils.hashing import hash_password, verify_password
from utils.token import create_access_token


def _is_valid_password(password: str, confirm_password: str) -> bool:
    return password == confirm_password


def get_create_admin_response(request: AdminCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException
        admin_in_model = AdminIn(**request.model_dump(by_alias=True))
        db_admin_model = Admin(
            username=admin_in_model.username,
            password=hash_password(admin_in_model.password),
            name=admin_in_model.name,
            created_at=admin_in_model.created_at,
            contact_number=admin_in_model.contact_number,
        )
        CRUDAdmin(db).create(db_admin_model)
        return

    except DifferentPasswordAndConfirmPasswordException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
        )
    except DBCreateAccountWithUsernameAlreadyExistsException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with username already exists",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def authenticate_admin(request: AdminLogInRequest, db: Session) -> AdminToken:
    try:
        admin = CRUDAdmin(db).get_by({"username": request.username})
        if not verify_password(request.password, str(admin.password)):
            raise InvalidUsernameOrPasswordException
        access_token = create_access_token({"admin_id": admin.id})
        return AdminToken(access_token=access_token, token_type="bearer")

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    except InvalidUsernameOrPasswordException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUserOut.model_validate(CRUDUser(db).get(user_id)).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_user_dashboard_response(token: str, db: Session) -> AdminDashboardOut:
    user_id: int = get_token_data(token, "user_id")
    mood_models = CRUDMood(db).get_by({"user_id": user_id})
    user_model = CRUDUser(db).get(user_id)

    crud_mood_out = [
        CRUDMoodOut.model_validate(mood_model) for mood_model in mood_models
    ]
    crud_user_out = CRUDUserOut.model_validate(user_model)

    return AdminDashboardOut(
        user_id=user_id,
        username=crud_user_out.username,
        name=crud_user_out.name,
        alias=crud_user_out.alias,
        age=crud_user_out.age,
        race=crud_user_out.race,
        gender=crud_user_out.gender,
        postal_code=crud_user_out.postal_code,
        floor=crud_user_out.floor,
        moods=[
            AdminDashboardMoodOut(mood=mood.mood, created_at=mood.created_at)
            for mood in crud_mood_out
        ],
        contact_number=crud_user_out.contact_number,
        consecutive_checkins=crud_user_out.consecutive_checkins,
        can_record_mood=_can_record_mood(user_id, db),
    )


def get_admin_dashboard_response(
    token: str, db: Session, sort: str, sort_direction: int
) -> list[AdminDashboardOut]:
    try:
        response: list[AdminDashboardOut] = []

        admin_id = get_token_data(token, "admin_id")
        user_models = CRUDUser(db).get_by_all(
            {"admin_id": admin_id}, sort, sort_direction
        )
        if not user_models:
            return []

        for user_model in user_models:
            mood_models = CRUDMood(db).get_by({"user_id": user_model.id})

            crud_moods_out = [
                CRUDMoodOut.model_validate(CRUD_mood_out)
                for CRUD_mood_out in mood_models
            ]
            crud_user_out = CRUDUserOut.model_validate(user_model)

            dashboard_moods_out = get_admin_dashboard_moods_out(
                crud_moods_out, crud_user_out.created_at, datetime.today()
            )

            response.append(
                AdminDashboardOut(
                    user_id=crud_user_out.id,
                    contact_number=crud_user_out.contact_number,
                    name=crud_user_out.name,
                    alias=crud_user_out.alias,
                    age=crud_user_out.age,
                    race=crud_user_out.race,
                    gender=crud_user_out.gender,
                    postal_code=crud_user_out.postal_code,
                    floor=crud_user_out.floor,
                    moods=dashboard_moods_out,
                    consecutive_checkins=crud_user_out.consecutive_checkins,
                    can_record_mood=_can_record_mood(crud_user_out.id, db),
                )
            )
        return response

    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
