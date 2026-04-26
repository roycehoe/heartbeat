from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import Gender, Race, SelectedMood


class CaregiverLogInRequest(BaseModel):
    token: str


class CaregiverCreateRequest(BaseModel):
    clerk_id: str
    contact_number: int = Field(..., alias="contactNumber")


class CaregiverToken(BaseModel):
    access_token: str
    token_type: str


class CaregiverMoodRequest(BaseModel):
    mood: SelectedMood


class CaregiverDashboardMoodData(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class CaregiverDashboardData(BaseModel):
    care_receipient_id: int
    name: str
    alias: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: int

    moods: list[CaregiverDashboardMoodData]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True
