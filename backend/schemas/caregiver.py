from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, Field, StringConstraints

from enums import Gender, Race, SelectedMood


class CaregiverLogInRequest(BaseModel):
    token: str


class CaregiverCreateRequest(BaseModel):
    clerk_id: str
    contact_number: int = Field(..., alias="contactNumber")


class CaregiverIn(CaregiverCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class CaregiverToken(BaseModel):
    access_token: str
    token_type: str


class CaregiverMoodRequest(BaseModel):
    mood: SelectedMood


class CaregiverMoodIn(CaregiverMoodRequest):
    care_receipient_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class CaregiverDashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class CaregiverDashboardOut(BaseModel):
    care_receipient_id: int
    name: str
    alias: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: int

    moods: list[CaregiverDashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True
