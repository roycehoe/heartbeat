from sqlalchemy.orm import Session

from crud import CRUDUser
from exceptions import (
    DBCreateUserException,
    DBCreateUserWithEmailAlreadyExistsException,
)
from models import Admin
from schemas import AdminCreateRequest, AdminIn
from utils.hashing import hash_password


def is_valid_password(password: str, confirm_password: str) -> bool:
    return password == confirm_password


def create_admin(request: AdminCreateRequest, db: Session) -> Admin:
    try:
        admin_in_model = AdminIn(**request.model_dump())
        db_admin_model = Admin(
            email=admin_in_model.email,
            password=hash_password(admin_in_model.password),
            created_at=admin_in_model.created_at,
        )
        if new_admin := CRUDUser(db).create(db_admin_model):
            return new_admin
        raise DBCreateUserException
    except DBCreateUserWithEmailAlreadyExistsException:
        raise DBCreateUserException
