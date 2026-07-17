from uuid import UUID

from pydantic import EmailStr, Field

from src.schemas.base import AppBaseModel


class UserCreate(AppBaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(AppBaseModel):
    id: UUID
    email: EmailStr


class UserPasswordUpdate(AppBaseModel):
    password: str = Field(min_length=8, max_length=128)
