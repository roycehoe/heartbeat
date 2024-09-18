from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class LogInRequest(BaseModel):
    email: str  # Doubles as username
    password: str


class AccountCreateRequestBase(BaseModel):
    email: str  # Doubles as username
    password: str
    confirm_password: str


class AdminCreateRequest(AccountCreateRequestBase):
    pass


class CaregiverCreateRequest(AccountCreateRequestBase):
    admin_id: int


class UserCreateRequest(AccountCreateRequestBase):
    admin_id: int
    caregiver_id: int


class AdminIn(UserCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
