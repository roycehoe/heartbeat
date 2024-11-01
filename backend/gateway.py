from datetime import datetime
from dotenv import dotenv_values
from twilio.rest import Client
from dotenv import dotenv_values

TWILIO_ACCOUNT_SID = dotenv_values(".env").get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = dotenv_values(".env").get("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = dotenv_values(".env").get("TWILIO_NUMBER")


def get_twilio_client(
    sid: str = TWILIO_ACCOUNT_SID, auth_token: str = TWILIO_AUTH_TOKEN
) -> Client:
    return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_SMS(
    twilio_client: Client, to: str, message: str, twilio_number: str = TWILIO_NUMBER
) -> None:
    twilio_client.messages.create(
        from_=twilio_number,
        body=message,
        to=to,
    )


def _get_non_compliant_user_notification_message(name: str, date: datetime):
    return f"""Message from heart beat sg
    
--INFO--
{name} has not logged their mood on {datetime.strftime(date, '%d/%m/%y')}

Admin dashboard: https://heartbeat.fancybinary.sg/admin
"""


def _get_sad_user_notification_message(
    name: str,
    consecutive_sad_moods_count: int,
):
    return f"""Message from heart beat sg
    
--WARNING--
{name} has logged {consecutive_sad_moods_count} consecutive sad moods on their heartbeat device. Perhaps you should pay them a visit?

Admin dashboard: https://heartbeat.fancybinary.sg/admin
"""


def send_non_compliant_user_notification_message(name: str, date: datetime, to: str):
    twilio_client = get_twilio_client()
    message = _get_non_compliant_user_notification_message(name, date)
    return send_SMS(twilio_client, to, message)


def send_sad_user_notification_message(
    name: str,
    consecutive_sad_moods_count: int,
    to: str,
):
    twilio_client = get_twilio_client()
    message = _get_sad_user_notification_message(name, consecutive_sad_moods_count)
    return send_SMS(twilio_client, to, message)
