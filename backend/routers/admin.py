from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas_archive import (
    AdminCreateRequest,
    DashboardOut,
    LogInRequest,
    Token,
)
from services.admin import (
    authenticate_admin,
    get_admin_dashboard_response,
    get_create_admin_response,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_admin(request: AdminCreateRequest, db: Session = Depends(get_db)):
    return get_create_admin_response(request, db)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=Token)
def admin_log_in(request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_admin(request, db)


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=list[DashboardOut],
)
def admin_dashboard(
    token: str = Header(None),
    db: Session = Depends(get_db),
    sort: str = "consecutive_checkins",
    sort_direction: int = 0,
):
    return get_admin_dashboard_response(token, db, sort, sort_direction)
