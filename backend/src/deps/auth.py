from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.core.security import decode_token, ACCESS_TOKEN_TYPE

bearer_scheme = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    try:
        payload = decode_token(credentials.credentials, ACCESS_TOKEN_TYPE)

        return payload["sub"]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
