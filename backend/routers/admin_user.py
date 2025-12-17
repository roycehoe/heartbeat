from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.admin_user import (
    AdminUserDashboardOut,
    UserCreateRequest,
    UserUpdateRequest,
)
from services.admin_user import (
    get_create_user_response,
    get_delete_user_response,
    get_get_user_response,
    get_suspend_user_response,
    get_unsuspend_user_response,
    get_update_user_response,
)

router = APIRouter(
    prefix="/admin/user",
    tags=["Admin user"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request: UserCreateRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return get_create_user_response(request, token, db)


@router.get(
    "/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=AdminUserDashboardOut,
)
def get_user(user_id: int, token: str = Header(None), db: Session = Depends(get_db)):
    return get_get_user_response(user_id, token, db)


@router.put(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def update_user(
    user_id: int,
    request: UserUpdateRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_update_user_response(user_id, request, token, db)


@router.put(
    "/{user_id}/suspend",
    status_code=status.HTTP_204_NO_CONTENT,
)
def suspend_user(
    user_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_suspend_user_response(user_id, token, db)


@router.put(
    "/{user_id}/unsuspend",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unsuspend_user(
    user_id: int,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return get_unsuspend_user_response(user_id, token, db)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(user_id: int, token: str = Header(None), db: Session = Depends(get_db)):
    return get_delete_user_response(user_id, token, db)
