from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from crud import CRUDMood, CRUDUser
from exceptions import DBException, NoRecordFoundException
from schemas import DashboardOut, MoodIn
from utils.token import get_token_data


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


def get_user_dashboard_response(token: str, db: Session) -> DashboardOut:
    user_id = get_token_data(token, "user_id")
    moods = CRUDMood(db).get_by({"user_id": user_id})
    user = CRUDUser(db).get(user_id)
    return DashboardOut(
        user_id=user_id,
        email=user.email,
        name=user.name,
        alias=user.alias,
        age=user.age,
        race=user.race,
        gender=user.gender,
        postal_code=user.postal_code,
        floor=user.floor,
        moods=[
            MoodIn(mood=mood.mood, user_id=mood.user_id, created_at=mood.created_at)
            for mood in moods
        ],
        contact_number=user.contact_number,
        coins=user.coins,
        tree_display_state=user.tree_display_state,
        consecutive_checkins=user.consecutive_checkins,
        claimable_gifts=user.claimable_gifts,
        can_record_mood=_can_record_mood(user_id, db),
    )


def get_admin_dashboard_response(
    token: str, db: Session, sort: str, sort_direction: int
) -> list[DashboardOut]:
    try:
        response: list[DashboardOut] = []

        admin_id = get_token_data(token, "admin_id")
        users = CRUDUser(db).get_by_all({"admin_id": admin_id}, sort, sort_direction)
        if not users:
            return []

        for user in users:
            moods = CRUDMood(db).get_by({"user_id": user.id})
            response.append(
                DashboardOut(
                    user_id=user.id,
                    email=user.email,
                    contact_number=user.contact_number,
                    name=user.name,
                    alias=user.alias,
                    age=user.age,
                    race=user.race,
                    gender=user.gender,
                    postal_code=user.postal_code,
                    floor=user.floor,
                    moods=[
                        MoodIn(
                            mood=mood.mood,
                            user_id=mood.user_id,
                            created_at=mood.created_at,
                        )
                        for mood in moods
                    ],
                    coins=user.coins,
                    tree_display_state=user.tree_display_state,
                    consecutive_checkins=user.consecutive_checkins,
                    claimable_gifts=user.claimable_gifts,
                    can_record_mood=_can_record_mood(user.id, db),
                )
            )
        return response

    except DBException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
