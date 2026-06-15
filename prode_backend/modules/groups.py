import secrets
from db import sheets


def generate_invite_token() -> str:
    return secrets.token_urlsafe(32)


def get_group_by_id(group_id: int) -> dict | None:
    return sheets.get_group_by_id(group_id)


def get_group_by_token(token: str) -> dict | None:
    return sheets.get_group_by_token(token)


def get_user_groups(user_id: int) -> list[dict]:
    memberships = [m for m in sheets.get_all_group_members() if m["user_id"] == user_id]
    group_ids = {m["group_id"] for m in memberships}
    return [g for g in sheets.get_all_groups() if g["id"] in group_ids]


def get_group_members(group_id: int) -> list[dict]:
    """Retorna lista de dicts de usuarios que son miembros del grupo."""
    member_rows = sheets.get_members_of_group(group_id)
    user_ids = {m["user_id"] for m in member_rows}
    return [u for u in sheets.get_all_users() if u["id"] in user_ids]


def is_member(group_id: int, user_id: int) -> bool:
    return sheets.is_member(group_id, user_id)


def create_group(name: str, description: str, owner_id: int) -> dict:
    token = generate_invite_token()
    group = sheets.create_group_in_sheet(name, description, owner_id, token)
    # El owner entra automáticamente como miembro
    sheets.add_member(group["id"], owner_id)
    return group


def join_group(group_id: int, user_id: int) -> tuple[bool, str]:
    if is_member(group_id, user_id):
        return False, "Ya sos miembro de este grupo."
    added = sheets.add_member(group_id, user_id)
    if added:
        return True, "¡Te uniste al grupo!"
    return False, "No se pudo unir al grupo. Intentá de nuevo."


def join_group_by_token(token: str, user_id: int) -> tuple[bool, str, dict | None]:
    group = get_group_by_token(token)
    if not group:
        return False, "El link de invitación no es válido o ya expiró.", None
    success, msg = join_group(group["id"], user_id)
    return success, msg, group


def regenerate_invite_token(group_id: int, owner_id: int) -> tuple[bool, str]:
    group = get_group_by_id(group_id)
    if not group:
        return False, "Grupo no encontrado."
    if group["owner_id"] != owner_id:
        return False, "Solo el creador puede regenerar el link."
    new_token = generate_invite_token()
    sheets.update_group_token(group_id, new_token)
    return True, "Link regenerado exitosamente."
