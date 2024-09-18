from sqlalchemy.orm import Session

from crud import CRUDUser
from exceptions import DBGetUserException, InvalidUsernameOrPasswordException
from models import User
from schemas import Token, UserLogInRequest
from utils.hashing import verify_password
from utils.token import create_access_token


def authenticate_user(request: UserLogInRequest, db: Session) -> Token:
    try:
        if user := CRUDUser(db).get_by({"email":request.email}):
            if verify_password(request.password, str(user.password)):
                access_token = create_access_token({"user_id": user.id})
                return Token(access_token=access_token, token_type="bearer")
            raise InvalidUsernameOrPasswordException
        raise InvalidUsernameOrPasswordException
    except DBGetUserException:
        raise DBGetUserException
