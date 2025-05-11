from datetime import datetime
from typing import Literal, Optional
from dotenv import dotenv_values
from pydantic import BaseModel
import requests

from schemas.whatsapp import SendWhatsappMessageRequestData
from utils.whatsapp import (
    get_consecutive_sad_moods_whatsapp_message_data,
    get_non_compliant_whatsapp_message_data,
)

WHATSAPP_API_BASE_URL = "https://graph.facebook.com/v22.0"
PHONE_NUMBER_ID = dotenv_values(".env").get("PHONE_NUMBER_ID") or ""
WHATSAPP_API_ACCESS_TOKEN = dotenv_values(".env").get("WHATSAPP_API_ACCESS_TOKEN") or ""


class WhatsappMessageException(Exception):
    pass


class ComponentParameterText(BaseModel):
    type: str = "text"
    parameter_name: str
    text: str


class Component(BaseModel):
    type: str = "body"
    parameters: list[ComponentParameterText]


class WhatsappMessageDataLanguage(BaseModel):
    code: str = "en"


class WhatsappMessageDataTemplate(BaseModel):
    name: str
    language: WhatsappMessageDataLanguage
    components: Optional[list[Component]] = []


class WhatsappMessageData(BaseModel):
    messaging_product: str = "whatsapp"
    recipient_type: str = "individual"
    type: str = "template"
    to: str
    template: WhatsappMessageDataTemplate


def get_whatsapp_api_message_url(
    base_url: str = WHATSAPP_API_BASE_URL, phone_number_id: str = PHONE_NUMBER_ID
):
    return f"{base_url}/{phone_number_id}/messages"


def send_whatsapp_message(
    message: SendWhatsappMessageRequestData,
    access_token=WHATSAPP_API_ACCESS_TOKEN,
    base_url: str = WHATSAPP_API_BASE_URL,
    phone_number_id: str = PHONE_NUMBER_ID,
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


message = get_consecutive_sad_moods_whatsapp_message_data(
    "6591348131", "Lim Swee Swee", 2
)
message = get_non_compliant_whatsapp_message_data(
    "6591348131", "Lim Swee Swee", datetime(2025, 3, 23)
)

# message = get_test_whatsapp_message_data("6591348131")
send_whatsapp_message(message)
