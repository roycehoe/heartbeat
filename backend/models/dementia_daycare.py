from typing import List, Optional

from sqlalchemy import ARRAY, Column, String
from sqlmodel import Field, SQLModel


class DementiaDaycare(SQLModel, table=True):
    __tablename__ = "dementia_daycare"

    id: Optional[int] = Field(default=None, primary_key=True, index=True, unique=True)
    friendly_id: str = Field(unique=True)
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    lat: float
    lng: float
    operating_hours: List[str] = Field(sa_column=Column(ARRAY(String)))
    building_name: Optional[str] = None
    block: Optional[str] = None
    postal_code: str
    street_name: Optional[str] = None
    unit_no: Optional[str] = None
    availability: Optional[str] = None
    google_map_place_id: Optional[str] = None
    photos: List[str] = Field(sa_column=Column(ARRAY(String)))
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    description: Optional[str] = None
