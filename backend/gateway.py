from dotenv import dotenv_values
import requests

from schemas.whatsapp import SendWhatsappMessageRequestData
from settings import AppSettings

WHATSAPP_API_BASE_URL = "https://graph.facebook.com/v22.0"


class WhatsappMessageException(Exception):
    pass


def send_whatsapp_message(
    message: SendWhatsappMessageRequestData,
    access_token=AppSettings.WHATSAPP_API_ACCESS_TOKEN,
    base_url: str = WHATSAPP_API_BASE_URL,
    phone_number_id: str = AppSettings.PHONE_NUMBER_ID,
):
    whatsapp_api_message_url = f"{base_url}/{phone_number_id}/messages"
    response = requests.post(
        whatsapp_api_message_url,
        message.model_dump_json(),
        headers={"Authorization": access_token, "Content-Type": "application/json"},
    )
    if not response.ok:
        raise WhatsappMessageException(response.json())

    response.json()


def get_whatsapp_business_info(
    message: SendWhatsappMessageRequestData,
    access_token=AppSettings.WHATSAPP_API_ACCESS_TOKEN,
    base_url: str = WHATSAPP_API_BASE_URL,
    phone_number_id: str = AppSettings.PHONE_NUMBER_ID,
):
    whatsapp_api_message_url = f"{base_url}/{phone_number_id}/messages"
    response = requests.post(
        whatsapp_api_message_url,
        message.model_dump_json(),
        headers={"Authorization": access_token, "Content-Type": "application/json"},
    )
    if not response.ok:
        raise WhatsappMessageException(response.json())

    response.json()
