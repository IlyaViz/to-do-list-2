import asyncio

import pytest
from fastapi.testclient import TestClient

from src.core.database import Base, SessionLocal, engine
from src.core.security import hash_password
from src.main import app
from src.models.user import User


def create_tables() -> None:
    async def _create_tables() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

    asyncio.run(_create_tables())


def drop_tables() -> None:
    async def _drop_tables() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)

    asyncio.run(_drop_tables())


@pytest.fixture()
def client():
    create_tables()
    with TestClient(app) as test_client:
        yield test_client
    drop_tables()


@pytest.fixture()
def seed_user():
    async def _seed_user(email: str, password: str) -> User:
        async with SessionLocal() as db:
            user = User(email=email, hashed_password=hash_password(password))
            
            db.add(user)
            await db.commit()
            await db.refresh(user)

            return user

    def _create_user(email: str, password: str) -> User:
        return asyncio.run(_seed_user(email, password))

    return _create_user
