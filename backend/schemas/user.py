from datetime import datetime

from pydantic import BaseModel, Field

from enums import AppLanguage, Gender, Race


class LogInRequest(BaseModel):
    username: str  # Doubles as username
    password: str


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
