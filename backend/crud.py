from typing import Any, Generic, Type, TypeVar

from sqlalchemy.orm import Session

from exceptions import (DBCreateAccountWithEmailAlreadyExistsException,
                        DBException, DBGetAccountException,
                        NoRecordFoundException)
from models import Admin, Mood, User

T = TypeVar("T", User, Admin)


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

        except DBCreateAccountWithEmailAlreadyExistsException:
            raise DBCreateAccountWithEmailAlreadyExistsException
        except Exception as e:
            raise DBException(e)
        return account

    def update(self, id: int, field: str, value: Any) -> T:
        try:
            if (
                account := self.session.query(self.account_model)
                .filter_by(id=id)
                .first()
            ):
                setattr(account, field, value)
                self.session.commit()
                self.session.refresh(account)
                return account
            raise NoRecordFoundException

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
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
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
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def get_by_all(self, field: dict[Any, Any]) -> list[T]:
        try:
            return self.session.query(self.account_model).filter_by(**field).all()

        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            if (
                account := self.session.query(self.account_model)
                .filter_by(id=id)
                .first()
            ):
                self.session.delete(account)
                self.session.commit()
                return
            raise NoRecordFoundException

        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            self.session.query(self.account_model).delete()
            return

        except Exception as e:
            raise DBException(e)


class CRUDUser(CRUDAccount):
    def __init__(self, session: Session):
        super().__init__(session, User)

    def reset_all_can_record_mood(self) -> None:
        # TODO: Think of a better way to
        # use this. Here might not be the best place

        for row in self.session.query(User):
            row.update({"can_record_mood": True})
        self.session.commit()
        return


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
            self.session.refresh(mood)
        except Exception as e:
            raise DBException(e)
        return mood

    def get(self, id: int) -> Mood:
        try:
            if user := self.session.query(Mood).filter_by(id=id).first():
                return user
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> list[Mood]:
        try:
            return self.session.query(Mood).filter_by(**field).all()
        except Exception as e:
            raise DBException(e)

    def get_latest(self, user_id: int, limit: int) -> list[Mood]:
        try:
            return (
                self.session.query(Mood)
                .filter_by(user_id=user_id)
                .order_by(Mood.created_at.desc())
                .limit(limit)
                .all()
            )
        except Exception as e:
            raise DBException(e)

    def get_all(self) -> list[Mood]:
        try:
            return self.session.query(Mood).all()
        except Exception:
            raise DBGetAccountException

    def delete_all(self) -> None:
        try:
            self.session.query(Mood).delete()
            return
        except Exception:
            raise DBGetAccountException
