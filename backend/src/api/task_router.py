from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.deps.auth import get_current_user_id
from src.core.database import get_db
from src.schemas.task import TaskCreate, TaskRead, TaskUpdate
from src.services import task_service
from src.errors.task import TaskNotFoundError, MaxDepthExceededError


router = APIRouter(prefix="/tasks", tags=["tasks"])


def handle_task_errors(error: Exception):
    if isinstance(error, TaskNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    if isinstance(error, MaxDepthExceededError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    raise error


@router.get("", response_model=list[TaskRead])
async def get_tasks(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await task_service.get_tasks(db, user_id)


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await task_service.create_task(db, user_id, payload)
    except Exception as error:
        handle_task_errors(error)


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await task_service.update_task(db, user_id, str(task_id), payload)
    except Exception as error:
        handle_task_errors(error)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    try:
        await task_service.delete_task(db, user_id, str(task_id))
    except Exception as error:
        handle_task_errors(error)
