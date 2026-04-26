from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from exceptions import (
    DBDuplicateAccountException,
    DBException,
    DBGetAccountException,
    NoRecordFoundException,
)
from models.caregiver import Caregiver
from models.care_receipient import CareReceipient
from models.magic_link_token import MagicLinkToken
from models.mood import Mood


class CRUDCareReceipient:
    def __init__(self, session: Session):
        self.session = session

    def create(self, account: CareReceipient) -> CareReceipient:
        try:
            self.session.add(account)
            self.session.commit()

        except DBDuplicateAccountException:
            raise DBDuplicateAccountException
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


class CRUDCaregiver:
    def __init__(self, session: Session):
        self.session = session

    def create(self, caregiver: Caregiver) -> Caregiver:
        try:
            if self.session.query(Caregiver).filter_by(clerk_id=caregiver.clerk_id).first():
                raise DBDuplicateAccountException
            self.session.add(caregiver)
            self.session.commit()

        except DBDuplicateAccountException:
            raise DBDuplicateAccountException
        except Exception as e:
            raise DBException(e)
        return caregiver

    def update(self, id: int, field: str, value: Any) -> Caregiver:
        try:
            if account := self.session.query(Caregiver).filter_by(id=id).first():
                setattr(account, field, value)
                self.session.commit()
                self.session.refresh(account)
                return account
            raise NoRecordFoundException

        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> Caregiver:
        try:
            if account := self.session.query(Caregiver).filter_by(id=id).first():
                return account
            raise NoRecordFoundException

        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> Caregiver:
        try:
            if account := self.session.query(Caregiver).filter_by(**field).first():
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
    ) -> list[Caregiver]:
        try:
            if sort_direction == 0:
                return self.session.query(Caregiver).filter_by(**field).all()
            return self.session.query(Caregiver).filter_by(**field).all()

        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            if account := self.session.query(Caregiver).filter_by(id=id).first():
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
            self.session.query(Caregiver).delete()
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

    def get_latest(self, care_receipient_id: int, limit: int) -> list[Mood]:
        try:
            return (
                self.session.query(Mood)
                .filter_by(care_receipient_id=care_receipient_id)
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


class CRUDMagicLinkToken:
    def __init__(self, session: Session):
        self.session = session

    def create(self, token: MagicLinkToken) -> MagicLinkToken:
        try:
            self.session.add(token)
            self.session.commit()
            self.session.refresh(token)
        except Exception as e:
            raise DBException(e)
        return token

    def get_by_token(self, token: str) -> MagicLinkToken:
        try:
            if record := self.session.query(MagicLinkToken).filter_by(token=token).first():
                return record
            raise NoRecordFoundException
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def get_by_care_receipient_id(self, care_receipient_id: int) -> MagicLinkToken | None:
        try:
            return self.session.query(MagicLinkToken).filter_by(care_receipient_id=care_receipient_id).first()
        except Exception as e:
            raise DBException(e)

    def delete_by_care_receipient_id(self, care_receipient_id: int) -> None:
        try:
            self.session.query(MagicLinkToken).filter_by(care_receipient_id=care_receipient_id).delete()
            self.session.commit()
        except Exception as e:
            raise DBException(e)
