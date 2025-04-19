from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import Gender, Race, SelectedMood


class AdminLogInRequest(BaseModel):
    username: str  # Doubles as username
    password: str


class AdminCreateRequest(BaseModel):
    username: str  # Doubles as username
    password: str
    name: str
    confirm_password: str = Field(..., alias="confirmPassword")
    contact_number: int = Field(..., alias="contactNumber")


class AdminIn(AdminCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class AdminToken(BaseModel):
    access_token: str
    token_type: str


class AdminMoodRequest(BaseModel):
    mood: SelectedMood


class AdminMoodIn(AdminMoodRequest):
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class AdminDashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class AdminDashboardOut(BaseModel):
    user_id: int
    username: str
    name: str
    alias: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: int

    moods: list[AdminDashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int

    class Config:
        use_enum_values = True
