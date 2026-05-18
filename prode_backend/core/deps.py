"""
Dependencias de FastAPI
=======================
FastAPI tiene un sistema de "dependencias" — funciones que se ejecutan
antes del endpoint y le inyectan datos.

get_current_user es la dependencia de seguridad:
  - Lee el token del header Authorization
  - Lo verifica con JWT
  - Retorna el usuario de la DB
  - Si algo falla, lanza 401 Unauthorized automáticamente

Uso en un router:
    @router.get("/me")
    def get_me(user: User = Depends(get_current_user)):
        return user
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from core.security import decode_access_token
from db.models import SessionLocal, User

bearer_scheme = HTTPBearer()


def get_db():
    """Abre una sesión de DB y la cierra al terminar el request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extrae y valida el JWT del header:
      Authorization: Bearer eyJ...
    
    Retorna el User de la DB o lanza 401.
    """
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

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise credentials_exception

    return user
