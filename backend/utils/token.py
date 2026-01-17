from datetime import datetime, timedelta
from typing import Union

import jwt
from dotenv import dotenv_values
from fastapi import HTTPException, status
import requests

from exceptions import ClerkAuthenticationFailedException
from settings import AppSettings

config = dotenv_values(".env")
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES_10_YEARS = 60 * 24 * 365 * 10

CLERK_ALGORITHM = ["RS256"]


def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES_10_YEARS)
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
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    except AttributeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


import httpx
from fastapi import HTTPException, status

CLERK_VERIFY_TOKEN_URL = "https://api.clerk.com/v1/clients/verify"


import os
import requests
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError

CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"
CLERK_ISSUER = "https://clerk.your-domain.com"  # <-- from Clerk Dashboard
AUTHORIZED_PARTIES = {"https://your-frontend-domain.com"}

_jwks_cache = None


def _get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        _jwks_cache = requests.get(
            CLERK_JWKS_URL,
            headers={"Authorization": f"Bearer {AppSettings.CLERK_SECRET_KEY}"},
        ).json()
    return _jwks_cache


def get_clerk_id_from_verified_clerk_token(clerk_token: str) -> dict:
    jwks = _get_jwks()

    unverified_header = jwt.get_unverified_header(clerk_token)
    kid = unverified_header["kid"]

    key = next(k for k in jwks["keys"] if k["kid"] == kid)

    try:
        payload = jwt.decode(
            clerk_token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except ExpiredSignatureError:
        raise ClerkAuthenticationFailedException

    return payload.get("sub")
