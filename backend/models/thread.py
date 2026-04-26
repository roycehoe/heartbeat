from typing import Optional

from sqlmodel import Field, SQLModel
from sqlmodel import Relationship as SQLRelationship


class Thread(SQLModel, table=True):
    __tablename__ = "threads"

    thread_id: str = Field(primary_key=True, index=True)
    user_id: Optional[str] = Field(default=None, foreign_key="users.clerk_id")
    title: Optional[str] = None

    caregiver: Optional["Caregiver"] = SQLRelationship(back_populates="threads")
