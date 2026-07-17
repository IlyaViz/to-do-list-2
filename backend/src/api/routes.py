from fastapi import APIRouter

from src.api.auth_router import router as auth_router
from src.api.health_router import router as health_router
from src.api.task_router import router as task_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(health_router)
router.include_router(task_router)
