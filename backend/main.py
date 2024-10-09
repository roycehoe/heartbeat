from fastapi import Depends, FastAPI, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from schemas import (AdminCreateRequest, DashboardOut, LogInRequest, MoodOut,
                     MoodRequest, Token, UserCreateRequest)
from scripts import get_scheduler, is_db_empty, populate_db, repopulate_db
from services.account import (get_create_admin_response,
                              get_create_user_response)
from services.authentication import authenticate_admin, authenticate_user
from services.claim_gift import get_claim_gift_response
from services.dashboard import (get_admin_dashboard_response,
                                get_user_dashboard_response)
from services.mood import get_create_user_mood_response

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    db_session = next(get_db())

    if is_db_empty(db_session):
        populate_db(db_session)
    scheduler = get_scheduler(db_session)
    scheduler.start()


###################################
# ADMIN
###################################


@app.get(
    "/healthcheck",
    status_code=status.HTTP_200_OK,
)
def healthcheck():
    return "success"


@app.post(
    "/admin/sign-up",
    status_code=status.HTTP_201_CREATED,
)
def sign_up_admin(request: AdminCreateRequest, db: Session = Depends(get_db)):
    return get_create_admin_response(request, db)


@app.post("/admin/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def admin_log_in(request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_admin(request, db)


###################################
# ADMIN USER ACTIONS
###################################

@app.post(
    "/admin/user/create",
    status_code=status.HTTP_201_CREATED,
)
def create_user( request: UserCreateRequest, token: str = Header(None), db: Session = Depends(get_db)):
    return get_create_user_response(request, token, db)

@app.post(
    "/admin/user/get",
    status_code=status.HTTP_200_OK,
)
def get_user( request: UserCreateRequest, token: str = Header(None), db: Session = Depends(get_db)):
    return "success"

@app.put(
    "/admin/user/update",
    status_code=status.HTTP_204_NO_CONTENT,
)
def update_user(request: UserCreateRequest, token: str = Header(None), db: Session = Depends(get_db)):
    return "success"

@app.delete(
    "/admin/user/delete",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(request: UserCreateRequest, token: str = Header(None), db: Session = Depends(get_db)):
    return "success"

@app.get(
    "/admin/get_all",
    status_code=status.HTTP_200_OK,
    response_model=list[DashboardOut],
)
def admin_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_admin_dashboard_response(token, db)


###################################
# USER
###################################


@app.post("/user/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def user_log_in(user_log_in_request: LogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)


@app.get("/user/dashboard", status_code=status.HTTP_200_OK, response_model=DashboardOut)
def user_dashboard(token: str = Header(None), db: Session = Depends(get_db)):
    return get_user_dashboard_response(token, db)


@app.post("/user/mood", status_code=status.HTTP_201_CREATED, response_model=MoodOut)
async def send_mood(
    request: MoodRequest, token: str = Header(None), db: Session = Depends(get_db)
):
    return await get_create_user_mood_response(request, token, db)


@app.get(
    "/user/claim_gift", status_code=status.HTTP_201_CREATED, response_model=DashboardOut
)
def claim_gift(token: str = Header(None), db: Session = Depends(get_db)):
    return get_claim_gift_response(token, db)


@app.get("/reset_db", status_code=status.HTTP_200_OK)
def reset_db(db: Session = Depends(get_db)):
    repopulate_db(db)
