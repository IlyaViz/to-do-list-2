from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy import text

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.api.routes import router as api_router
from src.core.config import settings
from src.core.migrations import run_migrations
from src.models.user import User


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)
    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/health")
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

    return app


app = create_app()
