from enum import Enum
from typing import List, Optional

from sqlalchemy import Column, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy_utils import EncryptedType
from sqlmodel import Field, SQLModel
from sqlmodel import Relationship as SQLRelationship

from settings import AppSettings


class Citizenship(Enum):
    CITIZEN = "CITIZEN"
    PR = "PR"
    OTHER = "OTHER"


class Residence(Enum):
    HOME = "HOME"
    NURSING_HOME_LTCF = "NURSING_HOME_LTCF"
    OTHER = "OTHER"


class Relationship(Enum):
    PARENT = "PARENT"
    SPOUSE = "SPOUSE"
    OTHER_FAMILY = "OTHER_FAMILY"
    NON_FAMILY = "NON_FAMILY"


class Caregiver(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    clerk_id: Optional[str] = Field(default=None, unique=True, index=True)
    citizenship: Optional[Citizenship] = Field(
        default=None,
        sa_column=Column(SQLAlchemyEnum(Citizenship), nullable=True),
    )
    contact_number: Optional[str] = Field(
        default=None,
        sa_column=Column(
            EncryptedType(String, AppSettings.DB_ENCRYPTION_SECRET), nullable=True
        ),
    )
    care_recipient_age: Optional[int] = Field(default=None)
    care_recipient_citizenship: Optional[Citizenship] = Field(
        default=None,
        sa_column=Column(SQLAlchemyEnum(Citizenship), nullable=True),
    )
    care_recipient_residence: Optional[Residence] = Field(
        default=None,
        sa_column=Column(SQLAlchemyEnum(Residence), nullable=True),
    )
    care_recipient_relationship: Optional[Relationship] = Field(
        default=None,
        sa_column=Column(SQLAlchemyEnum(Relationship), nullable=True),
    )
    household_size: Optional[int] = Field(default=None)
    total_monthly_household_income: Optional[int] = Field(default=None)
    annual_property_value: Optional[int] = Field(default=None)
    monthly_pchi: Optional[int] = Field(default=None)

    threads: List["Thread"] = SQLRelationship(back_populates="caregiver")
    care_receipients: List["CareReceipient"] = SQLRelationship(back_populates="caregiver")
