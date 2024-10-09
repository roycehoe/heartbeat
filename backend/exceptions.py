class MedicineLabelReadException(Exception):
    pass


class CalendarCreateException(Exception):
    pass


class DifferentPasswordAndConfirmPasswordException(Exception):
    pass


class UserNotUnderCurrentAdminException(Exception):
    pass


class DBCreateAccountException(Exception):
    pass


class DBCreateAccountWithEmailAlreadyExistsException(Exception):
    pass


class DBGetAccountException(Exception):
    pass


class DBException(Exception):
    pass


class NoRecordFoundException(Exception):
    pass


class InvalidUsernameOrPasswordException(Exception):
    pass
