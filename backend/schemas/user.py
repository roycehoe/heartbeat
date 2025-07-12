from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, Field, StringConstraints

from enums import Gender, Race, SelectedMood


class UserMoodRequest(BaseModel):
    mood: SelectedMood


class UserMoodIn(UserMoodRequest):
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class UserMoodOut(BaseModel):
    user_id: int
    moods: list[UserMoodIn]
    can_record_mood: bool
    consecutive_checkins: int
    mood_message: str

    class Config:
        use_enum_values = True


class UserDashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class UserDashboardOut(BaseModel):
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

    moods: list[UserDashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int

    class Config:
        use_enum_values = True


class UserLogInRequest(BaseModel):
    username: Annotated[str, StringConstraints(to_lower=True)]
    password: str


class UserToken(BaseModel):
    access_token: str
    token_type: str
