from typing import NoReturn

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db
from src.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from src.services.auth_service import (
    login_user,
    register_user,
    refresh_access_token,
)
from src.errors.auth import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    MissingRefreshTokenError,
)


router = APIRouter(prefix="/auth", tags=["auth"])


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=settings.refresh_token_cookie_name,
        value=refresh_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path=f"{settings.api_prefix}/auth",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
    )


def handle_auth_errors(error: Exception) -> NoReturn:
    if isinstance(error, InvalidCredentialsError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        ) from error

    if isinstance(error, EmailAlreadyRegisteredError):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from error

    if isinstance(error, MissingRefreshTokenError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        ) from error

    if isinstance(error, InvalidRefreshTokenError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from error

    raise error


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    try:
        auth_bundle = await login_user(payload, db)
    except Exception as error:
        handle_auth_errors(error)

    set_refresh_cookie(response, auth_bundle.refresh_token)

    return TokenResponse(access_token=auth_bundle.access_token)


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    payload: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    try:
        auth_bundle = await register_user(payload, db)
    except Exception as error:
        handle_auth_errors(error)

    set_refresh_cookie(response, auth_bundle.refresh_token)

    return TokenResponse(access_token=auth_bundle.access_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: Request) -> TokenResponse:
    try:
        auth_bundle = refresh_access_token(request)
    except Exception as error:
        handle_auth_errors(error)

    return TokenResponse(access_token=auth_bundle.access_token)


@router.post("/logout")
async def logout(response: Response) -> dict[str, str]:
    response.delete_cookie(
        key=settings.refresh_token_cookie_name,
        path=f"{settings.api_prefix}/auth",
    )

    return {"message": "Logged out"}
