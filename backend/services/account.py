from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDUser
from enums import TreeDisplayState
from exceptions import (
    DBCreateAccountWithEmailAlreadyExistsException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
    NoRecordFoundException,
    UserNotUnderCurrentAdminException,
)
from models import Admin, User
from schemas import (
    AdminCreateRequest,
    AdminIn,
    DashboardOut,
    MoodIn,
    UserCreateRequest,
    UserIn,
)
from utils.hashing import hash_password
from utils.token import get_token_data


def _is_valid_password(password: str, confirm_password: str) -> bool:
    return password == confirm_password


def get_create_admin_response(request: AdminCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException
        admin_in_model = AdminIn(**request.model_dump())
        db_admin_model = Admin(
            email=admin_in_model.email,
            password=hash_password(admin_in_model.password),
            created_at=admin_in_model.created_at,
        )
        return CRUDAdmin(db).create(db_admin_model)

    except DifferentPasswordAndConfirmPasswordException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
        )
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with email already exists",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def get_create_user_response(
    request: UserCreateRequest, token: str, db: Session
) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException

        admin_id = get_token_data(token, "admin_id")
        user_in_model = UserIn(**request.model_dump())
        db_user_model = User(
            email=user_in_model.email,
            password=hash_password(user_in_model.password),
            name=user_in_model.name,
            coins=0,
            tree_display_state=TreeDisplayState.SEEDLING,
            consecutive_checkins=0,
            claimable_gifts=0,
            admin_id=admin_id,
            can_record_mood=True,
            created_at=user_in_model.created_at,
        )
        return CRUDUser(db).create(db_user_model)

    except DifferentPasswordAndConfirmPasswordException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
        )
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with email already exists",
        )
    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def get_delete_user_response(user_id: int, token: str, db: Session) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.admin_id for user in users_under_admin]:
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
    user_id: int, fields: dict[Any, Any], token: str, db: Session
) -> None:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.admin_id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException

        for key, value in fields.items():
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


def get_get_user_response(user_id: int, token: str, db: Session) -> DashboardOut:
    try:
        admin_id = get_token_data(token, "admin_id")
        users_under_admin = CRUDUser(db).get_by_all({"admin_id": admin_id})
        if user_id not in [user.id for user in users_under_admin]:
            raise UserNotUnderCurrentAdminException

        user = CRUDUser(db).get(user_id)
        return DashboardOut(
            user_id=user.id,
            moods=[
                MoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
                for mood in user.moods
            ],
            coins=user.coins,
            tree_display_state=user.tree_display_state,
            consecutive_checkins=user.consecutive_checkins,
            claimable_gifts=user.claimable_gifts,
            can_record_mood=user.can_record_mood,
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
