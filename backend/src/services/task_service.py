from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.models.task import Task
from src.schemas.task import TaskCreate, TaskUpdate
from src.repositories import task_repository
from src.errors.task import TaskNotFoundError, MaxDepthExceededError


async def _check_depth_and_ownership(
    db: AsyncSession, parent_id: UUID, user_id: str
) -> None:
    parent_task = await task_repository.get_task_by_id(db, parent_id)

    if not parent_task or str(parent_task.user_id) != user_id:
        raise TaskNotFoundError()

    if parent_task.parent_id is not None:
        raise MaxDepthExceededError(
            "Maximum subtask depth is 1. Cannot add subtask to a subtask."
        )


async def get_tasks(db: AsyncSession, user_id: str) -> list[Task]:
    return await task_repository.get_user_tasks(db, UUID(user_id))


async def create_task(db: AsyncSession, user_id: str, payload: TaskCreate) -> Task:
    if payload.parent_id:
        await _check_depth_and_ownership(db, payload.parent_id, user_id)

    return await task_repository.create_task(db, UUID(user_id), payload)


async def update_task(
    db: AsyncSession, user_id: str, task_id: str, payload: TaskUpdate
) -> Task:
    task = await task_repository.get_task_by_id(db, UUID(task_id))

    if not task or str(task.user_id) != user_id:
        raise TaskNotFoundError()

    if payload.parent_id:
        await _check_depth_and_ownership(db, payload.parent_id, user_id)

    return await task_repository.update_task(db, task, payload)


async def delete_task(db: AsyncSession, user_id: str, task_id: str) -> None:
    task = await task_repository.get_task_by_id(db, UUID(task_id))

    if not task or str(task.user_id) != user_id:
        raise TaskNotFoundError()

    await task_repository.delete_task(db, task)
