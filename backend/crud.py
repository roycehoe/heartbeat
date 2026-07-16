from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import asc, desc
from sqlmodel import Session, select

from exceptions import DBDuplicateAccountException
from models.caregiver import Caregiver
from models.care_receipient import CareReceipient
from models.magic_link_token import MagicLinkToken
from models.mood import Mood


class CRUDCareReceipient:
    def __init__(self, session: Session):
        self.session = session

    def create(self, account: CareReceipient) -> CareReceipient:
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def get(self, id: int) -> CareReceipient | None:
        return self.session.exec(
            select(CareReceipient).where(CareReceipient.id == id)
        ).first()

    def get_by(self, field: dict[Any, Any]) -> CareReceipient | None:
        stmt = select(CareReceipient)
        for key, value in field.items():
            stmt = stmt.where(getattr(CareReceipient, key) == value)
        return self.session.exec(stmt).first()

    def get_by_all(
        self,
        field: dict[Any, Any],
        sort: str = "consecutive_checkins",
        sort_direction: int = 0,
    ) -> list[CareReceipient]:
        sort_col = getattr(CareReceipient, sort)
        order = asc(sort_col) if sort_direction else desc(sort_col)
        stmt = select(CareReceipient)
        for key, value in field.items():
            stmt = stmt.where(getattr(CareReceipient, key) == value)
        stmt = stmt.order_by(order)
        return list(self.session.exec(stmt).all())

    def delete(self, account: CareReceipient) -> None:
        self.session.delete(account)
        self.session.commit()

    def delete_all(self) -> None:
        for account in self.session.exec(select(CareReceipient)).all():
            self.session.delete(account)
        self.session.commit()

    def suspend(self, account: CareReceipient) -> CareReceipient:
        account.is_suspended = True
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def unsuspend(self, account: CareReceipient) -> CareReceipient:
        account.is_suspended = False
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def mark_mood_recorded(self, account: CareReceipient) -> CareReceipient:
        account.can_record_mood = False
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def reset_can_record_mood(self, account: CareReceipient) -> CareReceipient:
        account.can_record_mood = True
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def increment_consecutive_checkins(self, account: CareReceipient) -> CareReceipient:
        account.consecutive_checkins += 1
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def reset_consecutive_checkins(self, account: CareReceipient) -> CareReceipient:
        account.consecutive_checkins = 0
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def increment_consecutive_non_checkins(
        self, account: CareReceipient
    ) -> CareReceipient:
        account.consecutive_non_checkins += 1
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def reset_consecutive_non_checkins(self, account: CareReceipient) -> CareReceipient:
        account.consecutive_non_checkins = 0
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def update_profile(self, account: CareReceipient, fields: dict) -> CareReceipient:
        for key, value in fields.items():
            setattr(account, key, value)
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account


class CRUDCaregiver:
    def __init__(self, session: Session):
        self.session = session

    def create(self, caregiver: Caregiver) -> Caregiver:
        if self.session.exec(
            select(Caregiver).where(Caregiver.clerk_id == caregiver.clerk_id)
        ).first():
            raise DBDuplicateAccountException
        self.session.add(caregiver)
        self.session.commit()
        self.session.refresh(caregiver)
        return caregiver

    def get(self, id: int) -> Caregiver | None:
        return self.session.exec(
            select(Caregiver).where(Caregiver.id == id)
        ).first()

    def get_by(self, field: dict[Any, Any]) -> Caregiver | None:
        stmt = select(Caregiver)
        for key, value in field.items():
            stmt = stmt.where(getattr(Caregiver, key) == value)
        return self.session.exec(stmt).first()

    def get_by_all(
        self,
        field: dict[Any, Any],
        sort_direction: int = 0,
    ) -> list[Caregiver]:
        stmt = select(Caregiver)
        for key, value in field.items():
            stmt = stmt.where(getattr(Caregiver, key) == value)
        return list(self.session.exec(stmt).all())

    def delete(self, account: Caregiver) -> None:
        self.session.delete(account)
        self.session.commit()

    def delete_all(self) -> None:
        for account in self.session.exec(select(Caregiver)).all():
            self.session.delete(account)
        self.session.commit()


class CRUDMood:
    def __init__(self, session: Session):
        self.session = session

    def create(self, mood: Mood) -> Mood:
        self.session.add(mood)
        self.session.commit()
        self.session.refresh(mood)
        return mood

    def get_by(self, field: dict[Any, Any], day_range: int = 30) -> list[Mood]:
        cutoff = datetime.today() - timedelta(days=day_range)
        stmt = select(Mood)
        for key, value in field.items():
            stmt = stmt.where(getattr(Mood, key) == value)
        stmt = stmt.where(Mood.created_at > cutoff)
        return list(self.session.exec(stmt).all())

    def get_latest(self, care_receipient_id: int, limit: int) -> list[Mood]:
        return list(
            self.session.exec(
                select(Mood)
                .where(Mood.care_receipient_id == care_receipient_id)
                .order_by(Mood.created_at.desc())
                .limit(limit)
            ).all()
        )

    def get_all(self) -> list[Mood]:
        return list(self.session.exec(select(Mood)).all())

    def delete_all(self) -> None:
        for mood in self.session.exec(select(Mood)).all():
            self.session.delete(mood)
        self.session.commit()


class CRUDMagicLinkToken:
    def __init__(self, session: Session):
        self.session = session

    def create(self, token: MagicLinkToken) -> MagicLinkToken:
        self.session.add(token)
        self.session.commit()
        self.session.refresh(token)
        return token

    def get_by_token(self, token: str) -> MagicLinkToken | None:
        return self.session.exec(
            select(MagicLinkToken).where(MagicLinkToken.token == token)
        ).first()

    def get_by_id(self, magic_link_token_id: int) -> MagicLinkToken | None:
        return self.session.get(MagicLinkToken, magic_link_token_id)

    def get_by_care_receipient_id(
        self, care_receipient_id: int
    ) -> MagicLinkToken | None:
        return self.session.exec(
            select(MagicLinkToken).where(
                MagicLinkToken.care_receipient_id == care_receipient_id
            )
        ).first()

    def delete_by_care_receipient_id(self, care_receipient_id: int) -> None:
        for token in self.session.exec(
            select(MagicLinkToken).where(
                MagicLinkToken.care_receipient_id == care_receipient_id
            )
        ).all():
            self.session.delete(token)
        self.session.commit()
