from pydantic import BaseModel, Field

from enums import AgeRange, Gender, Race, SelectedMood
from schemas.types import UtcDatetime


class CaregiverLogInRequest(BaseModel):
    token: str


class CaregiverCreateRequest(BaseModel):
    clerk_id: str
    contact_number: str = Field(..., alias="contactNumber")


class CaregiverToken(BaseModel):
    access_token: str
    token_type: str


class CaregiverMoodRequest(BaseModel):
    mood: SelectedMood


class CaregiverDashboardMoodData(BaseModel):
    mood: SelectedMood
    created_at: UtcDatetime

    class Config:
        from_attributes = True


class CaregiverDashboardData(BaseModel):
    care_receipient_id: int
    name: str
    age_range: AgeRange
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: str
    created_at: UtcDatetime

    moods: list[CaregiverDashboardMoodData]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True
