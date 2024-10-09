from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDUser
from enums import TreeDisplayState
from exceptions import (DBCreateAccountWithEmailAlreadyExistsException,
                        DBException,
                        DifferentPasswordAndConfirmPasswordException)
from models import Admin, User
from schemas import AdminCreateRequest, AdminIn, UserCreateRequest, UserIn
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



def get_create_user_response(request: UserCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DifferentPasswordAndConfirmPasswordException
        user_in_model = UserIn(**request.model_dump())
        db_user_model = User(
            email=user_in_model.email,
            password=hash_password(user_in_model.password),
            name=user_in_model.name,
            coins=0,
            tree_display_state=TreeDisplayState.SEEDLING,
            consecutive_checkins=0,
            claimable_gifts=0,
            admin_id=user_in_model.admin_id,
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
