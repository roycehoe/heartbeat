from typing import Optional

from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlmodel import Field, SQLModel

from models.util import use_enum_values
from models.review import ReviewableType


class Bookmark(SQLModel, table=True):
    __tablename__ = "bookmarks"

    id: Optional[int] = Field(default=None, primary_key=True, index=True, unique=True)
    user_id: str
    target_id: int
    target_type: ReviewableType = Field(
        sa_column=Column(
            SQLAlchemyEnum(ReviewableType, values_callable=use_enum_values),
            nullable=False,
        )
    )
    title: str
    link: str
