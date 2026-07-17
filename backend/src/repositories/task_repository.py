from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.task import Task
from src.schemas.task import TaskCreate, TaskUpdate


async def get_task_by_id(db: AsyncSession, task_id: UUID) -> Task | None:
    result = await db.execute(select(Task).where(Task.id == task_id))

    return result.scalar_one_or_none()


async def get_user_tasks(db: AsyncSession, user_id: UUID) -> list[Task]:
    result = await db.execute(
        select(Task).where(Task.user_id == user_id).order_by(Task.priority.desc())
    )

    return list(result.scalars().all())


async def create_task(db: AsyncSession, user_id: UUID, payload: TaskCreate) -> Task:
    task = Task(**payload.model_dump(), user_id=user_id)

    db.add(task)
    await db.flush()
    await db.refresh(task)

    return task


async def update_task(db: AsyncSession, task: Task, payload: TaskUpdate) -> Task:
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    await db.flush()
    await db.refresh(task)

    return task


async def delete_task(db: AsyncSession, task: Task) -> None:
    await db.delete(task)
    await db.flush()
