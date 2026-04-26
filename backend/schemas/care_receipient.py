from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, Field, StringConstraints

from enums import AppLanguage, Gender, Race, SelectedMood


class CareReceipientMoodRequest(BaseModel):
    mood: SelectedMood


class CareReceipientMoodIn(CareReceipientMoodRequest):
    care_receipient_id: int
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class CareReceipientMoodOut(BaseModel):
    care_receipient_id: int
    moods: list[CareReceipientMoodIn]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int
    mood_message: str

    class Config:
        use_enum_values = True


class CareReceipientDashboardMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class CareReceipientDashboardOut(BaseModel):
    care_receipient_id: int
    name: str
    alias: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    contact_number: int

    moods: list[CareReceipientDashboardMoodOut]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True


class CareReceipientLogInRequest(BaseModel):
    care_receipient_id: int


class CareReceipientToken(BaseModel):
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


class CareReceipientDetailMoodOut(BaseModel):
    mood: Optional[SelectedMood]
    created_at: datetime

    class Config:
        from_attributes = True


class CareReceipientDetailOut(BaseModel):
    care_receipient_id: int
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

    moods: list[CareReceipientDetailMoodOut]
    can_record_mood: bool
    consecutive_checkins: int
    consecutive_non_checkins: int

    class Config:
        use_enum_values = True


class CareReceipientCreateRequest(BaseModel):
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


class CareReceipientUpdateRequest(CareReceipientCreateRequest):
    pass


class CareReceipientIn(CareReceipientCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)
    can_record_mood: bool = True

    class Config:
        use_enum_values = True
        from_attributes = True


class CareReceipientLoginUrlResponse(BaseModel):
    url: str
