from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.caregiver import (
    CaregiverCreateRequest,
    CaregiverDashboardOut,
    CaregiverToken,
)
from services.caregiver import (
    authenticate_caregiver,
    get_caregiver_dashboard_response,
    get_create_caregiver_response,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_caregiver(request: CaregiverCreateRequest, db: Session = Depends(get_db)):
    return get_create_caregiver_response(request, db)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=CaregiverToken)
def caregiver_log_in(db: Session = Depends(get_db), token: str = Header(None)):
    return authenticate_caregiver(token, db)


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=list[CaregiverDashboardOut],
)
def caregiver_dashboard(
    token: str = Header(None),
    db: Session = Depends(get_db),
    sort: str = "consecutive_checkins",
    sort_direction: int = 0,
):
    return get_caregiver_dashboard_response(token, db, sort, sort_direction)
