from dataclasses import dataclass

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.security import (
    REFRESH_TOKEN_TYPE,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from src.repositories.auth_repository import create_user, get_user_by_email
from src.schemas.auth import LoginRequest, RegisterRequest
from src.errors.auth import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    MissingRefreshTokenError,
)


@dataclass(slots=True)
class AuthBundle:
    access_token: str
    refresh_token: str | None = None


async def login_user(payload: LoginRequest, db: AsyncSession) -> AuthBundle:
    user = await get_user_by_email(db, payload.email)

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise InvalidCredentialsError()

    return AuthBundle(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


async def register_user(payload: RegisterRequest, db: AsyncSession) -> AuthBundle:
    existing_user = await get_user_by_email(db, payload.email)

    if existing_user is not None:
        raise EmailAlreadyRegisteredError()

    user = await create_user(db, payload.email, hash_password(payload.password))

    return AuthBundle(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


def refresh_access_token(request: Request) -> AuthBundle:
    refresh_token = request.cookies.get(settings.refresh_token_cookie_name)

    if not refresh_token:
        raise MissingRefreshTokenError()

    try:
        payload = decode_token(refresh_token, REFRESH_TOKEN_TYPE)
    except Exception as error:
        raise InvalidRefreshTokenError() from error

    return AuthBundle(access_token=create_access_token(payload["sub"]))
