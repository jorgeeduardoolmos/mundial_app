"""
db/sheets.py — Capa de datos con Google Sheets
================================================
Reemplaza SQLAlchemy + PostgreSQL.
Cada pestaña del spreadsheet es una "tabla":
  users | matches | groups | group_members | predictions

Configuración (variables de entorno en Railway):
  GOOGLE_SHEETS_CREDS  → contenido JSON del Service Account
  GOOGLE_SHEET_ID      → ID del spreadsheet (de la URL de la planilla)
"""
import os
import json
import time
import gspread
import gspread.utils
from google.oauth2.service_account import Credentials
from datetime import datetime

# ── Conexión ───────────────────────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
]

_spreadsheet = None


def _get_spreadsheet():
    global _spreadsheet
    if _spreadsheet is not None:
        return _spreadsheet

    creds_json = os.environ.get("GOOGLE_SHEETS_CREDS")
    if not creds_json:
        raise RuntimeError("Falta la variable GOOGLE_SHEETS_CREDS en Railway.")

    creds_dict = json.loads(creds_json)
    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
    client = gspread.authorize(creds)

    sheet_id = os.environ.get("GOOGLE_SHEET_ID")
    if not sheet_id:
        raise RuntimeError("Falta la variable GOOGLE_SHEET_ID en Railway.")

    _spreadsheet = client.open_by_key(sheet_id)
    return _spreadsheet


def get_worksheet(name: str) -> gspread.Worksheet:
    return _get_spreadsheet().worksheet(name)


# ── Caché en memoria (10 seg TTL) ─────────────────────────────────────────
# Evita martillar la Sheets API en cada request.

_cache: dict[str, tuple[list, float]] = {}
_CACHE_TTL = 10  # segundos


def _get_records(tab: str) -> list[dict]:
    now = time.time()
    if tab in _cache:
        data, ts = _cache[tab]
        if now - ts < _CACHE_TTL:
            return data
    ws = get_worksheet(tab)
    data = ws.get_all_records()
    _cache[tab] = (data, now)
    return data


def _invalidate(tab: str):
    _cache.pop(tab, None)


# ── Setup: crear pestañas si no existen ───────────────────────────────────

HEADERS = {
    "users":        ["id", "username", "email", "hashed_password", "display_name", "is_active", "created_at"],
    "matches":      ["id", "home_team", "away_team", "match_datetime", "stage", "home_goals", "away_goals", "is_finished"],
    "groups":       ["id", "name", "description", "invite_token", "owner_id", "created_at"],
    "group_members":["id", "group_id", "user_id", "joined_at"],
    "predictions":  ["id", "user_id", "match_id", "group_id", "predicted_home_goals", "predicted_away_goals", "points_earned", "created_at", "updated_at"],
}


def ensure_worksheets():
    """Crea las pestañas requeridas si no existen y les pone encabezados."""
    sp = _get_spreadsheet()
    existing = {ws.title for ws in sp.worksheets()}
    for name, headers in HEADERS.items():
        if name not in existing:
            ws = sp.add_worksheet(title=name, rows=2000, cols=len(headers))
            ws.append_row(headers)
            print(f"  ✓ Pestaña '{name}' creada.")
        else:
            ws = sp.worksheet(name)
            if not ws.row_values(1):
                ws.append_row(headers)


# ── Helpers de conversión ─────────────────────────────────────────────────

def _bool(val) -> bool:
    return str(val).upper() in ("TRUE", "1", "YES")


def _int_or_none(val) -> int | None:
    return int(val) if str(val).strip() not in ("", "None") else None


def _parse_dt(val) -> datetime:
    return datetime.fromisoformat(str(val))


# ── USERS ─────────────────────────────────────────────────────────────────

def _cook_user(r: dict) -> dict:
    return {
        "id":             int(r["id"]),
        "username":       str(r["username"]),
        "email":          str(r["email"]),
        "hashed_password":str(r["hashed_password"]),
        "display_name":   str(r["display_name"]),
        "is_active":      _bool(r.get("is_active", True)),
        "created_at":     str(r.get("created_at", "")),
    }


def get_all_users() -> list[dict]:
    return [_cook_user(r) for r in _get_records("users")]


def get_user_by_id(user_id: int) -> dict | None:
    return next((u for u in get_all_users() if u["id"] == user_id), None)


def get_user_by_username(username: str) -> dict | None:
    uname = username.strip().lower()
    return next((u for u in get_all_users() if u["username"].lower() == uname), None)


def get_user_by_email(email: str) -> dict | None:
    em = email.strip().lower()
    return next((u for u in get_all_users() if u["email"].lower() == em), None)


