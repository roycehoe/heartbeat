from sqlalchemy.orm import Session

from crud import CRUDAdmin, CRUDMood, CRUDUser


def get_statistics(db: Session):
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
