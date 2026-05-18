"""
JWT — JSON Web Token
====================
Cuando el usuario se loguea, el backend firma un "pase" con una clave secreta.
Ese pase contiene el user_id y una fecha de expiración.
En cada request el frontend manda ese pase; el backend verifica la firma.
Si alguien lo modifica, la firma no coincide y se rechaza.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

# Clave secreta — en producción viene de variable de entorno
SECRET_KEY = os.environ.get("SECRET_KEY", "cambia-esto-en-produccion-usa-una-clave-larga-y-random")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 días

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(user_id: int, username: str) -> str:
    """
    Crea un JWT firmado con el user_id y username.
    Expira en ACCESS_TOKEN_EXPIRE_MINUTES minutos.
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),       # subject — el ID del usuario
        "username": username,
        "exp": expire,             # expiration — fecha de vencimiento
        "iat": datetime.now(timezone.utc),  # issued at — cuándo se creó
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Verifica y decodifica un JWT.
    Retorna el payload si es válido, None si expiró o fue modificado.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
