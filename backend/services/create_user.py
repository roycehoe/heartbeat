from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDCaregiver, CRUDUser
from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
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
            raise DBCreateAccountException
        admin_in_model = AdminIn(**request.model_dump())
        db_admin_model = Admin(
            email=admin_in_model.email,
            password=hash_password(admin_in_model.password),
            created_at=admin_in_model.created_at,
        )
        if new_admin := CRUDAdmin(db).create(db_admin_model):
            return None
        raise DBCreateAccountException
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException


def get_create_caregiver_response(request: CaregiverCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DBCreateAccountException
        caregiver_in_model = CaregiverIn(**request.model_dump())
        db_caregiver_model = Caregiver(
            email=caregiver_in_model.email,
            password=hash_password(caregiver_in_model.password),
            admin_id=caregiver_in_model.admin_id,
            created_at=caregiver_in_model.created_at,
        )
        if new_caregiver := CRUDCaregiver(db).create(db_caregiver_model):
            return None
        raise DBCreateAccountException
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException


def get_create_user_response(request: UserCreateRequest, db: Session) -> None:
    try:
        if not _is_valid_password(request.password, request.confirm_password):
            raise DBCreateAccountException
        user_in_model = UserIn(**request.model_dump())
        db_user_model = User(
            email=user_in_model.email,
            password=hash_password(user_in_model.password),
            admin_id=user_in_model.admin_id,
            caregiver_id=user_in_model.caregiver_id,
            created_at=user_in_model.created_at,
            can_record_mood=True,
        )
        if new_user := CRUDUser(db).create(db_user_model):
            return None
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except DBCreateAccountException:
        raise DBCreateAccountException
