from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import AgeRange, AppLanguage, Gender, Race, SelectedMood
from models.mood import Mood


class CareReceipientMoodRequest(BaseModel):
    mood: SelectedMood


class CreateCareReceipientMoodResponse(BaseModel):
    care_receipient_id: int
    moods: list[Mood]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int
    mood_message: str

    class Config:
        use_enum_values = True
        arbitrary_types_allowed = True


class CareReceipientDashboardMoodData(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class GetCareReceipientDashboardResponse(BaseModel):
    care_receipient_id: int
    name: str
    age_range: AgeRange
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: str
    app_language: AppLanguage

    moods: list[CareReceipientDashboardMoodData]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True


class CareReceipientToken(BaseModel):
    access_token: str
    token_type: str


class CareReceipientDetailMoodData(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class GetCareReceipientDetailResponse(BaseModel):
    care_receipient_id: int
    name: str
    age_range: AgeRange
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    block: str
    unit: Optional[str] = None
    contact_number: str
    is_suspended: bool
    app_language: AppLanguage

    moods: list[CareReceipientDetailMoodData]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True


class CareReceipientCreateRequest(BaseModel):
    name: str
    contact_number: str = Field(..., alias="contactNumber")
    age_range: AgeRange
    race: Race
    gender: Gender
    app_language: AppLanguage = Field(..., alias="appLanguage")
    postal_code: int = Field(..., alias="postalCode")
    floor: int
    block: str
    unit: Optional[str] = None

    class Config:
        use_enum_values = True


class CareReceipientUpdateRequest(CareReceipientCreateRequest):
    pass


class CareReceipientLoginUrlResponse(BaseModel):
    url: str


class MagicLinkVerifyRequest(BaseModel):
    token: str
