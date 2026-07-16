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


class AppLanguage(str, Enum):
    ENGLISH = "English"
    CHINESE = "Chinese"
    MALAY = "Malay"
    TAMIL = "Tamil"


class AgeRange(str, Enum):
    UNDER_45 = "<45"
    R45_54 = "45-54"
    R55_64 = "55-64"
    R65_74 = "65-74"
    R75_84 = "75-84"
    R85_PLUS = "85+"
