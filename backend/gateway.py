import asyncio
from datetime import datetime

from dotenv import dotenv_values
from telegram import Bot

TELEGRAM_BOT_TOKEN: str = dotenv_values(".env").get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID: int = dotenv_values(".env").get("TELEGRAM_CHAT_ID")


def _init_telegram_bot_connection_instance(token: str = TELEGRAM_BOT_TOKEN):
    return Bot(token=token)


async def _send_telegram_message(message: str):
    bot_conn = _init_telegram_bot_connection_instance()
    await bot_conn.send_message(chat_id=TELEGRAM_CHAT_ID, text=message)


async def send_non_compliant_user_notification_message(name: str, date: datetime):
    await _send_telegram_message(
        f"""INFO
{name} has not logged their mood on {datetime.strftime(date, '%d/%m/%y')}
"""
    )


async def send_sad_user_notification_message(
    name: str, consecutive_sad_moods_count: int
):
    await _send_telegram_message(
        f"""WARNING
{name} has logged {consecutive_sad_moods_count} consecutive sad moods on their heartbeat device. Perhaps you should pay them a visit?
"""
    )
