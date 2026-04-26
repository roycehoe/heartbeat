from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.care_receipient import (
    CareReceipientDetailOut,
    CareReceipientCreateRequest,
    CareReceipientDashboardOut,
    CareReceipientLogInRequest,
    CareReceipientLoginUrlResponse,
    CareReceipientMoodOut,
    CareReceipientMoodRequest,
    CareReceipientToken,
    CareReceipientUpdateRequest,
)
from services.care_receipient import (
    authenticate_care_receipient,
    get_create_care_receipient_mood_response,
    get_create_care_receipient_response,
    get_delete_care_receipient_response,
    get_care_receipient_response,
    get_care_receipient_login_url_response,
    get_suspend_care_receipient_response,
    get_unsuspend_care_receipient_response,
    get_update_care_receipient_response,
    get_care_receipient_dashboard_response,
)

router = APIRouter(
    prefix="/user",
    tags=["User"],
)


@router.post("/login", status_code=status.HTTP_200_OK, response_model=CareReceipientToken)
def care_receipient_log_in(
    care_receipient_log_in_request: CareReceipientLogInRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return authenticate_care_receipient(care_receipient_log_in_request, token, db)


@router.get(
    "/{care_receipient_id}/dashboard",
    status_code=status.HTTP_200_OK,
    response_model=CareReceipientDashboardOut,
)
def care_receipient_dashboard(
    care_receipient_id: int, db: Session = Depends(get_db)
):
    return get_care_receipient_dashboard_response(care_receipient_id, db)


@router.post(
    "/{care_receipient_id}/mood",
    status_code=status.HTTP_201_CREATED,
    response_model=CareReceipientMoodOut,
)
def send_mood(
    care_receipient_id: int,
    request: CareReceipientMoodRequest,
    db: Session = Depends(get_db),
):
    return get_create_care_receipient_mood_response(request, care_receipient_id, db)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_care_receipient(
    request: CareReceipientCreateRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_create_care_receipient_response(request, token, db)


@router.get(
    "/{care_receipient_id}/login-url",
    status_code=status.HTTP_200_OK,
    response_model=CareReceipientLoginUrlResponse,
)
def get_care_receipient_login_url(
    care_receipient_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_care_receipient_login_url_response(care_receipient_id, token, db)


@router.get(
    "/{care_receipient_id}",
    status_code=status.HTTP_200_OK,
    response_model=CareReceipientDetailOut,
)
def get_care_receipient(
    care_receipient_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_care_receipient_response(care_receipient_id, token, db)


@router.put(
    "/{care_receipient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def update_care_receipient(
    care_receipient_id: int,
    request: CareReceipientUpdateRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_update_care_receipient_response(care_receipient_id, request, token, db)


@router.put(
    "/{care_receipient_id}/suspend",
    status_code=status.HTTP_204_NO_CONTENT,
)
def suspend_care_receipient(
    care_receipient_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_suspend_care_receipient_response(care_receipient_id, token, db)


@router.put(
    "/{care_receipient_id}/unsuspend",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unsuspend_care_receipient(
    care_receipient_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_unsuspend_care_receipient_response(care_receipient_id, token, db)


@router.delete(
    "/{care_receipient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_care_receipient(
    care_receipient_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_delete_care_receipient_response(care_receipient_id, token, db)
