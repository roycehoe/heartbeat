from contextlib import contextmanager

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Request,
    UploadFile,
    status,
)
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
from services.authenticate_user import authenticate_user
from services.create_user import (
    get_create_admin_response,
    get_create_caregiver_response,
    get_create_user_response,
)
from services.create_user_mood import get_create_user_mood_response
from services.get_user_mood import get_get_user_mood_response

Base.metadata.create_all(bind=engine)
app = FastAPI()


def get_scheduler(db: Session = Depends(get_db)):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(
        CRUDUser(db).reset_all_can_record_mood(), "cron", hour=0, minute=0
    )
    return scheduler


@app.on_event("startup")
def startup_event():
    scheduler = get_scheduler()
    scheduler.start()


@app.get("/", response_model={})
def home():
    return "home page"


@app.post(
    "/sign-up/admin",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_admin(request: AdminCreateRequest, db: Session = Depends(get_db)):
    return get_create_admin_response(request, db)


@app.post(
    "/sign-up/caregiver",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_caregiver(request: CaregiverCreateRequest, db: Session = Depends(get_db)):
    return get_create_caregiver_response(request, db)


@app.post(
    "/sign-up/user",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_user(request: UserCreateRequest, db: Session = Depends(get_db)):
    return get_create_user_response(request, db)


@app.post("/user/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def log_in(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@app.get("/user", status_code=status.HTTP_200_OK)
def dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_get_user_mood_response(token, db)


@app.post("/user", status_code=status.HTTP_201_CREATED)
def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_mood_response(request, token, db)
