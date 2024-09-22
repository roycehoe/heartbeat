import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import Depends, FastAPI, Header, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from database import Base, engine, get_db
from models import Mood
from schemas import (
    AdminCreateRequest,
    CaregiverCreateRequest,
    DashboardOut,
    LogInRequest,
    MoodRequest,
    Token,
    UserCreateRequest,
)
from scripts import generate_mood_data_compliant_user
from services.account import (
    get_create_admin_response,
    get_create_caregiver_response,
    get_create_user_response,
)
from services.authentication import (
    authenticate_admin,
    authenticate_caregiver,
    authenticate_user,
)
from services.dashboard import (
    get_admin_dashboard_response,
    get_caregiver_dashboard_response,
    get_user_dashboard_response,
)
from services.mood import get_create_user_mood_response

Base.metadata.create_all(bind=engine)
app = FastAPI()


def get_scheduler(db: Session):
    scheduler = BackgroundScheduler(timezone=pytz.timezone("Asia/Singapore"))
    scheduler.add_job(CRUDUser(db).reset_all_can_record_mood, "cron", hour=0, minute=0)
    return scheduler


def load_dummy_mood_data(db: Session):
    compliant_user = generate_mood_data_compliant_user()
    for mood_data in compliant_user:
        CRUDMood(db).create(Mood(**mood_data))


@app.on_event("startup")
def startup_event():
    db_session = next(get_db())
    load_dummy_mood_data(db_session)
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


@app.get(
    "/admin/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=list[DashboardOut],
)
def admin_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_admin_dashboard_response(token, db)


###################################
# CAREGIVER
###################################


@app.post(
    "/caregiver/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def caregiver_sign_up(request: CaregiverCreateRequest, db: Session = Depends(get_db)):
    return get_create_caregiver_response(request, db)


@app.post("/caregiver/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def caregiver_log_in(request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_caregiver(request, db)


@app.get(
    "/caregiver/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=DashboardOut,
)
def caregiver_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_caregiver_dashboard_response(token, db)


###################################
# USER
###################################


@app.post(
    "/user/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def user_sign_up(request: UserCreateRequest, db: Session = Depends(get_db)):
    return get_create_user_response(request, db)


@app.post("/user/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def user_log_in(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@app.get("/user/dashboard", status_code=status.HTTP_200_OK, response_model=DashboardOut)
def user_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_user_dashboard_response(token, db)


@app.post("/user", status_code=status.HTTP_201_CREATED)
def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_mood_response(request, token, db)
