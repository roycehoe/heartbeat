from sqlalchemy import TIMESTAMP, Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base
from enums import SelectedMood


class Caregiver(Base):
    __tablename__ = "caregiver"

    id = Column(Integer, primary_key=True, comment="Primary key")
    username = Column(
        String, nullable=False, comment="User's email; doubles as username"
    )
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    users = relationship("User", back_populates="caregiver")


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, comment="Primary key")
    username = Column(
        String, nullable=False, comment="User's email; doubles as username"
    )
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    users = relationship("User", back_populates="admin")


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(
        String, nullable=False, comment="User's email; doubles as username"
    )
    password = Column(String, nullable=False)

    created_at = Column(TIMESTAMP, nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.id"))

    admin = relationship("Admin", back_populates="users")
    moods = relationship("Mood", back_populates="user")


class Mood(Base):
    __tablename__ = "mood"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    mood = Column(Enum(SelectedMood))

    user = relationship("User", back_populates="moods")
