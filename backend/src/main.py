from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.api.routes import router as api_router
from src.core.config import settings
from src.core.migrations import run_migrations


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.run_migrations_on_startup:
        run_migrations()
        
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)
    app.include_router(api_router, prefix=settings.api_prefix)

    return app


app = create_app()
