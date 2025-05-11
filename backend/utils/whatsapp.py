from datetime import datetime
from schemas.whatsapp import (
    SendWhatsappMessageRequestData,
    Template,
    TemplateComponent,
    TemplateComponentParameter,
)


def get_consecutive_sad_moods_whatsapp_message_data(
    to: str, name: str, sad_mood_count: int
) -> SendWhatsappMessageRequestData:
    template_component_parameters = [
        TemplateComponentParameter(parameter_name="name", text=name),
        TemplateComponentParameter(
            parameter_name="sad_mood_count", text=f"{sad_mood_count}"
        ),
    ]

    template = Template(
        name="consecutive_sad_moods",
        components=[TemplateComponent(parameters=template_component_parameters)],
    )

    return SendWhatsappMessageRequestData(to=to, template=template)


def get_non_compliant_whatsapp_message_data(
    to: str, name: str, date: datetime
) -> SendWhatsappMessageRequestData:
    template_component_parameters = [
        TemplateComponentParameter(parameter_name="name", text=name),
        TemplateComponentParameter(parameter_name="date", text=f"{date}"),
    ]

    template = Template(
        name="non_compliant_user",
        components=[TemplateComponent(parameters=template_component_parameters)],
    )

    return SendWhatsappMessageRequestData(to=to, template=template)
