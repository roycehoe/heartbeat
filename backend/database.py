from dotenv import dotenv_values
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = (
#     dotenv_values(".env").get("SQLALCHEMY_DATABASE_URL")
#     or "postgresql://postgres:password@localhost:5432/postgres"
# )

SQLALCHEMY_DATABASE_URL = (
    dotenv_values(".env").get("SQLALCHEMY_DATABASE_URL_STAGING")
    or "postgresql://postgres:password@localhost:5432/postgres"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
