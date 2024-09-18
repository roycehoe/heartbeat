from sqlalchemy.orm import Session

from crud import CRUDMood
from exceptions import (
    DBCreateUserException,
    DBCreateUserWithEmailAlreadyExistsException,
)
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_user_id


def get_get_user_mood_response(token: str, db: Session) -> list[Mood]:
    try:
        user_id = get_user_id(token)
        return CRUDMood(db).get_by({"user_id": user_id})
    except DBCreateUserException:
        raise DBCreateUserException
    except DBCreateUserWithEmailAlreadyExistsException:
        raise DBCreateUserException
    except Exception:
        raise DBCreateUserException
