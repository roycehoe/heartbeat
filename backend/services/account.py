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
