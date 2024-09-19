from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from enums import SelectedMood
from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
)
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_user_id

SHOULD_ALERT_CAREGIVER_CRITERION = 5


def _should_alert_caregiver(user_id: int, sent_mood: SelectedMood, db: Session) -> bool:
    if sent_mood != SelectedMood.SAD:
        return False
    try:
        previous_moods = CRUDMood(db).get_latest(
            user_id, SHOULD_ALERT_CAREGIVER_CRITERION
        )
        if len(previous_moods) < SHOULD_ALERT_CAREGIVER_CRITERION:
            return False
        for previous_mood in previous_moods:
            if previous_mood != SelectedMood.SAD:
                return False
        return True

    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUser(db).get(user_id).can_record_mood
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException


def get_create_user_mood_response(
    request: MoodRequest, token: str, db: Session
) -> None:
    try:
        user_id = get_user_id(token)
        if not _can_record_mood(user_id, db):
            raise DBCreateAccountException

        mood_in_model = MoodIn(mood=request.mood, user_id=user_id)
        db_mood_model = Mood(
            user_id=mood_in_model.user_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        CRUDMood(db).create(db_mood_model)
        CRUDUser(db).update(user_id, "can_record_mood", False)

        if _should_alert_caregiver(user_id, mood_in_model.mood, db):
            print("ALERT CAREGIVER!!!!!")  # TODO: Implement caregiver alert here

    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException
