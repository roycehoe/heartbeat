from fastapi import Depends, FastAPI, Header, status
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from schemas import (
    AdminCreateRequest,
    CaregiverCreateRequest,
    DashboardOut,
    LogInRequest,
    MoodRequest,
    Token,
    UserCreateRequest,
)
from scripts import get_scheduler, populate_db
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
from services.claim_gift import get_claim_gift_response
from services.dashboard import (
    get_admin_dashboard_response,
    get_caregiver_dashboard_response,
    get_user_dashboard_response,
)
from services.mood import get_create_user_mood_response

Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.on_event("startup")
def startup_event():
    db_session = next(get_db())

    populate_db(db_session)
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
async def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return await get_create_user_mood_response(request, token, db)


@app.post("/user/claim_gift", status_code=status.HTTP_201_CREATED)
def claim_gift(token: str = Header(None), db: Session = Depends(get_db)):
    return get_claim_gift_response(token, db)
