from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlmodel import Field, SQLModel

from models.util import use_enum_values


class ReviewableType(str, Enum):
    DEMENTIA_DAY_CARE = "CARESERVICE::DEMENTIA_DAY_CARE"
    DEMENTIA_HOME_CARE = "CARESERVICE::DEMENTIA_HOME_CARE"


class ReviewSource(str, Enum):
    GOOGLE = "GOOGLE"
    IN_APP = "IN_APP"


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: Optional[int] = Field(default=None, primary_key=True, index=True, unique=True)
    review_source: ReviewSource = Field(
        sa_column=Column(SQLAlchemyEnum(ReviewSource), nullable=False)
    )
    target_id: int
    target_type: ReviewableType = Field(
        sa_column=Column(
            SQLAlchemyEnum(ReviewableType, values_callable=use_enum_values),
            nullable=False,
        )
    )
    content: Optional[str] = None
    overall_rating: int
    author_name: str
    author_id: Optional[str] = None
    google_review_id: Optional[str] = None
    google_author_url: Optional[str] = None
    google_author_photo_url: Optional[str] = None
    published_time: datetime = Field(
        sa_column=Column(DateTime, server_default=func.now(), nullable=False)
    )
