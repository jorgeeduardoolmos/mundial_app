import bcrypt
import secrets
from sqlalchemy.orm import Session
from db.models import User


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, username: str, email: str, password: str, display_name: str) -> User:
    user = User(
        username=username.strip().lower(),
        email=email.strip().lower(),
        hashed_password=hash_password(password),
        display_name=display_name.strip(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username.strip().lower())
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def validate_register(db: Session, username: str, email: str, password: str, confirm: str) -> list[str]:
    errors = []
    if len(username) < 3:
        errors.append("El usuario debe tener al menos 3 caracteres.")
    if get_user_by_username(db, username.strip().lower()):
        errors.append("Ese nombre de usuario ya está en uso.")
    if "@" not in email or "." not in email:
        errors.append("El email no parece válido.")
    if get_user_by_email(db, email.strip().lower()):
        errors.append("Ya existe una cuenta con ese email.")
    if len(password) < 6:
        errors.append("La contraseña debe tener al menos 6 caracteres.")
    if password != confirm:
        errors.append("Las contraseñas no coinciden.")
    return errors
