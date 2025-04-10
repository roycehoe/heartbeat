from datetime import datetime

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

    moods: list[MoodIn]
    can_record_mood: bool
    consecutive_checkins: int

    class Config:
        use_enum_values = True


class LogInRequest(BaseModel):
    username: str  # Doubles as username
    password: str


class AccountCreateRequestBase(BaseModel):
    username: str  # Doubles as username
    password: str
    name: str
    confirm_password: str = Field(..., alias="confirmPassword")
    contact_number: int = Field(..., alias="contactNumber")


class AdminCreateRequest(AccountCreateRequestBase):
    pass


class UserCreateRequest(AccountCreateRequestBase):
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


class AdminIn(AdminCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class UserIn(UserCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)
    can_record_mood: bool = True

    class Config:
        use_enum_values = True
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
