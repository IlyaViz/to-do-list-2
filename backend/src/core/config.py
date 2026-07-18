from pydantic import model_validator

from pydantic_settings import BaseSettings, SettingsConfigDict

from src.core.paths import DOTENV_PATH, DOTENV_TEST_PATH


ENV_FILES = tuple(path for path in (DOTENV_PATH, DOTENV_TEST_PATH) if path.exists())


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
    secret_key: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    refresh_token_cookie_name: str = "refresh_token"
    run_migrations_on_startup: bool
    next_origin: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILES,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def build_database_url(self) -> "Settings":
        if self.database_url:
            return self

        if not all(
            [
                self.postgres_host,
                self.postgres_db,
                self.postgres_user,
                self.postgres_password,
            ]
        ):
            raise ValueError(
                "database_url or postgres connection settings are required"
            )

        self.database_url = (
            f"{self.database_driver}://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )
        return self


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
