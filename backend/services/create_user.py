from sqlalchemy.orm import Session

from crud import CRUDUser
from exceptions import (DBCreateUserException,
                        DBCreateUserWithEmailAlreadyExistsException)
from models import User
from schemas import UserCreateRequest, UserIn
from utils.hashing import hash_password


def create_user(request: UserCreateRequest, db: Session) -> User:
    try:
        user_in_model = UserIn(**{**request.model_dump(), "password":hash_password(request.password)})
        db_user_model = User(**user_in_model.model_dump())
        if new_user := CRUDUser(db).create(db_user_model):
            return new_user
        raise DBCreateUserException
    except DBCreateUserWithEmailAlreadyExistsException:
        raise DBCreateUserException
