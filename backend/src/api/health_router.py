from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from fastapi import APIRouter, Depends

from src.core.database import get_db
from src.models.user import User

router = APIRouter()


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    try:
        test_user = User(email="test@example.com", hashed_password="hashedpassword")

        db.add(test_user)
        await db.flush()

        await db.execute(text("SELECT 1"))

        await db.rollback()

        return {"status": "ok", "database": "reachable"}
    except Exception as error:
        return {"status": "error", "database": "unreachable", "error": str(error)}
