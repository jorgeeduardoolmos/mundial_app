"""
Router de grupos
================
POST /groups               → crea un grupo (requiere token)
GET  /groups               → lista mis grupos
GET  /groups/{id}          → detalle de un grupo + miembros
POST /groups/join/{token}  → unirse con magic link
POST /groups/{id}/regenerate → regenerar link de invitación
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.deps import get_db, get_current_user
from modules.groups import (
    create_group, get_user_groups, get_group_by_id,
    get_group_members, join_group_by_token,
    regenerate_invite_token, is_member
)
from db.models import User

router = APIRouter(prefix="/groups", tags=["groups"])

BASE_URL = "https://mundial-app-prode-frontend.vercel.app"  # se actualiza al deployar


class CreateGroupRequest(BaseModel):
    name: str
    description: Optional[str] = ""

class GroupResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    invite_url: str
    owner_id: int
    member_count: int

class MemberResponse(BaseModel):
    id: int
    username: str
    display_name: str
    is_owner: bool


def _build_invite_url(token: str) -> str:
    return f"{BASE_URL}/?invite={token}"


@router.post("", response_model=GroupResponse, status_code=201)
def create(body: CreateGroupRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="El nombre es requerido.")
    group = create_group(db, body.name, body.description or "", user.id)
    members = get_group_members(db, group.id)
    return GroupResponse(
        id=group.id, name=group.name, description=group.description,
        invite_url=_build_invite_url(group.invite_token),
        owner_id=group.owner_id, member_count=len(members),
    )


@router.get("", response_model=list[GroupResponse])
def list_groups(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    groups = get_user_groups(db, user.id)
    result = []
    for g in groups:
        members = get_group_members(db, g.id)
        result.append(GroupResponse(
            id=g.id, name=g.name, description=g.description,
            invite_url=_build_invite_url(g.invite_token),
            owner_id=g.owner_id, member_count=len(members),
        ))
    return result


@router.get("/{group_id}/members", response_model=list[MemberResponse])
def list_members(group_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not is_member(db, group_id, user.id):
        raise HTTPException(status_code=403, detail="No pertenecés a este grupo.")
    group = get_group_by_id(db, group_id)
    members = get_group_members(db, group_id)
    return [
        MemberResponse(id=m.id, username=m.username, display_name=m.display_name, is_owner=(m.id == group.owner_id))
        for m in members
    ]


@router.post("/join/{invite_token}")
def join(invite_token: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ok, msg, group = join_group_by_token(db, invite_token, user.id)
    if not ok and "Ya sos miembro" not in msg:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg, "group_id": group.id if group else None, "group_name": group.name if group else None}


@router.post("/{group_id}/regenerate")
def regenerate(group_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ok, msg = regenerate_invite_token(db, group_id, user.id)
    if not ok:
        raise HTTPException(status_code=403, detail=msg)
    group = get_group_by_id(db, group_id)
    return {"message": msg, "invite_url": _build_invite_url(group.invite_token)}
