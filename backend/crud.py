from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from exceptions import (
    DBCreateAccountWithUsernameAlreadyExistsException,
    DBException,
    DBGetAccountException,
    NoRecordFoundException,
)
from models import User, Mood, CareReceipient


class CRUDUser:
    def __init__(self, session: Session):
        self.session = session

    def create(self, account: CareReceipient) -> CareReceipient:
        try:
            self.session.add(account)
            self.session.commit()

        except DBCreateAccountWithUsernameAlreadyExistsException:
            raise DBCreateAccountWithUsernameAlreadyExistsException
        except Exception as e:
            raise DBException(e)
        return account

    def update(self, id: int, field: str, value: Any) -> CareReceipient:
        try:
            if account := self.session.query(CareReceipient).filter_by(id=id).first():
                setattr(account, field, value)
                self.session.commit()
                self.session.refresh(account)
                return account
            raise NoRecordFoundException

        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> CareReceipient:
        try:
            if account := self.session.query(CareReceipient).filter_by(id=id).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> CareReceipient:
        try:
            if account := self.session.query(CareReceipient).filter_by(**field).first():
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
    ) -> list[CareReceipient]:
        try:
            if sort_direction == 0:
                return (
                    self.session.query(CareReceipient)
                    .filter_by(**field)
                    .order_by(desc(sort))
                    .all()
                )
            return (
                self.session.query(CareReceipient)
                .filter_by(**field)
                .order_by(asc(sort))
                .all()
            )

        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            if account := self.session.query(CareReceipient).filter_by(id=id).first():
                self.session.delete(account)
                self.session.commit()
                return
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def reset_password(self, id: int, new_password: str) -> None:
        try:
            if account := self.session.query(CareReceipient).filter_by(id=id).first():
                setattr(account, "password", new_password)
                self.session.commit()
                self.session.refresh(account)
                return
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            self.session.query(CareReceipient).delete()
            return

        except Exception as e:
            raise DBException(e)

    def reset_all_can_record_mood(self) -> None:
        # TODO: Think of a better way to
        # use this. Here might not be the best place

        for row in self.session.query(CareReceipient):
            row.update({"can_record_mood": True})
        self.session.commit()
        return


class CRUDAdmin:
    def __init__(self, session: Session):
        self.session = session

    def create(self, user: User) -> User:
        try:
            if self.session.query(User).filter_by(clerk_id=user.clerk_id).first():
                raise DBCreateAccountWithUsernameAlreadyExistsException
            self.session.add(user)
            self.session.commit()

        except DBCreateAccountWithUsernameAlreadyExistsException:
            raise DBCreateAccountWithUsernameAlreadyExistsException
        except Exception as e:
            raise DBException(e)
        return user

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
        sort_direction: int = 0,
    ) -> list[User]:
        try:
            if sort_direction == 0:
                return self.session.query(User).filter_by(**field).all()
            return self.session.query(User).filter_by(**field).all()

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


class CRUDMood:
    def __init__(self, session: Session):
        self.session = session
        self.DEFAULT_DATE_FILTER = datetime.today()

    def create(self, mood: Mood) -> Mood:
        try:
            self.session.add(mood)
            self.session.commit()
            self.session.refresh(mood)
        except Exception as e:
            raise DBException(e)
        return mood

    def get_by(self, field: dict[Any, Any], day_range: int = 30) -> list[Mood]:
        try:
            return (
                self.session.query(Mood)
                .filter_by(**field)
                .filter(Mood.created_at > datetime.today() - timedelta(days=day_range))
                .all()
            )
        except Exception as e:
            raise DBException(e)

    def get_latest(self, user_id: int, limit: int) -> list[Mood]:
        try:
            return (
                self.session.query(Mood)
                .filter_by(care_receipient_id=user_id)
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
