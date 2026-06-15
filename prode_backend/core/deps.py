"""
Dependencias de FastAPI
=======================
get_current_user verifica el JWT y devuelve el usuario como dict.
Ya no hay sesión de DB — los datos vienen de Google Sheets.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import decode_access_token
from db.sheets import get_user_by_id

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise credentials_exception

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = get_user_by_id(int(user_id))
    if not user or not user.get("is_active"):
        raise credentials_exception

    return user
