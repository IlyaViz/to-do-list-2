from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def not_blank(cls, value: str):
        if not value.strip():
            raise ValueError("must not be empty")
        return value


class UserRead(BaseModel):
    id: UUID
    email: EmailStr

    model_config = {"from_attributes": True}


class UserPasswordUpdate(BaseModel):
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def not_blank(cls, value: str):
        if not value.strip():
            raise ValueError("must not be empty")
        return value