from datetime import datetime, timedelta
from typing import Union

import jwt
from dotenv import dotenv_values
from fastapi import HTTPException, status

config = dotenv_values(".env")
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES_180_DAYS = 259200


def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES_180_DAYS)
    encoded_jwt = jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def get_token_data(token: str, param: str) -> Union[int, str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if data := payload.get(param):
            return data
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    except AttributeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
