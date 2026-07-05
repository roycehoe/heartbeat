from dotenv import dotenv_values
from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy_utils import EncryptedType

from database import Base
from enums import SelectedMood

SECRET = dotenv_values(".env").get("DB_ENCRYPTION_SECRET") or ""

EncryptedType.cache_ok = True


class CareReceipient(Base):
    __tablename__ = "care_receipient"

    id = Column(Integer, primary_key=True)

    name = Column(EncryptedType(String, SECRET), nullable=False)
    contact_number = Column(
        EncryptedType(String, SECRET), nullable=False, comment="Assumes SG phone number"
    )
    alias = Column(String, nullable=False, comment="To prevent data overflow on frontend")
    app_language = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    race = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)
    block = Column(String, nullable=False)
    unit = Column(String, nullable=False)

    consecutive_checkins = Column(Integer, nullable=False)
    consecutive_non_checkins = Column(Integer, nullable=False)
    is_suspended = Column(Boolean, nullable=False, default=False)

    created_at = Column(TIMESTAMP, nullable=False)
    user_id = Column(Integer, nullable=False)
    can_record_mood = Column(Boolean, nullable=False)

    moods = relationship("Mood", back_populates="care_receipient")


class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    care_receipient_id = Column(Integer, ForeignKey("care_receipient.id"))
    mood = Column(Enum(SelectedMood))
    created_at = Column(TIMESTAMP, nullable=False)

    care_receipient = relationship("CareReceipient", back_populates="moods")
