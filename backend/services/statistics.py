from sqlalchemy.orm import Session

from backend.utils.token import get_token_data
from crud import CRUDAdmin, CRUDMood, CRUDUser

SUPER_ADMIN_NAME = "admin"


def is_super_admin(token: str, db: Session, super_admin_name: str = SUPER_ADMIN_NAME):
    admin_id = get_token_data(token, "admin_id")
    admin = CRUDAdmin(db).get(admin_id)

    return str(admin.name) == super_admin_name


def get_statistics(token: str, db: Session):
    if not is_super_admin(token, db):
        return []

    statistics = []
    all_admins = [i.__dict__ for i in CRUDAdmin(db).get_by_all({})]
    for admin in all_admins:
        statistics.append(admin)

    for admin in statistics:
        users = [i.__dict__ for i in CRUDUser(db).get_by_all({"admin_id": admin["id"]})]
        admin["users"] = users
        for user in users:
            user_mood = [
                CRUDMood(db).get_by({"user_id": user["id"]}) for user in users
            ][0]
            user["mood"] = [i.__dict__ for i in user_mood]

    return statistics
