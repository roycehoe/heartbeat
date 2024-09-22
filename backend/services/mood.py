from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from enums import SelectedMood
from exceptions import DBException, NoRecordFoundException
from models import Mood
from schemas import MoodIn, MoodRequest
from utils.token import get_token_data

SHOULD_ALERT_CAREGIVER_CRITERION = 5
DEFAULT_COINS_INCREASE_ON_MOOD_RECORDED = 10


def _should_alert_caregiver(user_id: int, db: Session) -> bool:
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

    except DBException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


def _can_record_mood(user_id: int, db: Session) -> bool:
    try:
        return CRUDUser(db).get(user_id).can_record_mood
    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


def _is_eligible_for_bonus_coins(user_id: int, db: Session) -> bool: ...


# user_moods = CRUDMood(db).get_latest(user_id, 30)


def get_create_user_mood_response(
    request: MoodRequest, token: str, db: Session
) -> None:
    try:
        user_id = get_token_data(token, "user_id")
        if not _can_record_mood(user_id, db):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Mood for today has already been recorded. Please try again tomorrow",
            )

        mood_in_model = MoodIn(mood=request.mood, user_id=user_id)
        db_mood_model = Mood(
            user_id=mood_in_model.user_id,
            mood=mood_in_model.mood,
            created_at=mood_in_model.created_at,
        )
        CRUDMood(db).create(db_mood_model)
        CRUDUser(db).update(user_id, "can_record_mood", False)

        user_coins = CRUDUser(db).get(user_id).coins
        CRUDUser(db).update(
            user_id, "coins", user_coins + DEFAULT_COINS_INCREASE_ON_MOOD_RECORDED
        )

        if _should_alert_caregiver(user_id, db):
            print("ALERT CAREGIVER!!!!!")  # TODO: Implement caregiver alert here

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
