from pydantic import EmailStr, Field

from src.schemas.base import AppBaseModel


class LoginRequest(AppBaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterRequest(LoginRequest):
    pass


class TokenResponse(AppBaseModel):
    access_token: str
    token_type: str = "bearer"
