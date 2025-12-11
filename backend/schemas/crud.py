from datetime import datetime

from pydantic import BaseModel

from enums import Gender, Race, SelectedMood


class CRUDAdminOut(BaseModel):
    id: int
    username: str
    name: str
    password: str
    contact_number: str
    created_at: datetime

    class Config:
        from_attributes = True


class CRUDUserOut(BaseModel):
    id: int
    username: str
    password: str
    name: str
    alias: str
    app_language: str
    age: int
    race: Race
    gender: Gender
    postal_code: int
    floor: int
    block: str
    unit: str
    contact_number: int
    consecutive_checkins: int
    created_at: datetime
    admin_id: int
    can_record_mood: bool
    is_suspended: bool
    moods: list["CRUDMoodOut"]

    class Config:
        from_attributes = True


class CRUDMoodOut(BaseModel):
    id: int
    user_id: int
    mood: SelectedMood
    created_at: datetime

    class Config:
        from_attributes = True
