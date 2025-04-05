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


def authenticate_user(request: LogInRequest, db: Session) -> Token:
    try:
        user = CRUDUser(db).get_by({"username": request.username})
        if not verify_password(request.password, str(user.password)):
            raise InvalidUsernameOrPasswordException

        access_token = create_access_token(
            {"user_id": user.id, "app_language": user.app_language}
        )
        return Token(access_token=access_token, token_type="bearer")

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirm password must be the same",
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
