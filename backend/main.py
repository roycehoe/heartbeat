from fastapi import Depends, FastAPI, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from routers import admin, admin_user, user

from database import Base, engine, get_db
from scripts import get_scheduler

from dotenv import dotenv_values

from services.statistics import get_statistics

IS_PROD = dotenv_values(".env").get("IS_PROD")

Base.metadata.create_all(bind=engine)
app = FastAPI(root_path="/api/" if IS_PROD else "")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    db_session = next(get_db())

    # if is_db_empty(db_session) and not IS_PROD:
    #     populate_db(db_session)
    scheduler = get_scheduler(db_session)
    scheduler.start()


@app.get(
    "/healthcheck",
    status_code=status.HTTP_200_OK,
)
def healthcheck():
    return "success"


@app.get(
    "/statistics",
    status_code=status.HTTP_200_OK,
)
def statistics(token: str = Header(None), db: Session = Depends(get_db)):
    return get_statistics(token, db)


app.include_router(admin.router)
app.include_router(user.router)
app.include_router(admin_user.router)
