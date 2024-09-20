from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDCaregiver, CRUDUser
from exceptions import DBGetAccountException, InvalidUsernameOrPasswordException
from schemas import LogInRequest, Token
from utils.hashing import verify_password
from utils.token import create_access_token


def authenticate_user(request: LogInRequest, db: Session) -> Token:
    try:
        if user := CRUDUser(db).get_by({"email": request.email}):
            if verify_password(request.password, str(user.password)):
                access_token = create_access_token({"user_id": user.id})
                return Token(access_token=access_token, token_type="bearer")
            raise InvalidUsernameOrPasswordException
        raise InvalidUsernameOrPasswordException
    except DBGetAccountException:
        raise DBGetAccountException


def authenticate_caregiver(request: LogInRequest, db: Session) -> Token:
    try:
        caregiver = CRUDCaregiver(db).get_by({"email": request.email})
        if caregiver is None:
            raise DBGetAccountException
        if not verify_password(request.password, str(caregiver.password)):
            raise InvalidUsernameOrPasswordException

        access_token = create_access_token({"caregiver_id": caregiver.id})
        return Token(access_token=access_token, token_type="bearer")

    except DBGetAccountException:
        raise DBGetAccountException


def authenticate_admin(request: LogInRequest, db: Session) -> Token:
    try:
        admin = CRUDAdmin(db).get_by({"email": request.email})
        if admin is None:
            raise DBGetAccountException
        if not verify_password(request.password, str(admin.password)):
            raise InvalidUsernameOrPasswordException
        access_token = create_access_token({"admin_id": admin.id})
        return Token(access_token=access_token, token_type="bearer")
    except DBGetAccountException:
        raise DBGetAccountException