def create_user(username: str, email: str, hashed_password: str, display_name: str) -> dict:
    ws = get_worksheet("users")
    users = _get_records("users")
    next_id = max((int(r["id"]) for r in users), default=0) + 1
    now = datetime.utcnow().isoformat()
    ws.append_row([next_id, username.strip().lower(), email.strip().lower(),
                   hashed_password, display_name.strip(), True, now],
                  value_input_option="USER_ENTERED")
    _invalidate("users")
    return {"id": next_id, "username": username.strip().lower(), "email": email.strip().lower(),
            "display_name": display_name.strip(), "is_active": True}


# ── MATCHES ───────────────────────────────────────────────────────────────

def _cook_match(r: dict) -> dict:
    return {
        "id":             int(r["id"]),
        "home_team":      str(r["home_team"]),
        "away_team":      str(r["away_team"]),
        "match_datetime": str(r["match_datetime"]),
        "stage":          str(r["stage"]),
        "home_goals":     _int_or_none(r.get("home_goals", "")),
        "away_goals":     _int_or_none(r.get("away_goals", "")),
        "is_finished":    _bool(r.get("is_finished", False)),
    }


def get_all_matches() -> list[dict]:
    rows = _get_records("matches")
    return [_cook_match(r) for r in sorted(rows, key=lambda r: str(r["match_datetime"]))]


def get_match_by_id(match_id: int) -> dict | None:
    return next((m for m in get_all_matches() if m["id"] == match_id), None)


def set_match_result_in_sheet(match_id: int, home_goals: int, away_goals: int) -> bool:
    ws = get_worksheet("matches")
    rows = ws.get_all_records()
    headers = ws.row_values(1)
    col_hg = headers.index("home_goals") + 1
    col_ag = headers.index("away_goals") + 1
    col_fin = headers.index("is_finished") + 1
    for i, row in enumerate(rows):
        if int(row["id"]) == match_id:
            sheet_row = i + 2
            ws.batch_update([
                {"range": gspread.utils.rowcol_to_a1(sheet_row, col_hg),  "values": [[home_goals]]},
                {"range": gspread.utils.rowcol_to_a1(sheet_row, col_ag),  "values": [[away_goals]]},
                {"range": gspread.utils.rowcol_to_a1(sheet_row, col_fin), "values": [["TRUE"]]},
            ])
            _invalidate("matches")
            return True
    return False


def seed_matches_to_sheet(match_rows: list[list]) -> int:
    """Inserta filas si la hoja de matches está vacía. Retorna cantidad insertada."""
    ws = get_worksheet("matches")
    existing = ws.get_all_records()
    if existing:
        return 0
    ws.append_rows(match_rows, value_input_option="USER_ENTERED")
    _invalidate("matches")
    return len(match_rows)


# ── GROUPS ────────────────────────────────────────────────────────────────

def _cook_group(r: dict) -> dict:
    return {
        "id":           int(r["id"]),
        "name":         str(r["name"]),
        "description":  str(r.get("description", "")),
        "invite_token": str(r["invite_token"]),
        "owner_id":     int(r["owner_id"]),
        "created_at":   str(r.get("created_at", "")),
    }


def get_all_groups() -> list[dict]:
    return [_cook_group(r) for r in _get_records("groups")]


def get_group_by_id(group_id: int) -> dict | None:
    return next((g for g in get_all_groups() if g["id"] == group_id), None)


def get_group_by_token(token: str) -> dict | None:
    return next((g for g in get_all_groups() if g["invite_token"] == token), None)


def create_group_in_sheet(name: str, description: str, owner_id: int, invite_token: str) -> dict:
    ws = get_worksheet("groups")
    groups = _get_records("groups")
    next_id = max((int(r["id"]) for r in groups), default=0) + 1
    now = datetime.utcnow().isoformat()
    ws.append_row([next_id, name.strip(), description.strip(), invite_token, owner_id, now],
                  value_input_option="USER_ENTERED")
    _invalidate("groups")
    return {"id": next_id, "name": name.strip(), "description": description.strip(),
            "invite_token": invite_token, "owner_id": owner_id}


def update_group_token(group_id: int, new_token: str):
    ws = get_worksheet("groups")
    rows = ws.get_all_records()
    headers = ws.row_values(1)
    col = headers.index("invite_token") + 1
    for i, row in enumerate(rows):
        if int(row["id"]) == group_id:
            ws.update_cell(i + 2, col, new_token)
            _invalidate("groups")
            return


# ── GROUP MEMBERS ─────────────────────────────────────────────────────────

def _cook_member(r: dict) -> dict:
    return {
        "id":       int(r["id"]),
        "group_id": int(r["group_id"]),
        "user_id":  int(r["user_id"]),
        "joined_at":str(r.get("joined_at", "")),
    }


