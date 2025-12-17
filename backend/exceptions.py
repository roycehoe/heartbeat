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


class DBCreateAccountWithUsernameAlreadyExistsException(Exception):
    pass


class DBGetAccountException(Exception):
    pass


class DBException(Exception):
    pass


class NoRecordFoundException(Exception):
    pass


class ClerkAuthenticationFailedException(Exception):
    pass


class InvalidCredentialsToAccessUser(Exception):
    pass
