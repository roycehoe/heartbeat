class MedicineLabelReadException(Exception):
    pass


class CalendarCreateException(Exception):
    pass


class DBCreateUserException(Exception):
    pass

class DBCreateUserWithEmailAlreadyExistsException(Exception):
    pass

class DBGetUserException(Exception):
    pass


class NoUserException(Exception):
    pass

class InvalidUsernameOrPasswordException(Exception):
    pass
