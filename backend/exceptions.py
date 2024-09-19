class MedicineLabelReadException(Exception):
    pass


class CalendarCreateException(Exception):
    pass


class DBCreateAccountException(Exception):
    pass

class DBCreateAccountWithEmailAlreadyExistsException(Exception):
    pass

class DBGetAccountException(Exception):
    pass


class NoAccountFoundException(Exception):
    pass

class InvalidUsernameOrPasswordException(Exception):
    pass
