from datetime import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, Column, String
from sqlalchemy_utils import EncryptedType
from sqlmodel import Field, SQLModel
from sqlmodel import Relationship as SQLRelationship

from settings import AppSettings


class CareReceipient(SQLModel, table=True):
    __tablename__ = "care_receipient"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(
        sa_column=Column(
            EncryptedType(String, AppSettings.DB_ENCRYPTION_SECRET), nullable=False
        )
    )
    contact_number: str = Field(
        sa_column=Column(
            EncryptedType(String, AppSettings.DB_ENCRYPTION_SECRET), nullable=False
        )
    )
    alias: str
    app_language: str
    age: int
    race: str
    gender: str
    postal_code: int
    floor: int
    block: str
    unit: str
    consecutive_checkins: int
    consecutive_non_checkins: int
    is_suspended: bool = Field(default=False)
    created_at: datetime = Field(sa_column=Column(TIMESTAMP, nullable=False))
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    can_record_mood: bool

    caregiver: Optional["Caregiver"] = SQLRelationship(back_populates="care_receipients")
    moods: List["Mood"] = SQLRelationship(back_populates="care_receipient")
