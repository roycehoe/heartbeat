from datetime import datetime

from pydantic import BaseModel, Field


class AdminLogInRequest(BaseModel):
    username: str  # Doubles as username
    password: str


class AdminCreateRequest(BaseModel):
    username: str  # Doubles as username
    password: str
    name: str
    confirm_password: str = Field(..., alias="confirmPassword")
    contact_number: int = Field(..., alias="contactNumber")


class AdminIn(AdminCreateRequest):
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        use_enum_values = True
        from_attributes = True


class AdminToken(BaseModel):
    access_token: str
    token_type: str
