from sqlalchemy import (TIMESTAMP, Boolean, Column, Enum, Float, ForeignKey,
                        Integer, String)
from sqlalchemy.dialects.sqlite import JSON

from database import Base
from enums import MatchmakingFieldGroup


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, comment="User's email; doubles as username")
    password = Column(String, nullable=False)
    name = Column(String, nullable=False, comment="User's full name")
    phone_number = Column(String, nullable=True, comment="User's phone number, including country code")

    volunteering_frequency = Column(JSON, nullable=True, comment="List of volunteering frequency preferences")
    skills = Column(JSON, nullable=True, comment="List of skills")
    target_groups = Column(JSON, nullable=True, comment="List of target groups user is interested in")
    languages_spoken = Column(JSON, nullable=True, comment="List of languages spoken by the user")

    address = Column(Integer, nullable=True, comment="Address linked to the user")
    lat = Column(Float, nullable=True, comment="Latitude for user's address")
    lng = Column(Float, nullable=True, comment="Longitude for user's address")
    applied_jobs = Column(JSON, nullable=True, comment="List of applied job IDs")

    created_at = Column(TIMESTAMP, nullable=False, comment="Timestamp when the user was created")

class MatchmakingFields(Base):
    __tablename__ = 'matchmaking_fields'

    id = Column(Integer, primary_key=True, comment="Primary key")
    field_group = Column(Enum(MatchmakingFieldGroup), nullable=False)
    field_name = Column(String, nullable=False)

class Admin(Base):
    __tablename__ = 'admin'

    id = Column(Integer, primary_key=True, comment="Primary key")
    name = Column(String, nullable=False, comment="Admin organization's full name")
    description = Column(String, nullable=True, comment="Description of admin's organization")

class Job(Base):
    __tablename__ = 'job'

    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey('admin.id'), nullable=False)
    is_job_still_open = Column(Boolean, default=True, nullable=False)
    applicants = Column(JSON, nullable=True)
    successful_applicants = Column(JSON, nullable=True)
    openings = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    skills = Column(JSON, nullable=True, comment="List of required skills for the job")
    target_group = Column(JSON, nullable=True, comment="List of target groups for the job")
    volunteering_frequency = Column(JSON, nullable=True, comment="Preferred volunteer frequency for the job")
    languages_spoken = Column(JSON, nullable=True, comment="Languages preferred for the job")

    address = Column(Integer, nullable=True, comment="Job address")
    lat = Column(Float, nullable=True, comment="Latitude of the job location")
    lng = Column(Float, nullable=True, comment="Longitude of the job location")

    created_at = Column(TIMESTAMP, nullable=False, comment="Timestamp when the job was created")
