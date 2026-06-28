"""
routers/admin.py — Endpoints admin para operaciones destructivas
CUIDADO: Solo usar en desarrollo o con validación segura
"""

from fastapi import APIRouter, HTTPException
from db.sheets import get_worksheet, _invalidate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.delete("/delete-user/{user_id}")
def delete_user_completely(user_id: int):
    """Eliminar completamente un usuario y todos sus datos asociados."""

    if user_id != 12:
        raise HTTPException(status_code=400, detail="Solo se puede eliminar el usuario 12")

    print(f"[ADMIN] Eliminando usuario {user_id}...")

    # 1. Eliminar predicciones
    print(f"[1] Eliminando predicciones del usuario {user_id}...")
    ws_preds = get_worksheet("predictions")
    all_preds = ws_preds.get_all_records()
    preds_deleted = 0

    for idx, row in enumerate(all_preds, start=2):
        if int(row.get("user_id", 0)) == user_id:
            ws_preds.delete_rows(idx)
            preds_deleted += 1

    _invalidate("predictions")

    # 2. Eliminar membresías
    print(f"[2] Eliminando membresías del usuario {user_id}...")
    ws_members = get_worksheet("group_members")
    all_members = ws_members.get_all_records()
    members_deleted = 0

    for idx, row in enumerate(all_members, start=2):
        if int(row.get("user_id", 0)) == user_id:
            ws_members.delete_rows(idx)
            members_deleted += 1

    _invalidate("group_members")

    # 3. Eliminar usuario
    print(f"[3] Eliminando cuenta del usuario {user_id}...")
    ws_users = get_worksheet("users")
    all_users = ws_users.get_all_records()
    users_deleted = 0

    for idx, row in enumerate(all_users, start=2):
        if int(row.get("id", 0)) == user_id:
            ws_users.delete_rows(idx)
            users_deleted += 1

    _invalidate("users")

    return {
        "status": "success",
        "message": f"Usuario {user_id} completamente eliminado",
        "stats": {
            "predictions_deleted": preds_deleted,
            "memberships_deleted": members_deleted,
            "users_deleted": users_deleted
        }
    }
