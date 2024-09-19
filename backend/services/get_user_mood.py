from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from exceptions import (
    DBCreateAccountException,
    DBCreateAccountWithEmailAlreadyExistsException,
)
from models import Mood
from schemas import DashboardOut, MoodIn
from utils.token import get_token_data


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUser(db).get(user_id).can_record_mood
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException


def get_user_dashboard_response(token: str, db: Session) -> DashboardOut:
    try:
        user_id = get_token_data(token, "user_id")
        moods = CRUDMood(db).get_by({"user_id": user_id})
        return DashboardOut(
            user_id=user_id,
            moods=[MoodIn(**mood) for mood in moods],
            can_record_mood=_can_record_mood(user_id, db),
        )

    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException


def get_caregiver_dashboard_response(token: str, db: Session) -> DashboardOut:
    try:
        caregiver_id = get_token_data(token, "caregiver_id")
        user = CRUDUser(db).get_by({"caregiver_id": caregiver_id})
        if not user:
            raise DBCreateAccountException
        moods = CRUDMood(db).get_by({"user_id": user.id})
        return DashboardOut(
            user_id=user.id,
            moods=[MoodIn(**mood) for mood in moods],
            can_record_mood=_can_record_mood(user.id, db),
        )
    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException


def get_admin_dashboard_response(token: str, db: Session) -> list[DashboardOut]:
    try:
        response: list[DashboardOut] = []

        admin_id = get_token_data(token, "admin_id")
        users = CRUDUser(db).get_by_all({"admin_id": admin_id})
        for user in users:
            moods = CRUDMood(db).get_by({"user_id": user.id})
            response.append(
                DashboardOut(
                    user_id=user.id,
                    moods=[MoodIn(**mood) for mood in moods],
                    can_record_mood=_can_record_mood(user.id, db),
                )
            )
        return response

    except DBCreateAccountException:
        raise DBCreateAccountException
    except DBCreateAccountWithEmailAlreadyExistsException:
        raise DBCreateAccountException
    except Exception:
        raise DBCreateAccountException
