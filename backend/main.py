from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from schemas import (
    AdminCreateRequest,
    CaregiverCreateRequest,
    LogInRequest,
    Token,
    UserCreateRequest,
)
from services.authenticate_user import authenticate_user
from services.create_user import (
    get_create_admin_response,
    get_create_caregiver_response,
    get_create_user_response,
)

app = FastAPI()
Base.metadata.create_all(bind=engine)


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


@app.get("/user", status_code=status.HTTP_200_OK, response_model=Token)
def dashboard(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@app.post("/user", status_code=status.HTTP_200_OK, response_model=Token)
def send_mood(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)
