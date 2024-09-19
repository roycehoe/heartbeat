from typing import Any, Generic, Type, TypeVar

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
    DBGetAccountException,
    NoAccountFoundException,
)
from models import Admin, Caregiver, Mood, User

T = TypeVar("T", User, Caregiver, Admin)


class CRUDAccount(Generic[T]):  # TODO: Methods for all account tables
    def __init__(self, session: Session, account_model: Type[T]):
        self.session = session
        self.account_model = account_model

    def create(self, account: T) -> T:
        try:
            if (
                self.session.query(self.account_model)
                .filter_by(email=account.email)
                .first()
            ):
                raise DBCreateAccountWithEmailAlreadyExistsException
            self.session.add(account)
            self.session.commit()
        except Exception:
            raise DBCreateAccountException
        return account

    def update(self, id: int, field: str, value: Any) -> T:
        try:
            if (
                account := self.session.query(self.account_model)
                .filter_by(id=id)
                .first()
            ):
                account.update({field: value})
                self.session.commit()
                return account
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> T:
        try:
            if (
                account := self.session.query(self.account_model)
                .filter_by(id=id)
                .first()
            ):
                return account
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> T:
        try:
            if (
                account := self.session.query(self.account_model)
                .filter_by(**field)
                .first()
            ):
                return account
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException

    def get_all(self) -> list[T]:
        try:
            if account := self.session.query(self.account_model).all():
                return account
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException


class CRUDUser(CRUDAccount):
    def __init__(self, session: Session):
        super().__init__(session, User)


class CRUDCaregiver(CRUDAccount):
    def __init__(self, session: Session):
        super().__init__(session, Caregiver)


class CRUDAdmin(CRUDAccount):
    def __init__(self, session: Session):
        super().__init__(session, Admin)


class CRUDMood:
    def __init__(self, session: Session):
        self.session = session

    def create(self, mood: Mood) -> Mood:
        try:
            self.session.add(mood)
            self.session.commit()
        except IntegrityError:
            self.session.rollback()
        except Exception:
            raise DBCreateAccountException
        return mood

    def get(self, id: int) -> Mood:
        try:
            if user := self.session.query(Mood).filter_by(id=id).first():
                return user
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> list[Mood]:
        try:
            if user := self.session.query(Mood).filter_by(**field).all():
                return user
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException

    def get_all(self) -> list[Mood]:
        try:
            if user := self.session.query(Mood).all():
                return user
            raise NoAccountFoundException
        except Exception:
            raise DBGetAccountException
