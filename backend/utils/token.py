from datetime import datetime, timedelta
from typing import Union

import requests
from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import JWTError

from exceptions import ClerkAuthenticationFailedException
from settings import AppSettings

SECRET_KEY = AppSettings.SECRET_KEY
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


def get_optional_token_data(token: str, param: str) -> Union[int, str, None]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    return payload.get(param)


CLERK_VERIFY_TOKEN_URL = "https://api.clerk.com/v1/clients/verify"

CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"
CLERK_ISSUER = "https://clerk.your-domain.com"  # <-- from Clerk Dashboard
AUTHORIZED_PARTIES = {"https://your-frontend-domain.com"}

_jwks_cache = None


def _fetch_jwks():
    global _jwks_cache
    response = requests.get(
        CLERK_JWKS_URL,
        headers={"Authorization": f"Bearer {AppSettings.CLERK_SECRET_KEY}"},
    )
    response.raise_for_status()
    _jwks_cache = response.json()
    return _jwks_cache


def _cached_jwks():
    return _jwks_cache or _fetch_jwks()


def _key_with_kid(jwks: dict, kid: Union[str, None]):
    return next((key for key in jwks["keys"] if key["kid"] == kid), None)


def _find_jwk(kid: Union[str, None]):
    key = _key_with_kid(_cached_jwks(), kid)
    if key is None:
        # Clerk may have rotated keys since we cached them, so refetch once.
        key = _key_with_kid(_fetch_jwks(), kid)
    if key is None:
        raise ClerkAuthenticationFailedException
    return key


def get_clerk_id_from_verified_clerk_token(clerk_token: str) -> str:
    try:
        kid = jwt.get_unverified_header(clerk_token).get("kid")
        key = _find_jwk(kid)
        payload = jwt.decode(
            clerk_token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise ClerkAuthenticationFailedException

    return payload.get("sub")
