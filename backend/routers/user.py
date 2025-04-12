from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    DashboardOut,
    LogInRequest,
    MoodOut,
    MoodRequest,
    Token,
)
from services.user import (
    authenticate_user,
    get_user_dashboard_response,
    get_create_user_mood_response,
)

router = APIRouter(
    prefix="/user",
    tags=["User"],
)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=Token)
def user_log_in(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@router.get("/dashboard", status_code=status.HTTP_200_OK, response_model=DashboardOut)
def user_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_user_dashboard_response(token, db)


@router.post("/mood", status_code=status.HTTP_201_CREATED, response_model=MoodOut)
def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_mood_response(request, token, db)
