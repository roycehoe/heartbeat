from sqlalchemy import TIMESTAMP, Boolean, Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base
from enums import SelectedMood


class Caregiver(Base):
    __tablename__ = "caregiver"

    id = Column(Integer, primary_key=True, comment="Primary key")
    email = Column(String, nullable=False, comment="User's email; doubles as username")
    password = Column(String, nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.id"))
    created_at = Column(TIMESTAMP, nullable=False)

    admin = relationship("Admin", back_populates="caregiver")
    user = relationship(
        "User", back_populates="caregiver", uselist=False
    )  # One-to-Zero/One


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, comment="Primary key")
    email = Column(String, nullable=False, comment="User's email; doubles as username")
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    users = relationship("User", back_populates="admin")  # One-to-Zero/Many
    caregiver = relationship("Caregiver", back_populates="admin")


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, comment="User's email; doubles as username")
    password = Column(String, nullable=False)
    coins = Column(Integer, nullable=False)

    created_at = Column(TIMESTAMP, nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.id"))
    caregiver_id = Column(Integer, ForeignKey("caregiver.id"), nullable=True)
    can_record_mood = Column(Boolean, nullable=True)

    admin = relationship(
        "Admin", back_populates="users"
    )  # Many users can belong to one Admin
    caregiver = relationship(
        "Caregiver", back_populates="user", uselist=False
    )  # One-to-Zero/One
    moods = relationship("Mood", back_populates="user")  # One-to-Zero/Many


class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    mood = Column(Enum(SelectedMood))
    created_at = Column(TIMESTAMP, nullable=False)

    user = relationship("User", back_populates="moods")  # Each Mood belongs to one User
