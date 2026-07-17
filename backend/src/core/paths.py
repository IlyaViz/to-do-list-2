from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[2]
REPO_ROOT = BACKEND_ROOT.parent
BACKEND_SRC_ROOT = BACKEND_ROOT / "src"
BACKEND_TESTS_ROOT = BACKEND_ROOT / "tests"
ALEMBIC_INI_PATH = BACKEND_ROOT / "alembic.ini"
ALEMBIC_DIR = BACKEND_ROOT / "alembic"
DOTENV_PATH = REPO_ROOT / ".env"
DOTENV_TEST_PATH = REPO_ROOT / ".env.test"