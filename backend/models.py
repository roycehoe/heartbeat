from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.orm import relationship

from database import Base
from enums import SelectedMood, TreeDisplayState


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, comment="Primary key")

    email = Column(String, nullable=False, comment="User's email; doubles as username")
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    contact_number = Column(Integer, nullable=False, comment="Assumes SG phone number")

    created_at = Column(TIMESTAMP, nullable=False)

    users = relationship("User", back_populates="admin")  # One-to-Zero/Many


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)

    # USER SIGNUP FIELDS
    email = Column(String, nullable=False, comment="User's email; doubles as username")
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    alias = Column(
        String, nullable=False, comment="To prevent data overflow on frontend"
    )
    age = Column(Integer, nullable=False)
    race = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    contact_number = Column(Integer, nullable=False, comment="Assumes SG phone number")

    coins = Column(Integer, nullable=False)
    tree_display_state = Column(Enum(TreeDisplayState), nullable=False)
    consecutive_checkins = Column(Integer, nullable=False)
    claimable_gifts = Column(Integer, nullable=False)

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
