from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db


router = APIRouter()


@router.get("/")
async def read_root() -> dict[str, str]:
    return {"message": "To-Do API"}


@router.get("/health/db")
async def check_database(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}
