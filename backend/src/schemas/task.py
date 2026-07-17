from datetime import datetime
from uuid import UUID

from pydantic import Field

from src.schemas.base import AppBaseModel


class TaskBase(AppBaseModel):
    title: str = Field(min_length=1, max_length=255)
    priority: int = Field(ge=1, le=10)
    category: str | None = Field(default=None, max_length=50)
    due_date: datetime | None = None
    parent_id: UUID | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(AppBaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    is_done: bool | None = None
    priority: int | None = Field(default=None, ge=1, le=10)
    category: str | None = Field(default=None, max_length=50)
    due_date: datetime | None = None
    parent_id: UUID | None = None


class TaskRead(TaskBase):
    id: UUID
    user_id: UUID
    is_done: bool
