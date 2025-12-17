from dotenv import dotenv_values
from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser
from utils.token import get_token_data

SUPERADMIN_CLERK_ID = dotenv_values(".env").get("SUPERADMIN_CLERK_ID") or ""


def is_super_admin(
    token: str, db: Session, superadmin_clerk_id: str = SUPERADMIN_CLERK_ID
):
    admin_id = get_token_data(token, "admin_id")
    admin = CRUDAdmin(db).get_by(admin_id)

    return str(admin.clerk_id) == superadmin_clerk_id


def get_statistics(token: str, db: Session):
    if not is_super_admin(token, db):
        return []

    statistics = []
    all_admins = [i.__dict__ for i in CRUDAdmin(db).get_by_all({})]
    for admin in all_admins:
        statistics.append(admin)

    for admin in statistics:
        users = [i.__dict__ for i in CRUDUser(db).get_by_all({"user_id": admin["id"]})]
        admin["users"] = users
        for user in users:
            user_mood = [
                CRUDMood(db).get_by({"care_receipient_id": user["id"]})
                for user in users
            ][0]
            user["mood"] = [i.__dict__ for i in user_mood]

    return statistics
