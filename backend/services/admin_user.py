from datetime import datetime, time, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDUser
from exceptions import (
    DBCreateAccountWithUsernameAlreadyExistsException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
    NoRecordFoundException,
    UserNotUnderCurrentAdminException,
)
from models import User
from schemas.admin_user import (
    AdminUserDashboardMoodOut,
    AdminUserDashboardOut,
    UserCreateRequest,
    UserIn,
    UserResetPasswordRequest,
    UserUpdateRequest,
)
from schemas.crud import CRUDMoodOut, CRUDUserOut
from utils.hashing import hash_password
from utils.mood import get_admin_dashboard_moods_out
from utils.token import get_token_data


def _is_valid_password(password: str, confirm_password: str) -> bool:
    return password == confirm_password


def get_create_user_response(
    request: UserCreateRequest, token: str, db: Session
) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException

        admin_id = get_token_data(token, "admin_id")
        user_in_model = UserIn(**request.model_dump(by_alias=True))
        db_user_model = User(
            username=user_in_model.username,
            password=hash_password(user_in_model.password),
            name=user_in_model.name,
            alias=user_in_model.alias,
            app_language=user_in_model.app_language,
            age=user_in_model.age,
            race=user_in_model.race,
            gender=user_in_model.gender,
            postal_code=user_in_model.postal_code,
            floor=user_in_model.floor,
            block=user_in_model.block,
            unit=user_in_model.unit,
            contact_number=user_in_model.contact_number,
            consecutive_checkins=0,
            admin_id=admin_id,
            can_record_mood=True,
            created_at=user_in_model.created_at,
        )
        CRUDUser(db).create(db_user_model)
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


def get_reset_user_password_response(
    request: UserResetPasswordRequest, token: str, db: Session
) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if request.user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException
        user_model = CRUDUser(db).get(request.user_id)
        crud_user_out = CRUDUserOut.model_validate(user_model)

        # Always reset user password to username
        new_user_password = hash_password(crud_user_out.username)

        return CRUDUser(db).reset_password(request.user_id, new_user_password)

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot delete user that is not under current admin",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
        )


def get_delete_user_response(user_id: int, token: str, db: Session) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException
        return CRUDUser(db).delete(user_id)

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot delete user that is not under current admin",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
        )


def get_update_user_response(
    user_id: int, request: UserUpdateRequest, token: str, db: Session
) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException
        if request.password != request.confirm_password:
            raise DifferentPasswordAndConfirmPasswordException

        for key, value in request.model_dump(exclude={"confirm_password"}).items():
            CRUDUser(db).update(user_id, key, value)
        return

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update user that is not under current admin",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
        )


def get_suspend_user_response(user_id: int, token: str, db: Session) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException
        CRUDUser(db).update(user_id, "is_suspended", True)
        return

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update user that is not under current admin",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
        )


def get_unsuspend_user_response(user_id: int, token: str, db: Session) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException
        CRUDUser(db).update(user_id, "is_suspended", False)
        return

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot update user that is not under current admin",
        )
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
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


def get_get_user_response(
    user_id: int, token: str, db: Session
) -> AdminUserDashboardOut:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException

        user_model = CRUDUser(db).get(user_id)
        crud_user_out = CRUDUserOut.model_validate(user_model)

        crud_moods_out = [
            CRUDMoodOut.model_validate(mood) for mood in crud_user_out.moods
        ]
        admin_dashboard_mood_out = get_admin_dashboard_moods_out(
            crud_moods_out, crud_user_out.created_at, datetime.today()
        )

        return AdminUserDashboardOut(
            user_id=crud_user_out.id,
            username=crud_user_out.username,
            contact_number=crud_user_out.contact_number,
            name=crud_user_out.name,
            alias=crud_user_out.alias,
            age=crud_user_out.age,
            race=crud_user_out.race,
            gender=crud_user_out.gender,
            postal_code=crud_user_out.postal_code,
            floor=crud_user_out.floor,
            moods=[
                AdminUserDashboardMoodOut.model_validate(mood)
                for mood in admin_dashboard_mood_out
            ],
            consecutive_checkins=crud_user_out.consecutive_checkins,
            can_record_mood=_can_record_mood(crud_user_out.id, db),
            is_suspended=crud_user_out.is_suspended,
        )

    except UserNotUnderCurrentAdminException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cannot get user that are not under current admin",
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No record of user found",
        )
