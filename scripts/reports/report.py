from queries import get_active_users_last_7_days
from emailer import send_email  

from database import SessionLocal

def report():
    db = SessionLocal()

    try:

        active_users = get_active_users_last_7_days(db)
        print(f"Active users in the last 7 days: {active_users}")


        send_email()


    except Exception as e:
        print("Error generating report:", e)

    finally:
        db.close()