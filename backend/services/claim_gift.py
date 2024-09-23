import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from exceptions import DBException, NoRecordFoundException
from schemas import DashboardOut, MoodIn
from utils.token import get_token_data

DEFAULT_POSSIBLE_BONUS_GIFT_COINS = (10, 50, 100, 150, 200)


def _get_bonus_gift_coins(
    possible_bonus_gift_coins: tuple[int, ...] = DEFAULT_POSSIBLE_BONUS_GIFT_COINS,
) -> int:
    return random.choice(possible_bonus_gift_coins)


def get_claim_gift_response(token: str, db: Session) -> DashboardOut:
    try:
        user_id = get_token_data(token, "user_id")
        user = CRUDUser(db).get(user_id)
        user_claimable_gifts = user.claimable_gifts
        if user_claimable_gifts == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not eligible to claim gift",
            )
        CRUDUser(db).update(user_id, "claimable_gifts", user_claimable_gifts - 1)
        CRUDUser(db).update(user_id, "coins", user.coins + _get_bonus_gift_coins())

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
            claimable_gifts=updated_user.claimable_gifts,
            can_record_mood=updated_user.can_record_mood,
        )

    except NoRecordFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user mood record found",
        )
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
