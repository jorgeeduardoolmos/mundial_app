"""
Router de autenticación
========================
POST /auth/register  → crea un usuario nuevo, devuelve token
POST /auth/login     → verifica credenciales, devuelve token
GET  /auth/me        → devuelve el usuario actual (requiere token)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from core.deps import get_db, get_current_user
from core.security import create_access_token
from modules.auth import (
    authenticate_user, create_user,
    validate_register, get_user_by_username
)
from db.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Schemas (Pydantic valida automáticamente los datos entrantes) ──────────

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    display_name: str

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    display_name: str

class UserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    email: str


# ── Endpoints ─────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """
    Crea una cuenta nueva.
    Valida duplicados, hashea la contraseña, devuelve un JWT listo para usar.
    """
    errors = validate_register(db, body.username, body.email, body.password, body.password)
    if not body.display_name.strip():
        errors.insert(0, "El nombre es requerido.")
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    user = create_user(db, body.username, body.email, body.password, body.display_name)
    token = create_access_token(user.id, user.username)

    return TokenResponse(
        access_token=token,
        user_id=user.id,
        username=user.username,
        display_name=user.display_name,
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    Verifica usuario y contraseña.
    Si son correctos, devuelve un JWT.
    """
    user = authenticate_user(db, body.username, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
        )

    token = create_access_token(user.id, user.username)

    return TokenResponse(
        access_token=token,
        user_id=user.id,
        username=user.username,
        display_name=user.display_name,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Devuelve los datos del usuario autenticado.
    Útil para que el frontend verifique si el token sigue siendo válido.
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        display_name=current_user.display_name,
        email=current_user.email,
    )
