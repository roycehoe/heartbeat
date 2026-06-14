import os
from datetime import date

import pandas as pd
from jinja2 import Environment, FileSystemLoader

from queries import *
from emailer import send_email  
from database import SessionLocal

def report():
    db = SessionLocal()

    try:

        # generate output folder for today's date
        current_date = str(date.today())
        current_date_formatted = current_date.replace('-','_')
        dir = f"reports/output/{current_date_formatted}"
        os.makedirs(dir, exist_ok=True)

        
        env = Environment(loader=FileSystemLoader("./reports/templates"))   # folder containing report.html.jinja
        template = env.get_template("template.html")

        sad_users_last_7_days = {
            'cols': ['name','postal_code'],
            'rows': get_users_sad_2plus_last_7_days(db)
        }

        compliance_rate = get_weekly_compliance_rate(db)

        html = template.render(
            title="Weekly User Report",
            # image_path="static/logo.png",   # optional; can be None
            sad_users_last_7_days = sad_users_last_7_days,
            compliance_rate = compliance_rate
        )

        # persist template for archive storage
        with open(f"{dir}/report.html", "w") as f:
            f.write(html)

        send_email(
            subject=f'Heartbeat Weekly Report {current_date}',
            html_content=html
            )
        
        print('end')

    except Exception as e:
        print("Error generating report:", e)

    finally:
        db.close()

if __name__ == "__main__":
    report()