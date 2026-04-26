from sqlmodel import Session, create_engine

from settings import AppSettings

engine = create_engine(AppSettings.SQLALCHEMY_DATABASE_URL_STAGING)


def get_db():
    with Session(engine) as session:
        yield session
