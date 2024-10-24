from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import SelectedMood, TreeDisplayState


class MoodRequest(BaseModel):
    mood: SelectedMood


class MoodIn(MoodRequest):
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class DashboardOut(BaseModel):
    user_id: int
    moods: list[MoodIn]
    can_record_mood: bool
    coins: int
    tree_display_state: TreeDisplayState
    claimable_gifts: int
    consecutive_checkins: int


class MoodOut(DashboardOut):
    mood_message: str


class LogInRequest(BaseModel):
    email: str  # Doubles as username
    password: str


class AccountCreateRequestBase(BaseModel):
    email: str  # Doubles as username
    password: str
    confirm_password: str
    contact_number: int


class AdminCreateRequest(AccountCreateRequestBase):
    pass


class UserCreateRequest(AccountCreateRequestBase):
    name: str
    alias: str
    age: int
    race: str
    gender: str
    postal_code: int
    floor: int
    contact_number: int


class AdminIn(AdminCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class UserIn(UserCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)
    can_record_mood: bool = True

    class Config:
        use_enum_values = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
