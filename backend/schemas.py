from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from enums import Skills, TargetGroup, VolunteeringFrequency


class UserLogInRequest(BaseModel):
    email: str # Doubles as username
    password: str


class UserCreateRequest(BaseModel):
    email: str # Doubles as username
    password: str
    name: str

    phone_number: Optional[str] = None
    volunteering_frequency: list[VolunteeringFrequency] = []
    skills: list[Skills] = []
    target_groups: list[TargetGroup] = []
    languages_spoken: list[str] = []

    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class UserCreateResponse(BaseModel):
    email: str
    name: str

    phone_number: Optional[str] = None
    dob: Optional[datetime] = None
    volunteering_frequency: list[VolunteeringFrequency] = []
    skills: list[Skills] = []
    target_groups: list[TargetGroup] = []
    languages_spoken: list[str] = []

    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class UserIn(UserCreateRequest):
    applied_jobs: list[int] = []
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
