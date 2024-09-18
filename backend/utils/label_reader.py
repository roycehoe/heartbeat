from typing import BinaryIO

import cv2
import pytesseract

from exceptions import MedicineLabelReadException
from schemas import DosageFrequency, MedicineLabel, SpecialDosageInstructions


def get_medicine_label(file: BinaryIO) -> MedicineLabel:
    try:
        if True:
            return MedicineLabel(
                patient_name="Tan Kah Khee",
                medicine_name="Paracetamol",
                total_doses=14,
                dosage_frequency=DosageFrequency.DAILY,
                dosage_count=1,
                dosage_frequency_count=2,
                dosage_instructions=SpecialDosageInstructions.NO_INSTRUCTIONS,
            )
    except Exception:
        raise MedicineLabelReadException

    image = cv2.imread("photo.jpg")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
    gray = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    config = "-l eng --oem 1 --psm 3"
    text = pytesseract.image_to_string(binary, config=config)
