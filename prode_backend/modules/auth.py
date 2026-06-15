import bcrypt
from db import sheets


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def get_user_by_username(username: str) -> dict | None:
    return sheets.get_user_by_username(username)


def get_user_by_email(email: str) -> dict | None:
    return sheets.get_user_by_email(email)


def get_user_by_id(user_id: int) -> dict | None:
    return sheets.get_user_by_id(user_id)


def create_user(username: str, email: str, password: str, display_name: str) -> dict:
    return sheets.create_user(username, email, hash_password(password), display_name)


def authenticate_user(username: str, password: str) -> dict | None:
    user = get_user_by_username(username.strip().lower())
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


def validate_register(username: str, email: str, password: str, confirm: str) -> list[str]:
    errors = []
    if len(username) < 3:
        errors.append("El usuario debe tener al menos 3 caracteres.")
    if get_user_by_username(username.strip().lower()):
        errors.append("Ese nombre de usuario ya está en uso.")
    if "@" not in email or "." not in email:
        errors.append("El email no parece válido.")
    if get_user_by_email(email.strip().lower()):
        errors.append("Ya existe una cuenta con ese email.")
    if len(password) < 3:
        errors.append("La contraseña debe tener al menos 3 caracteres.")
    if password != confirm:
        errors.append("Las contraseñas no coinciden.")
    return errors
