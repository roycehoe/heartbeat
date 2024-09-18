from typing import Any

from sqlalchemy.orm import Session

from exceptions import (DBCreateUserException,
                        DBCreateUserWithEmailAlreadyExistsException,
                        DBGetUserException, NoUserException)
from models import User


class CRUDUser:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        try:
            if self.session.query(User).filter_by(email=user.email).first():
                raise DBCreateUserWithEmailAlreadyExistsException
            self.session.add(user)
            self.session.commit()
        except Exception:
            raise DBCreateUserException
        return user


    def update(self, id: int, field: str, value: Any) -> User:
        try:
            if user := self.session.query(User).filter_by(id=id).first():
                user.update({field: value})
                self.session.commit()
                return user
            raise NoUserException
        except Exception:
            raise DBGetUserException

    def get(self, id: int) -> User:
        try:
            if user := self.session.query(User).filter_by(id=id).first():
                return user
            raise NoUserException
        except Exception:
            raise DBGetUserException

    def get_by(self, field: dict[Any, Any]) -> User:
        try:
            if user := self.session.query(User).filter_by(**field).first():
                return user
            raise NoUserException
        except Exception:
            raise DBGetUserException

    def get_all(self) -> list[User]:
        try:
            if user := self.session.query(User).all():
                return user
            raise NoUserException
        except Exception:
            raise DBGetUserException
