import os
from sqlalchemy import (
    create_engine, Column, Integer, String,
    DateTime, ForeignKey, Boolean, UniqueConstraint
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime


def _get_database_url() -> str:
    # 1. Streamlit secrets (producción en Streamlit Cloud)
    try:
        import streamlit as st
        return st.secrets["DATABASE_URL"]
    except Exception:
        pass
    # 2. Variable de entorno
    url = os.environ.get("DATABASE_URL")
    if url:
        return url
    # 3. SQLite local como fallback
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return f"sqlite:///{os.path.join(base_dir, 'mundial.db')}"


DATABASE_URL = _get_database_url()

# Supabase a veces devuelve postgres:// en lugar de postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    memberships = relationship("GroupMember", back_populates="user")
    predictions = relationship("Prediction", back_populates="user")


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(300), nullable=True)
    invite_token = Column(String(64), unique=True, nullable=False, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", foreign_keys=[owner_id])
    members = relationship("GroupMember", back_populates="group")


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("group_id", "user_id"),)

    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="memberships")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    home_team = Column(String(60), nullable=False)
    away_team = Column(String(60), nullable=False)
    match_datetime = Column(DateTime, nullable=False)
    stage = Column(String(50), nullable=False, default="Fase de grupos")
    home_goals = Column(Integer, nullable=True)
    away_goals = Column(Integer, nullable=True)
    is_finished = Column(Boolean, default=False)

    predictions = relationship("Prediction", back_populates="match")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    predicted_home_goals = Column(Integer, nullable=False)
    predicted_away_goals = Column(Integer, nullable=False)
    points_earned = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "match_id", "group_id"),)

    user = relationship("User", back_populates="predictions")
    match = relationship("Match", back_populates="predictions")


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
