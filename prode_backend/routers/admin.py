"""
routers/admin.py — Endpoints admin para operaciones destructivas
CUIDADO: Solo usar en desarrollo o con validación segura
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.sheets import get_worksheet, _invalidate, _get_records

router = APIRouter(prefix="/admin", tags=["admin"])


class DeletePredictionsRequest(BaseModel):
    display_names: list[str]


class DeletePredictionsbyUserIdRequest(BaseModel):
    user_ids: list[int]


class DeleteUsersRequest(BaseModel):
    user_ids: list[int]


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


@router.post("/delete-predictions-by-name")
def delete_predictions_by_name(body: DeletePredictionsRequest):
    """Eliminar predicciones de usuarios por display_name."""

    print(f"[ADMIN] Eliminando predicciones de: {body.display_names}")

    # Obtener user_ids por display_name
    all_users = _get_records("users")
    user_ids_to_delete = []
    for user in all_users:
        if user.get("display_name") in body.display_names:
            user_ids_to_delete.append(int(user.get("id", 0)))

    if not user_ids_to_delete:
        raise HTTPException(status_code=400, detail=f"No se encontraron usuarios: {body.display_names}")

    print(f"User IDs encontrados: {user_ids_to_delete}")

    # Eliminar predicciones de esos usuarios
    ws_preds = get_worksheet("predictions")
    all_preds = _get_records("predictions")
    rows_to_delete = []

    for idx, row in enumerate(all_preds, start=2):
        if int(row.get("user_id", 0)) in user_ids_to_delete:
            rows_to_delete.append(idx)

    # Eliminar de abajo hacia arriba para no cambiar índices
    for row_idx in sorted(rows_to_delete, reverse=True):
        ws_preds.delete_rows(row_idx)
        print(f"   [OK] Predicción en fila {row_idx} eliminada")

    print(f"Total predicciones eliminadas: {len(rows_to_delete)}")
    _invalidate("predictions")

    return {
        "status": "success",
        "message": f"Predicciones eliminadas para {len(user_ids_to_delete)} usuario(s)",
        "stats": {
            "users_affected": user_ids_to_delete,
            "predictions_deleted": len(rows_to_delete)
        }
    }


@router.post("/delete-predictions-by-user-id")
def delete_predictions_by_user_id(body: DeletePredictionsbyUserIdRequest):
    """Eliminar predicciones de usuarios por user_id."""

    print(f"[ADMIN] Eliminando predicciones de user_ids: {body.user_ids}")

    # Eliminar predicciones de esos usuarios
    ws_preds = get_worksheet("predictions")
    all_preds = _get_records("predictions")
    rows_to_delete = []

    for idx, row in enumerate(all_preds, start=2):
        if int(row.get("user_id", 0)) in body.user_ids:
            rows_to_delete.append(idx)

    # Eliminar de abajo hacia arriba para no cambiar índices
    for row_idx in sorted(rows_to_delete, reverse=True):
        ws_preds.delete_rows(row_idx)
        print(f"   [OK] Predicción en fila {row_idx} eliminada")

    print(f"Total predicciones eliminadas: {len(rows_to_delete)}")
    _invalidate("predictions")

    return {
        "status": "success",
        "message": f"Predicciones eliminadas para {len(body.user_ids)} usuario(s)",
        "stats": {
            "user_ids": body.user_ids,
            "predictions_deleted": len(rows_to_delete)
        }
    }


@router.post("/delete-users-completely")
def delete_users_completely(body: DeleteUsersRequest):
    """Eliminar completamente múltiples usuarios y todos sus datos asociados."""

    print(f"[ADMIN] Eliminando completamente usuarios: {body.user_ids}")

    stats = {
        "predictions_deleted": 0,
        "memberships_deleted": 0,
        "users_deleted": 0
    }

    # 1. Eliminar predicciones
    print(f"[1] Eliminando predicciones...")
    ws_preds = get_worksheet("predictions")
    all_preds = _get_records("predictions")
    rows_to_delete = []
    for idx, row in enumerate(all_preds, start=2):
        if int(row.get("user_id", 0)) in body.user_ids:
            rows_to_delete.append(idx)
    for row_idx in sorted(rows_to_delete, reverse=True):
        ws_preds.delete_rows(row_idx)
    stats["predictions_deleted"] = len(rows_to_delete)
    _invalidate("predictions")
    print(f"   Total predicciones eliminadas: {len(rows_to_delete)}")

    # 2. Eliminar membresías
    print(f"[2] Eliminando membresías...")
    ws_members = get_worksheet("group_members")
    all_members = _get_records("group_members")
    rows_to_delete = []
    for idx, row in enumerate(all_members, start=2):
        if int(row.get("user_id", 0)) in body.user_ids:
            rows_to_delete.append(idx)
    for row_idx in sorted(rows_to_delete, reverse=True):
        ws_members.delete_rows(row_idx)
    stats["memberships_deleted"] = len(rows_to_delete)
    _invalidate("group_members")
    print(f"   Total membresías eliminadas: {len(rows_to_delete)}")

    # 3. Eliminar usuarios
    print(f"[3] Eliminando cuentas...")
    ws_users = get_worksheet("users")
    all_users = _get_records("users")
    rows_to_delete = []
    for idx, row in enumerate(all_users, start=2):
        if int(row.get("id", 0)) in body.user_ids:
            rows_to_delete.append(idx)
    for row_idx in sorted(rows_to_delete, reverse=True):
        ws_users.delete_rows(row_idx)
    stats["users_deleted"] = len(rows_to_delete)
    _invalidate("users")
    print(f"   Total usuarios eliminados: {len(rows_to_delete)}")

    return {
        "status": "success",
        "message": f"{len(body.user_ids)} usuario(s) completamente eliminado(s)",
        "stats": stats
    }
