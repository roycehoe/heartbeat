from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDUser
from exceptions import (
    DBException,
    InvalidUsernameOrPasswordException,
    NoRecordFoundException,
)
from schemas import LogInRequest, Token
from utils.hashing import verify_password
from utils.token import create_access_token
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDUser
from exceptions import (
    DBCreateAccountWithUsernameAlreadyExistsException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
)
from models import Admin
from schemas import (
    AdminCreateRequest,
    AdminIn,
)
from utils.hashing import hash_password


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


def authenticate_admin(request: LogInRequest, db: Session) -> Token:
    try:
        admin = CRUDAdmin(db).get_by({"username": request.username})
        if not verify_password(request.password, str(admin.password)):
            raise InvalidUsernameOrPasswordException
        access_token = create_access_token({"admin_id": admin.id})
        return Token(access_token=access_token, token_type="bearer")

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


from datetime import datetime, time, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import Mood
from crud import CRUDMood, CRUDUser
from exceptions import DBException, NoRecordFoundException
from schemas import DashboardMoodOut, DashboardOut, MoodIn, MoodOut
from utils.token import get_token_data


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUser(db).get(user_id).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def get_user_dashboard_response(token: str, db: Session) -> DashboardOut:
    user_id = get_token_data(token, "user_id")
    moods = CRUDMood(db).get_by({"user_id": user_id})
    user = CRUDUser(db).get(user_id)
    return DashboardOut(
        user_id=user_id,
        username=user.username,
        name=user.name,
        alias=user.alias,
        age=user.age,
        race=user.race,
        gender=user.gender,
        postal_code=user.postal_code,
        floor=user.floor,
        moods=[
            MoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
            for mood in moods
        ],
        contact_number=user.contact_number,
        consecutive_checkins=user.consecutive_checkins,
        can_record_mood=_can_record_mood(user_id, db),
    )


def _get_dashboard_moods_out(
    moods_in: list[Mood], start_date: datetime, end_date: datetime
) -> list[DashboardMoodOut]:
    result: list[DashboardMoodOut] = []
    parsed_moods_in = [DashboardMoodOut.model_validate(mood_in) for mood_in in moods_in]

    current_date = start_date.date()
    end_date_only = end_date.date()

    for mood_in in parsed_moods_in:
        mood_in_date = mood_in.created_at.date()

        while current_date < mood_in_date:
            if current_date > end_date_only:
                break
            missing_datetime = datetime.combine(current_date, time(23, 59))
            result.append(DashboardMoodOut(mood=None, created_at=missing_datetime))
            current_date += timedelta(days=1)

        if current_date <= end_date_only:
            result.append(
                DashboardMoodOut(mood=mood_in.mood, created_at=mood_in.created_at)
            )
        current_date = mood_in_date + timedelta(days=1)

    while current_date <= end_date_only:
        missing_datetime = datetime.combine(current_date, time(23, 59))
        result.append(DashboardMoodOut(mood=None, created_at=missing_datetime))
        current_date += timedelta(days=1)

    return result


def get_admin_dashboard_response(
    token: str, db: Session, sort: str, sort_direction: int
) -> list[DashboardOut]:
    try:
        response: list[DashboardOut] = []

        admin_id = get_token_data(token, "admin_id")
        users = CRUDUser(db).get_by_all({"admin_id": admin_id}, sort, sort_direction)
        if not users:
            return []

        for user in users:
            moods = CRUDMood(db).get_by({"user_id": user.id})
            response.append(
                DashboardOut(
                    user_id=user.id,
                    username=user.username,
                    contact_number=user.contact_number,
                    name=user.name,
                    alias=user.alias,
                    age=user.age,
                    race=user.race,
                    gender=user.gender,
                    postal_code=user.postal_code,
                    floor=user.floor,
                    moods=_get_dashboard_moods_out(
                        moods, user.created_at, datetime.today()
                    ),
                    consecutive_checkins=user.consecutive_checkins,
                    can_record_mood=_can_record_mood(user.id, db),
                )
            )
        return response

    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
