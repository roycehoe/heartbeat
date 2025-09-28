from apscheduler.schedulers.background import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from uuid import uuid4

from report import report 

scheduler = BlockingScheduler()

def start():
    """Start the scheduler."""
    scheduler.add_job(
        report,
        trigger=CronTrigger(day_of_week="mon", hour=9, minute=0), # adjust as needed
        )
    
    scheduler.start()


if __name__ == "__main__":
    start()