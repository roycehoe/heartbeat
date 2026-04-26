class MedicineLabelReadException(Exception):
    pass


class CalendarCreateException(Exception):
    pass


class DifferentPasswordAndConfirmPasswordException(Exception):
    pass


class CareReceipientNotUnderCurrentCaregiverException(Exception):
    pass


class DBCreateAccountException(Exception):
    pass


class DBDuplicateAccountException(Exception):
    pass


class DBGetAccountException(Exception):
    pass


class DBException(Exception):
    pass


class NoRecordFoundException(Exception):
    pass


class ClerkAuthenticationFailedException(Exception):
    pass


class InvalidCredentialsToAccessCareReceipient(Exception):
    pass


class CareReceipientNotFoundException(Exception):
    pass
