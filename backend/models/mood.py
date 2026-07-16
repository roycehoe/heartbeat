from datetime import datetime
from typing import Optional

from sqlalchemy import TIMESTAMP, Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlmodel import Field, SQLModel
from sqlmodel import Relationship as SQLRelationship

from enums import SelectedMood


class Mood(SQLModel, table=True):
    __tablename__ = "mood"

    id: Optional[int] = Field(default=None, primary_key=True)
    care_receipient_id: Optional[int] = Field(
        default=None, foreign_key="care_receipient.id"
    )
    mood: Optional[SelectedMood] = Field(
        default=None,
        sa_column=Column(SQLAlchemyEnum(SelectedMood), nullable=True),
    )
    created_at: datetime = Field(sa_column=Column(TIMESTAMP, nullable=False))

    care_receipient: Optional["CareReceipient"] = SQLRelationship(
        back_populates="moods"
    )
