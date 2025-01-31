from enum import Enum


class SelectedMood(str, Enum):
    HAPPY = "happy"
    OK = "ok"
    SAD = "sad"


class Race(str, Enum):
    CHINESE = "Chinese"
    MALAY = "Malay"
    INDIAN = "Indian"
    OTHERS = "Others"


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