def get_all_group_members() -> list[dict]:
    return [_cook_member(r) for r in _get_records("group_members")]


def get_members_of_group(group_id: int) -> list[dict]:
    return [m for m in get_all_group_members() if m["group_id"] == group_id]


def is_member(group_id: int, user_id: int) -> bool:
    return any(m["group_id"] == group_id and m["user_id"] == user_id
               for m in get_all_group_members())


def add_member(group_id: int, user_id: int) -> bool:
    if is_member(group_id, user_id):
        return False
    ws = get_worksheet("group_members")
    members = _get_records("group_members")
    next_id = max((int(r["id"]) for r in members), default=0) + 1
    now = datetime.utcnow().isoformat()
    ws.append_row([next_id, group_id, user_id, now], value_input_option="USER_ENTERED")
    _invalidate("group_members")
    return True


# ── PREDICTIONS ───────────────────────────────────────────────────────────

def _cook_pred(r: dict) -> dict:
    return {
        "id":                   int(r["id"]),
        "user_id":              int(r["user_id"]),
        "match_id":             int(r["match_id"]),
        "group_id":             int(r["group_id"]),
        "predicted_home_goals": int(r["predicted_home_goals"]),
        "predicted_away_goals": int(r["predicted_away_goals"]),
        "points_earned":        _int_or_none(r.get("points_earned", "")),
        "created_at":           str(r.get("created_at", "")),
        "updated_at":           str(r.get("updated_at", "")),
    }


def get_all_predictions() -> list[dict]:
    return [_cook_pred(r) for r in _get_records("predictions")]


def get_prediction(user_id: int, match_id: int, group_id: int) -> dict | None:
    return next((p for p in get_all_predictions()
                 if p["user_id"] == user_id and p["match_id"] == match_id and p["group_id"] == group_id), None)


def get_user_predictions_in_group(user_id: int, group_id: int) -> list[dict]:
    return [p for p in get_all_predictions()
            if p["user_id"] == user_id and p["group_id"] == group_id]


def get_predictions_for_match(match_id: int, group_id: int) -> list[dict]:
    return [p for p in get_all_predictions()
            if p["match_id"] == match_id and p["group_id"] == group_id]


def save_prediction_in_sheet(user_id: int, match_id: int, group_id: int,
                              home_goals: int, away_goals: int) -> tuple[bool, str]:
    existing = get_prediction(user_id, match_id, group_id)
    now = datetime.utcnow().isoformat()

    if existing:
        ws = get_worksheet("predictions")
        rows = ws.get_all_records()
        headers = ws.row_values(1)
        col_hg  = headers.index("predicted_home_goals") + 1
        col_ag  = headers.index("predicted_away_goals") + 1
        col_upd = headers.index("updated_at") + 1
        for i, row in enumerate(rows):
            if (int(row["user_id"]) == user_id and
                    int(row["match_id"]) == match_id and
                    int(row["group_id"]) == group_id):
                sheet_row = i + 2
                ws.batch_update([
                    {"range": gspread.utils.rowcol_to_a1(sheet_row, col_hg),  "values": [[home_goals]]},
                    {"range": gspread.utils.rowcol_to_a1(sheet_row, col_ag),  "values": [[away_goals]]},
                    {"range": gspread.utils.rowcol_to_a1(sheet_row, col_upd), "values": [[now]]},
                ])
                break
        _invalidate("predictions")
        return True, "¡Predicción actualizada!"
    else:
        ws = get_worksheet("predictions")
        preds = _get_records("predictions")
        next_id = max((int(r["id"]) for r in preds), default=0) + 1
        ws.append_row([next_id, user_id, match_id, group_id,
                       home_goals, away_goals, "", now, now],
                      value_input_option="USER_ENTERED")
        _invalidate("predictions")
        return True, "¡Predicción guardada!"


def score_predictions_for_match(match_id: int, home_goals: int, away_goals: int) -> int:
    """Calcula y graba los puntos de todas las predicciones de un partido (batch)."""
    from modules.predictions import calculate_points  # importación diferida
    ws = get_worksheet("predictions")
    rows = ws.get_all_records()
    headers = ws.row_values(1)
    col_pts = headers.index("points_earned") + 1

    updates = []
    for i, row in enumerate(rows):
        if int(row["match_id"]) == match_id:
            pts = calculate_points(
                int(row["predicted_home_goals"]),
                int(row["predicted_away_goals"]),
                home_goals,
                away_goals,
            )
            sheet_row = i + 2
            updates.append({
                "range":  gspread.utils.rowcol_to_a1(sheet_row, col_pts),
                "values": [[pts]],
            })

    if updates:
        ws.batch_update(updates)
        _invalidate("predictions")

    return len(updates)
