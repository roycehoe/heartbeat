from enum import Enum


class SelectedMood(str, Enum):
    HAPPY = "happy"
    OK = "ok"
    SAD = "sad"


class TreeDisplayState(Enum):
    SEEDLING = 1
    TEEN_TREE = 2
    ADULT_TREE = 3
    ADULT_TREE_WITH_FLOWERS = 4
    ADULT_TREE_WITH_FLOWERS_AND_GIFTS = 5


class Race(str, Enum):
    CHINESE = "Chinese"
    MALAY = "Malay"
    INDIAN = "Indian"
    OTHERS = "Others"


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
