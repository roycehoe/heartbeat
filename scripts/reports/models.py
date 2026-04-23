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


class Caregiver(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, comment="Primary key")

    username = Column(
        String, nullable=False, comment="User's username; doubles as username"
    )
    name = Column(EncryptedType(String, SECRET), nullable=False)
    password = Column(String, nullable=False)
    contact_number = Column(
        EncryptedType(String, SECRET), nullable=False, comment="Assumes SG phone number"
    )

    created_at = Column(TIMESTAMP, nullable=False)

    care_receipients = relationship("CareReceipient", back_populates="caregiver")  # One-to-Zero/Many


class CareReceipient(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    # CARE RECEIPIENT SIGNUP FIELDS
    username = Column(
        String, nullable=False, comment="User's username; doubles as username"
    )
    password = Column(String, nullable=False)
    name = Column(EncryptedType(String, SECRET), nullable=False)
    alias = Column(
        String, nullable=False, comment="To prevent data overflow on frontend"
    )
    app_language = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    race = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)
    contact_number = Column(
        EncryptedType(Integer, SECRET),
        nullable=False,
        comment="Assumes SG phone number",
    )

    consecutive_checkins = Column(Integer, nullable=False)
    is_suspended = Column(Boolean, nullable=False, default=False)

    created_at = Column(TIMESTAMP, nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.id"))
    can_record_mood = Column(Boolean, nullable=False)

    caregiver = relationship(
        "Caregiver", back_populates="care_receipients"
    )
    moods = relationship("Mood", back_populates="care_receipient")  # One-to-Zero/Many


class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    mood = Column(Enum(SelectedMood))
    created_at = Column(TIMESTAMP, nullable=False)

    care_receipient = relationship("CareReceipient", back_populates="moods")
