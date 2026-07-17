from datetime import datetime, timedelta, timezone
from hashlib import pbkdf2_hmac
import hmac
import secrets
from uuid import uuid4

import jwt

from src.core.config import settings


PASSWORD_HASH_ALGORITHM = "sha256"
PASSWORD_HASH_ITERATIONS = 390000
PASSWORD_HASH_SALT_BYTES = 16
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(PASSWORD_HASH_SALT_BYTES)
    digest = pbkdf2_hmac(
        PASSWORD_HASH_ALGORITHM,
        password.encode("utf-8"),
        salt,
        PASSWORD_HASH_ITERATIONS,
    )

    return f"{PASSWORD_HASH_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        iterations_text, salt_text, digest_text = hashed_password.split("$")
        iterations = int(iterations_text)
    except ValueError:
        return False

    expected_digest = bytes.fromhex(digest_text)
    actual_digest = pbkdf2_hmac(
        PASSWORD_HASH_ALGORITHM,
        password.encode("utf-8"),
        bytes.fromhex(salt_text),
        iterations,
    )

    return hmac.compare_digest(actual_digest, expected_digest)


def _create_token(subject: str, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": subject,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "jti": str(uuid4()),
    }

    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_access_token(subject: str) -> str:
    return _create_token(
        subject,
        ACCESS_TOKEN_TYPE,
        timedelta(minutes=settings.access_token_expire_minutes),
    )


def create_refresh_token(subject: str) -> str:
    return _create_token(
        subject,
        REFRESH_TOKEN_TYPE,
        timedelta(days=settings.refresh_token_expire_days),
    )


def decode_token(token: str, expected_type: str) -> dict[str, str]:
    payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])

    if payload.get("type") != expected_type:
        raise jwt.InvalidTokenError("invalid token type")

    subject = payload.get("sub")
    
    if not isinstance(subject, str) or not subject.strip():
        raise jwt.InvalidTokenError("invalid token subject")

    return payload
