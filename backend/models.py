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


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True)
    clerk_id = Column(String, unique=True, primary_key=True, nullable=False)
    contact_number = Column(
        EncryptedType(String, SECRET), nullable=True, comment="Assumes SG phone number"
    )

    created_at = Column(TIMESTAMP, nullable=False)

    users = relationship("User", back_populates="admin")  # One-to-Zero/Many


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    # USER SIGNUP FIELDS
    name = Column(EncryptedType(String, SECRET), nullable=False)
    contact_number = Column(
        EncryptedType(Integer, SECRET),
        nullable=False,
        comment="Assumes SG phone number",
    )
    alias = Column(
        String, nullable=False, comment="To prevent data overflow on frontend"
    )
    app_language = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    race = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)
    block = Column(String, nullable=False)
    unit = Column(String, nullable=False)

    consecutive_checkins = Column(Integer, nullable=False)
    is_suspended = Column(Boolean, nullable=False, default=False)

    created_at = Column(TIMESTAMP, nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.id"))
    can_record_mood = Column(Boolean, nullable=False)

    admin = relationship(
        "Admin", back_populates="users"
    )  # Many users can belong to one Admin
    moods = relationship("Mood", back_populates="user")  # One-to-Zero/Many


class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    mood = Column(Enum(SelectedMood))
    created_at = Column(TIMESTAMP, nullable=False)

    user = relationship("User", back_populates="moods")  # Each Mood belongs to one User
