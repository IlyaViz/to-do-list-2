class AuthError(Exception):
    """Base auth domain error."""


class InvalidCredentialsError(AuthError):
    """Raised when login credentials do not match."""


class EmailAlreadyRegisteredError(AuthError):
    """Raised when registration uses an existing email."""


class MissingRefreshTokenError(AuthError):
    """Raised when refresh cookie is absent."""


class InvalidRefreshTokenError(AuthError):
    """Raised when refresh cookie is invalid."""