#!/usr/bin/env python3
"""
Script para eliminar completamente al usuario 12 del sistema.
Elimina:
1. Todas las predicciones del usuario 12
2. Al usuario 12 de todos los grupos (group_members)
3. La cuenta del usuario 12 (users)
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from prode_backend.db.sheets import get_worksheet, _invalidate

def delete_user_12():
    USER_ID_TO_DELETE = 12

    print("[*] Iniciando eliminacion del usuario 12...")
    print()

    # 1. Eliminar predicciones del usuario 12
    print("[1] Eliminando predicciones del usuario 12...")
    ws_preds = get_worksheet("predictions")
    all_preds = ws_preds.get_all_records()
    rows_to_delete_preds = []

    for idx, row in enumerate(all_preds, start=2):  # start en 2 porque row 1 son headers
        if int(row.get("user_id", 0)) == USER_ID_TO_DELETE:
            rows_to_delete_preds.append(idx)

    # Eliminar de abajo hacia arriba para no cambiar índices
    for row_idx in sorted(rows_to_delete_preds, reverse=True):
        ws_preds.delete_rows(row_idx)
        print(f"   [OK] Prediccion en fila {row_idx} eliminada")

    print(f"   Total predicciones eliminadas: {len(rows_to_delete_preds)}")
    _invalidate("predictions")
    print()

    # 2. Eliminar al usuario de todos los grupos (group_members)
    print("[2] Eliminando al usuario 12 de todos los grupos...")
    ws_members = get_worksheet("group_members")
    all_members = ws_members.get_all_records()
    rows_to_delete_members = []

    for idx, row in enumerate(all_members, start=2):
        if int(row.get("user_id", 0)) == USER_ID_TO_DELETE:
            rows_to_delete_members.append(idx)

    for row_idx in sorted(rows_to_delete_members, reverse=True):
        ws_members.delete_rows(row_idx)
        print(f"   [OK] Membresia en fila {row_idx} eliminada")

    print(f"   Total membresias eliminadas: {len(rows_to_delete_members)}")
    _invalidate("group_members")
    print()

    # 3. Eliminar la cuenta del usuario 12
    print("[3] Eliminando la cuenta del usuario 12...")
    ws_users = get_worksheet("users")
    all_users = ws_users.get_all_records()
    rows_to_delete_users = []

    for idx, row in enumerate(all_users, start=2):
        if int(row.get("id", 0)) == USER_ID_TO_DELETE:
            rows_to_delete_users.append(idx)
            print(f"   Usuario encontrado: {row.get('username')} (ID: {row.get('id')})")

    for row_idx in sorted(rows_to_delete_users, reverse=True):
        ws_users.delete_rows(row_idx)
        print(f"   [OK] Usuario en fila {row_idx} eliminado")

    print(f"   Total usuarios eliminados: {len(rows_to_delete_users)}")
    _invalidate("users")
    print()

    # Resumen
    print("=" * 50)
    print("[SUCCESS] Eliminacion completada!")
    print("=" * 50)
    print(f"Predicciones eliminadas:  {len(rows_to_delete_preds)}")
    print(f"Membresías eliminadas:    {len(rows_to_delete_members)}")
    print(f"Usuarios eliminados:      {len(rows_to_delete_users)}")
    print()
    print("El usuario 12 ha sido completamente removido del sistema.")
    print("Todos los datos de este usuario están eliminados.")
    print()

if __name__ == "__main__":
    try:
        delete_user_12()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
