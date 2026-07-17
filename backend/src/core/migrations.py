from alembic import command
from alembic.config import Config

from src.core.paths import ALEMBIC_DIR, ALEMBIC_INI_PATH


def run_migrations() -> None:
    config = Config(str(ALEMBIC_INI_PATH))
    config.set_main_option("script_location", str(ALEMBIC_DIR))
    command.upgrade(config, "head")
