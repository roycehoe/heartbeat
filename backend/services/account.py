from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDCaregiver, CRUDUser
from enums import TreeDisplayState
from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
    DBException,
    DifferentPasswordAndConfirmPasswordException,
)
from models import Admin, Caregiver, User
from schemas import (
    AdminCreateRequest,
    AdminIn,
    CaregiverCreateRequest,
    CaregiverIn,
    UserCreateRequest,
    UserIn,
)
from utils.hashing import hash_password


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


def get_create_caregiver_response(request: CaregiverCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException
        caregiver_in_model = CaregiverIn(**request.model_dump())
        db_caregiver_model = Caregiver(
            email=caregiver_in_model.email,
            password=hash_password(caregiver_in_model.password),
            admin_id=caregiver_in_model.admin_id,
            created_at=caregiver_in_model.created_at,
        )
        return CRUDCaregiver(db).create(db_caregiver_model)

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


def get_create_user_response(request: UserCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException
        user_in_model = UserIn(**request.model_dump())
        db_user_model = User(
            email=user_in_model.email,
            password=hash_password(user_in_model.password),
            coins=0,
            tree_display_state=TreeDisplayState.SEEDLING,
            consecutive_checkins=0,
            can_claim_gifts=False,
            admin_id=user_in_model.admin_id,
            caregiver_id=user_in_model.caregiver_id,
            created_at=user_in_model.created_at,
            can_record_mood=True,
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
