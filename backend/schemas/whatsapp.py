from typing import Optional
from pydantic import BaseModel


class TemplateComponentParameter(BaseModel):
    type: str = "text"

    parameter_name: str
    text: str


class TemplateComponent(BaseModel):
    type: str = "body"

    parameters: list[TemplateComponentParameter]


class Language(BaseModel):
    code: str = "en"


class Template(BaseModel):
    language: Language = Language()
    components: Optional[list[TemplateComponent]] = []

    name: str


class SendWhatsappMessageRequestData(BaseModel):
    messaging_product: str = "whatsapp"
    recipient_type: str = "individual"
    type: str = "template"
    to: str
    template: Template
