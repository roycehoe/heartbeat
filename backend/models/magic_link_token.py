from typing import Optional

from sqlmodel import Field, SQLModel


class MagicLinkToken(SQLModel, table=True):
    __tablename__ = "magic_link_token"

    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(unique=True, index=True)
    care_receipient_id: int = Field(foreign_key="care_receipient.id")
