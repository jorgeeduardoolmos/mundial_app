from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from core.deps import get_current_user
from core.security import create_access_token
from modules.auth import authenticate_user, create_user, validate_register

router = APIRouter(prefix="/auth", tags=["auth"])


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


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest):
    errors = validate_register(body.username, body.email, body.password, body.password)
    if not body.display_name.strip():
        errors.insert(0, "El nombre es requerido.")
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    user = create_user(body.username, body.email, body.password, body.display_name)
    token = create_access_token(user["id"], user["username"])
    return TokenResponse(
        access_token=token,
        user_id=user["id"],
        username=user["username"],
        display_name=user["display_name"],
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = authenticate_user(body.username, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
        )
    token = create_access_token(user["id"], user["username"])
    return TokenResponse(
        access_token=token,
        user_id=user["id"],
        username=user["username"],
        display_name=user["display_name"],
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        display_name=current_user["display_name"],
        email=current_user["email"],
    )
