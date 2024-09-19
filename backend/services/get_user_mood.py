from sqlalchemy.orm import Session

from crud import CRUDMood
from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
)
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_user_id


def get_user_dashboard_response(token: str, db: Session) -> list[Mood]:
    try:
        user_id = get_user_id(token)
        return CRUDMood(db).get_by({"user_id": user_id})
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException
