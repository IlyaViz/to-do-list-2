from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    priority: int = Field(ge=1, le=10)
    category: str | None = Field(default=None, max_length=50)
    due_date: datetime | None = None
    parent_id: UUID | None = None

    @field_validator("title", "category")
    @classmethod
    def not_blank(cls, value: str | None):
        if value is None:
            return value
        if not value.strip():
            raise ValueError("must not be empty")
        return value


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    is_done: bool | None = None
    priority: int | None = Field(default=None, ge=1, le=10)
    category: str | None = Field(default=None, max_length=50)
    due_date: datetime | None = None
    parent_id: UUID | None = None

    @field_validator("title", "category")
    @classmethod
    def not_blank(cls, value: str | None):
        if value is None:
            return value
        if not value.strip():
            raise ValueError("must not be empty")
        return value


class TaskRead(TaskBase):
    id: UUID
    user_id: UUID
    is_done: bool

    model_config = {"from_attributes": True}