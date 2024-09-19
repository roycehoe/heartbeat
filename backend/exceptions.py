class MedicineLabelReadException(Exception):
    pass


class CalendarCreateException(Exception):
    pass


class DBCreateAccountException(Exception):
    pass

class DBCreateUserWithEmailAlreadyExistsException(Exception):
    pass

class DBGetAccountException(Exception):
    pass


class NoAccountFoundException(Exception):
    pass

class InvalidUsernameOrPasswordException(Exception):
    pass
