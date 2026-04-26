from models.base import Base
from sqlalchemy import Column, ForeignKey, Integer, String


class MagicLinkToken(Base):
    __tablename__ = "magic_link_token"

    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, nullable=False, index=True)
    care_receipient_id = Column(Integer, ForeignKey("care_receipient.id"), nullable=False)
