from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, Field, StringConstraints, constr

from enums import AppLanguage, Gender, Race, SelectedMood


class AdminMoodRequest(BaseModel):
    mood: SelectedMood


class AdminMoodIn(AdminMoodRequest):
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class AdminUserDashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class AdminUserDashboardOut(BaseModel):
    user_id: int
    username: str
    name: str
    alias: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    block: str
    unit: str
    contact_number: int
    is_suspended: bool

    moods: list[AdminUserDashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int

    class Config:
        use_enum_values = True


class UserCreateRequest(BaseModel):
    name: str
    contact_number: int = Field(..., alias="contactNumber")
    alias: str
    age: int
    race: Race
    gender: Gender
    app_language: AppLanguage = Field(..., alias="appLanguage")
    postal_code: int = Field(..., alias="postalCode")
    floor: int
    block: str
    unit: str

    class Config:
        use_enum_values = True


class UserResetPasswordRequest(BaseModel):
    user_id: int


class UserUpdateRequest(UserCreateRequest):
    pass


class UserIn(UserCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)
    can_record_mood: bool = True

    class Config:
        use_enum_values = True
        from_attributes = True
