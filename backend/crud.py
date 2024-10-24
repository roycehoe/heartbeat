from typing import Any, Generic, Type, TypeVar

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from exceptions import (
    DBCreateAccountWithEmailAlreadyExistsException,
    DBException,
    DBGetAccountException,
    NoRecordFoundException,
)
from models import Admin, Mood, User


class CRUDUser:
    def __init__(self, session: Session):
        self.session = session

    def create(self, account: User) -> User:
        try:
            if self.session.query(User).filter_by(email=account.email).first():
                raise DBCreateAccountWithEmailAlreadyExistsException
            self.session.add(account)
            self.session.commit()

        except DBCreateAccountWithEmailAlreadyExistsException:
            raise DBCreateAccountWithEmailAlreadyExistsException
        except Exception as e:
            raise DBException(e)
        return account

    def update(self, id: int, field: str, value: Any) -> User:
        try:
            if account := self.session.query(User).filter_by(id=id).first():
                setattr(account, field, value)
                self.session.commit()
                self.session.refresh(account)
                return account
            raise NoRecordFoundException

        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> User:
        try:
            if account := self.session.query(User).filter_by(id=id).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> User:
        try:
            if account := self.session.query(User).filter_by(**field).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def get_by_all(
        self,
        field: dict[Any, Any],
        sort: str = "consecutive_checkins",
        sort_direction: int = 0,
    ) -> list[User]:
        try:
            if sort_direction == 0:
                return (
                    self.session.query(User)
                    .filter_by(**field)
                    .order_by(desc(sort))
                    .all()
                )
            return self.session.query(User).filter_by(**field).order_by(asc(sort)).all()

        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            if account := self.session.query(User).filter_by(id=id).first():
                self.session.delete(account)
                self.session.commit()
                return
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            self.session.query(User).delete()
            return

        except Exception as e:
            raise DBException(e)

    def reset_all_can_record_mood(self) -> None:
        # TODO: Think of a better way to
        # use this. Here might not be the best place

        for row in self.session.query(User):
            row.update({"can_record_mood": True})
        self.session.commit()
        return


class CRUDAdmin:
    def __init__(self, session: Session):
        self.session = session

    def create(self, account: Admin) -> Admin:
        try:
            if self.session.query(Admin).filter_by(email=account.email).first():
                raise DBCreateAccountWithEmailAlreadyExistsException
            self.session.add(account)
            self.session.commit()

        except DBCreateAccountWithEmailAlreadyExistsException:
            raise DBCreateAccountWithEmailAlreadyExistsException
        except Exception as e:
            raise DBException(e)
        return account

    def update(self, id: int, field: str, value: Any) -> Admin:
        try:
            if account := self.session.query(Admin).filter_by(id=id).first():
                setattr(account, field, value)
                self.session.commit()
                self.session.refresh(account)
                return account
            raise NoRecordFoundException

        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> Admin:
        try:
            if account := self.session.query(Admin).filter_by(id=id).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> Admin:
        try:
            if account := self.session.query(Admin).filter_by(**field).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def get_by_all(
        self,
        field: dict[Any, Any],
        sort: str = "consecutive_checkins",
        sort_direction: int = 0,
    ) -> list[Admin]:
        try:
            if sort_direction == 0:
                return (
                    self.session.query(Admin)
                    .filter_by(**field)
                    .order_by(desc(sort))
                    .all()
                )
            return (
                self.session.query(Admin).filter_by(**field).order_by(asc(sort)).all()
            )

        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            if account := self.session.query(Admin).filter_by(id=id).first():
                self.session.delete(account)
                self.session.commit()
                return
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            self.session.query(Admin).delete()
            return

        except Exception as e:
            raise DBException(e)


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
