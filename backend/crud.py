from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import asc, desc
from sqlmodel import Session, select

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
            self.session.refresh(account)
        except DBDuplicateAccountException:
            raise DBDuplicateAccountException
        except Exception as e:
            raise DBException(e)
        return account

    def update(self, id: int, field: str, value: Any) -> CareReceipient:
        try:
            account = self.session.exec(
                select(CareReceipient).where(CareReceipient.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            setattr(account, field, value)
            self.session.add(account)
            self.session.commit()
            self.session.refresh(account)
            return account
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> CareReceipient:
        try:
            account = self.session.exec(
                select(CareReceipient).where(CareReceipient.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            return account
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> CareReceipient:
        try:
            stmt = select(CareReceipient)
            for key, value in field.items():
                stmt = stmt.where(getattr(CareReceipient, key) == value)
            account = self.session.exec(stmt).first()
            if not account:
                raise NoRecordFoundException
            return account
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
            sort_col = getattr(CareReceipient, sort)
            order = asc(sort_col) if sort_direction else desc(sort_col)
            stmt = select(CareReceipient)
            for key, value in field.items():
                stmt = stmt.where(getattr(CareReceipient, key) == value)
            stmt = stmt.order_by(order)
            return list(self.session.exec(stmt).all())
        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            account = self.session.exec(
                select(CareReceipient).where(CareReceipient.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            self.session.delete(account)
            self.session.commit()
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            for account in self.session.exec(select(CareReceipient)).all():
                self.session.delete(account)
            self.session.commit()
        except Exception as e:
            raise DBException(e)

    def reset_all_can_record_mood(self) -> None:
        for row in self.session.exec(select(CareReceipient)).all():
            row.can_record_mood = True
        self.session.commit()


class CRUDCaregiver:
    def __init__(self, session: Session):
        self.session = session

    def create(self, caregiver: Caregiver) -> Caregiver:
        try:
            if self.session.exec(
                select(Caregiver).where(Caregiver.clerk_id == caregiver.clerk_id)
            ).first():
                raise DBDuplicateAccountException
            self.session.add(caregiver)
            self.session.commit()
            self.session.refresh(caregiver)
        except DBDuplicateAccountException:
            raise DBDuplicateAccountException
        except Exception as e:
            raise DBException(e)
        return caregiver

    def update(self, id: int, field: str, value: Any) -> Caregiver:
        try:
            account = self.session.exec(
                select(Caregiver).where(Caregiver.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            setattr(account, field, value)
            self.session.add(account)
            self.session.commit()
            self.session.refresh(account)
            return account
        except Exception:
            raise DBGetAccountException

    def get(self, id: int) -> Caregiver:
        try:
            account = self.session.exec(
                select(Caregiver).where(Caregiver.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            return account
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception:
            raise DBGetAccountException

    def get_by(self, field: dict[Any, Any]) -> Caregiver:
        try:
            stmt = select(Caregiver)
            for key, value in field.items():
                stmt = stmt.where(getattr(Caregiver, key) == value)
            account = self.session.exec(stmt).first()
            if not account:
                raise NoRecordFoundException
            return account
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
            stmt = select(Caregiver)
            for key, value in field.items():
                stmt = stmt.where(getattr(Caregiver, key) == value)
            return list(self.session.exec(stmt).all())
        except Exception as e:
            raise DBException(e)

    def delete(self, id: int) -> None:
        try:
            account = self.session.exec(
                select(Caregiver).where(Caregiver.id == id)
            ).first()
            if not account:
                raise NoRecordFoundException
            self.session.delete(account)
            self.session.commit()
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def delete_all(self) -> None:
        try:
            for account in self.session.exec(select(Caregiver)).all():
                self.session.delete(account)
            self.session.commit()
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

    def get_by(self, field: dict[Any, Any], day_range: int = 30) -> list[Mood]:
        try:
            cutoff = datetime.today() - timedelta(days=day_range)
            stmt = select(Mood)
            for key, value in field.items():
                stmt = stmt.where(getattr(Mood, key) == value)
            stmt = stmt.where(Mood.created_at > cutoff)
            return list(self.session.exec(stmt).all())
        except Exception as e:
            raise DBException(e)

    def get_latest(self, care_receipient_id: int, limit: int) -> list[Mood]:
        try:
            return list(
                self.session.exec(
                    select(Mood)
                    .where(Mood.care_receipient_id == care_receipient_id)
                    .order_by(Mood.created_at.desc())
                    .limit(limit)
                ).all()
            )
        except Exception as e:
            raise DBException(e)

    def get_all(self) -> list[Mood]:
        try:
            return list(self.session.exec(select(Mood)).all())
        except Exception:
            raise DBGetAccountException

    def delete_all(self) -> None:
        try:
            for mood in self.session.exec(select(Mood)).all():
                self.session.delete(mood)
            self.session.commit()
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
            record = self.session.exec(
                select(MagicLinkToken).where(MagicLinkToken.token == token)
            ).first()
            if not record:
                raise NoRecordFoundException
            return record
        except NoRecordFoundException:
            raise NoRecordFoundException
        except Exception as e:
            raise DBException(e)

    def get_by_care_receipient_id(
        self, care_receipient_id: int
    ) -> MagicLinkToken | None:
        try:
            return self.session.exec(
                select(MagicLinkToken).where(
                    MagicLinkToken.care_receipient_id == care_receipient_id
                )
            ).first()
        except Exception as e:
            raise DBException(e)

    def delete_by_care_receipient_id(self, care_receipient_id: int) -> None:
        try:
            for token in self.session.exec(
                select(MagicLinkToken).where(
                    MagicLinkToken.care_receipient_id == care_receipient_id
                )
            ).all():
                self.session.delete(token)
            self.session.commit()
        except Exception as e:
            raise DBException(e)
