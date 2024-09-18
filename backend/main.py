from fastapi import (Depends, FastAPI, HTTPException, Request, UploadFile,
                     status)
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from schemas import (Token, UserCreateRequest, UserCreateResponse,
                     UserLogInRequest)
from services.authenticate_user import authenticate_user
from services.create_user import create_user

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get("/", response_model={})
def home():
    return "home page"

@app.post("/user/create", status_code=status.HTTP_201_CREATED, response_model=UserCreateResponse)
def sign_up(user_create_request: UserCreateRequest, db: Session =
            Depends(get_db)):
    user = create_user(user_create_request, db)
    return user

@app.post("/user/log-in", status_code=status.HTTP_200_OK, response_model=Token)
def log_in(user_log_in_request: UserLogInRequest, db: Session = Depends(get_db)):
    return authenticate_user(user_log_in_request, db)
