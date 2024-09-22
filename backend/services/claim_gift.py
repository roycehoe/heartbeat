from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from enums import SelectedMood, TreeDisplayState
from exceptions import DBException, NoRecordFoundException
from models import Mood
from schemas import DashboardOut, MoodIn, MoodRequest
from utils.token import get_token_data

DEFAULT_BONUS_GIFT_COINS = 250


def get_claim_gift_response(token: str, db: Session) -> DashboardOut:
    try:
        user_id = get_token_data(token, "user_id")
        user = CRUDUser(db).get(user_id)
        if not user.can_claim_gifts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not eligible to claim gift",
            )
        CRUDUser(db).update(user_id, "can_claim_gifts", False)
        CRUDUser(db).update(user_id, "coins", user.coins + DEFAULT_BONUS_GIFT_COINS)

        updated_user = CRUDUser(db).get(user_id)
        moods = CRUDMood(db).get_by({"user_id": user_id})
        return DashboardOut(
            user_id=user_id,
            moods=[
                MoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
                for mood in moods
            ],
            coins=updated_user.coins,
            tree_display_state=updated_user.tree_display_state,
            consecutive_checkins=updated_user.consecutive_checkins,
            can_claim_gifts=updated_user.can_claim_gifts,
            can_record_mood=updated_user.can_record_mood,
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
