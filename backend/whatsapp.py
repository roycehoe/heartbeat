from dotenv import dotenv_values
from pydantic import BaseModel
import requests

WHATSAPP_API_BASE_URL = "https://graph.facebook.com/v22.0"
PHONE_NUMBER_ID = dotenv_values(".env").get("PHONE_NUMBER_ID") or ""
WHATSAPP_API_ACCESS_TOKEN = dotenv_values(".env").get("WHATSAPP_API_ACCESS_TOKEN") or ""


class WhatsappMessageException(Exception):
    pass


class WhatsappMessageDataLanguage(BaseModel):
    code: str = "en_US"


class WhatsappMessageDataTemplate(BaseModel):
    name: str = "hello_world"
    language: WhatsappMessageDataLanguage


class WhatsappMessageData(BaseModel):
    messaging_product: str = "whatsapp"
    to: str
    type: str = "template"
    template: WhatsappMessageDataTemplate


def get_whatsapp_api_message_url(
    base_url: str = WHATSAPP_API_BASE_URL, phone_number_id: str = PHONE_NUMBER_ID
):
    return f"{base_url}/{phone_number_id}/messages"


def send_whatsapp_message(
    message: WhatsappMessageData,
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


message = WhatsappMessageData(
    to="6591348131",
    template=WhatsappMessageDataTemplate(language=WhatsappMessageDataLanguage()),
)
send_whatsapp_message(message)
