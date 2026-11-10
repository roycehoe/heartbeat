from fastapi import APIRouter, Depends, Header, status
from sqlmodel import Session

from database import get_db
from schemas.caregiver import (
    CaregiverDashboardData,
    CaregiverToken,
)
from services.caregiver import (
    authenticate_caregiver,
    get_caregiver_dashboard_response,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=CaregiverToken)
def caregiver_log_in(db: Session = Depends(get_db), token: str = Header(None)):
    return authenticate_caregiver(token, db)


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=list[CaregiverDashboardData],
)
def caregiver_dashboard(
    token: str = Header(None),
    db: Session = Depends(get_db),
    sort: str = "consecutive_checkins",
    sort_direction: int = 0,
):
    return get_caregiver_dashboard_response(token, db, sort, sort_direction)
