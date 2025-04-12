from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import Gender, AppLanguage, Race, SelectedMood


class MoodRequest(BaseModel):
    mood: SelectedMood


class MoodIn(MoodRequest):
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class MoodOut(BaseModel):
    user_id: int
    moods: list[MoodIn]
    can_record_mood: bool
    consecutive_checkins: int
    mood_message: str

    class Config:
        use_enum_values = True


class DashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardOut(BaseModel):
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

    moods: list[DashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int

    class Config:
        use_enum_values = True


class LogInRequest(BaseModel):
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


class UserCreateRequest(BaseModel):
    username: str  # Doubles as username
    password: str
    name: str
    confirm_password: str = Field(..., alias="confirmPassword")
    contact_number: int = Field(..., alias="contactNumber")
    alias: str
    age: int
    race: Race
    gender: Gender
    app_language: AppLanguage = Field(..., alias="appLanguage")
    postal_code: int = Field(..., alias="postalCode")
    floor: int

    class Config:
        use_enum_values = True


class UserUpdateRequest(UserCreateRequest):
    pass


class UserIn(UserCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)
    can_record_mood: bool = True

    class Config:
        use_enum_values = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
