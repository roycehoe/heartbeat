from queries import get_active_care_receipients_last_7_days
from emailer import send_email

from database import SessionLocal

def report():
    db = SessionLocal()

    try:

        active_care_receipients = get_active_care_receipients_last_7_days(db)
        print(f"Active care receipients in the last 7 days: {active_care_receipients}")


        send_email()


    except Exception as e:
        print("Error generating report:", e)

    finally:
        db.close()
