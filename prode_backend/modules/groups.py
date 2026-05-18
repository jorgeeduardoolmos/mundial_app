import secrets
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db.models import Group, GroupMember, User


# ── Helpers ───────────────────────────────────────────────────────────────

def generate_invite_token() -> str:
    return secrets.token_urlsafe(32)


def get_group_by_token(db: Session, token: str) -> Group | None:
    return db.query(Group).filter(Group.invite_token == token).first()


def get_group_by_id(db: Session, group_id: int) -> Group | None:
    return db.query(Group).filter(Group.id == group_id).first()


def get_user_groups(db: Session, user_id: int) -> list[Group]:
    """All groups the user belongs to (as owner or member)."""
    memberships = (
        db.query(GroupMember)
        .filter(GroupMember.user_id == user_id)
        .all()
    )
    group_ids = [m.group_id for m in memberships]
    if not group_ids:
        return []
    return db.query(Group).filter(Group.id.in_(group_ids)).all()


def get_group_members(db: Session, group_id: int) -> list[User]:
    memberships = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id)
        .all()
    )
    user_ids = [m.user_id for m in memberships]
    if not user_ids:
        return []
    return db.query(User).filter(User.id.in_(user_ids)).all()


def is_member(db: Session, group_id: int, user_id: int) -> bool:
    return (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
        .first()
    ) is not None


# ── Actions ───────────────────────────────────────────────────────────────

def create_group(db: Session, name: str, description: str, owner_id: int) -> Group:
    group = Group(
        name=name.strip(),
        description=description.strip(),
        invite_token=generate_invite_token(),
        owner_id=owner_id,
    )
    db.add(group)
    db.flush()  # get group.id before commit

    # Owner is automatically a member
    membership = GroupMember(group_id=group.id, user_id=owner_id)
    db.add(membership)
    db.commit()
    db.refresh(group)
    return group


def join_group(db: Session, group_id: int, user_id: int) -> tuple[bool, str]:
    """
    Returns (success, message).
    """
    if is_member(db, group_id, user_id):
        return False, "Ya sos miembro de este grupo."

    membership = GroupMember(group_id=group_id, user_id=user_id)
    db.add(membership)
    try:
        db.commit()
        return True, "¡Te uniste al grupo!"
    except IntegrityError:
        db.rollback()
        return False, "No se pudo unir al grupo. Intentá de nuevo."


def join_group_by_token(db: Session, token: str, user_id: int) -> tuple[bool, str, Group | None]:
    """
    Returns (success, message, group).
    """
    group = get_group_by_token(db, token)
    if not group:
        return False, "El link de invitación no es válido o ya expiró.", None

    success, msg = join_group(db, group.id, user_id)
    return success, msg, group


def regenerate_invite_token(db: Session, group_id: int, owner_id: int) -> tuple[bool, str]:
    group = get_group_by_id(db, group_id)
    if not group:
        return False, "Grupo no encontrado."
    if group.owner_id != owner_id:
        return False, "Solo el creador puede regenerar el link."
    group.invite_token = generate_invite_token()
    db.commit()
    return True, "Link regenerado exitosamente."
