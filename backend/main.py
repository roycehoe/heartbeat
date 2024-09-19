from contextlib import contextmanager

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import Depends, FastAPI, Header, status
from sqlalchemy.orm import Session

from crud import CRUDUser
from database import Base, engine, get_db
from schemas import (
    AdminCreateRequest,
    CaregiverCreateRequest,
    LogInRequest,
    MoodRequest,
    Token,
    UserCreateRequest,
)
from services.authenticate_user import (
    authenticate_admin,
    authenticate_caregiver,
    authenticate_user,
)
from services.create_user import (
    get_create_admin_response,
    get_create_caregiver_response,
    get_create_user_response,
)
from services.create_user_mood import get_create_user_mood_response
from services.get_user_mood import get_user_dashboard_response

Base.metadata.create_all(bind=engine)
app = FastAPI()


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(
        CRUDUser(db).reset_all_can_record_mood(), "cron", hour=0, minute=0
    )
    return scheduler


@app.on_event("startup")
def startup_event():
    db_session = next(get_db())
    scheduler = get_scheduler(db_session)
    scheduler.start()


###################################
# ADMIN
###################################


@app.post(
    "/admin/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_admin(request: AdminCreateRequest, db: Session = Depends(get_db)):
    return get_create_admin_response(request, db)


@app.post("/admin/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def admin_log_in(request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_admin(request, db)


###################################
# CAREGIVER
###################################


@app.post(
    "/caregiver/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_caregiver(request: CaregiverCreateRequest, db: Session = Depends(get_db)):
    return get_create_caregiver_response(request, db)


@app.post("/caregiver/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def caregiver_log_in(request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_caregiver(request, db)


###################################
# USER
###################################


@app.post(
    "/user/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_user(request: UserCreateRequest, db: Session = Depends(get_db)):
    return get_create_user_response(request, db)


@app.post("/user/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def user_log_in(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@app.get("/user/dashboard", status_code=status.HTTP_200_OK)
def dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_user_dashboard_response(token, db)


@app.post("/user", status_code=status.HTTP_201_CREATED)
def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_mood_response(request, token, db)
