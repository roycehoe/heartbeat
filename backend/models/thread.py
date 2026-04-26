from sqlalchemy import String, Column, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Thread(Base):
    __tablename__ = "threads"
    thread_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"))
    title = Column(String)

    caregiver = relationship("Caregiver", back_populates="threads")
