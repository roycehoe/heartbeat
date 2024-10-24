from typing import Any

from passlib.context import CryptContext

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    hashed_password = password_context.hash(password)
    return hashed_password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)


def encrypt_data(data: Any):
    """Placeholder encryption function till decision on encryption is reached"""
    return data


def decrypt_data(data: Any):
    """Placeholder decryption function till decision on encryption is reached"""
    return data
