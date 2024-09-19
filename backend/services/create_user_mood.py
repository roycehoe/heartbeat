from sqlalchemy.orm import Session

from crud import CRUDMood
from exceptions import (
    DBCreateAccountException,
    DBCreateUserWithEmailAlreadyExistsException,
)
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_user_id


def get_create_user_mood_response(
    request: MoodRequest, token: str, db: Session
) -> None:
    try:
        user_id = get_user_id(token)
        mood_in_model = MoodIn(mood=request.mood, user_id=user_id)
        db_mood_model = Mood(
            user_id=mood_in_model.user_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        if new_mood := CRUDMood(db).create(db_mood_model):
            return None
        raise DBCreateAccountException
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateUserWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException
