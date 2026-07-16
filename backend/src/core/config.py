from functools import lru_cache
from pathlib import Path

from pydantic import model_validator

from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    app_name: str = "To-Do API"
    api_prefix: str = "/api"
    database_url: str | None = None
    postgres_host: str
    postgres_port: int = 5432
    postgres_db: str
    postgres_user: str
    postgres_password: str
    database_driver: str = "postgresql+psycopg"

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def build_database_url(self) -> "Settings":
        if self.database_url:
            return self

        self.database_url = (
            f"{self.database_driver}://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
