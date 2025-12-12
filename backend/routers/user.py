from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.user import (
    UserDashboardOut,
    UserLogInRequest,
    UserMoodOut,
    UserMoodRequest,
    UserToken,
)
from services.user import (
    authenticate_user,
    get_create_user_mood_response,
    get_user_dashboard_response,
)

router = APIRouter(
    prefix="/user",
    tags=["User"],
)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=UserToken)
def user_log_in(
    user_log_in_request: UserLogInRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return authenticate_user(user_log_in_request, token, db)


@router.get(
    "/dashboard", status_code=status.HTTP_200_OK, response_model=UserDashboardOut
)
def user_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_user_dashboard_response(token, db)


@router.post("/mood", status_code=status.HTTP_201_CREATED, response_model=UserMoodOut)
def send_mood(
    request: UserMoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_mood_response(request, token, db)
