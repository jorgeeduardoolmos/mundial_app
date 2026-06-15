"""
modules/matches.py
==================
Los partidos (equipos, fechas, fases) vienen de db/matches_data.py (código).
Los resultados (goles) vienen de la pestaña 'results' de Google Sheets.
"""
import copy
from datetime import datetime, timedelta
from db import matches_data, sheets


def _merge_results(base_match: dict) -> dict:
    """Combina un partido hardcodeado con su resultado de Sheets (si existe)."""
    m = copy.copy(base_match)
    results = sheets.get_all_results()
    res = results.get(m["id"])
    if res:
        m["home_goals"]  = res["home_goals"]
        m["away_goals"]  = res["away_goals"]
        m["is_finished"] = True
    return m


def get_all_matches() -> list[dict]:
    results = sheets.get_all_results()
    out = []
    for base in matches_data.ALL_MATCHES:
        m = copy.copy(base)
        res = results.get(m["id"])
        if res:
            m["home_goals"]  = res["home_goals"]
            m["away_goals"]  = res["away_goals"]
            m["is_finished"] = True
        out.append(m)
    return out


def get_match_by_id(match_id: int) -> dict | None:
    base = matches_data.MATCHES_BY_ID.get(match_id)
    if not base:
        return None
    return _merge_results(base)


def is_open_for_prediction(match: dict) -> bool:
    try:
        dt = datetime.fromisoformat(match["match_datetime"])
    except (ValueError, TypeError):
        return False
    now = datetime.utcnow()
    return (not match["is_finished"]) and (dt - now > timedelta(hours=1))


def get_upcoming_matches(limit: int = 10) -> list[dict]:
    now = datetime.utcnow()
    upcoming = [
        m for m in get_all_matches()
        if not m["is_finished"] and datetime.fromisoformat(m["match_datetime"]) >= now
    ]
    return upcoming[:limit]


def set_match_result(match_id: int, home_goals: int, away_goals: int) -> tuple[bool, str]:
    if match_id not in matches_data.MATCHES_BY_ID:
        return False, "Partido no encontrado."
    sheets.set_result_in_sheet(match_id, home_goals, away_goals)
    return True, "Resultado guardado."


def get_stages() -> list[str]:
    seen = []
    for m in matches_data.ALL_MATCHES:
        if m["stage"] not in seen:
            seen.append(m["stage"])
    return seen


def format_match_datetime(dt: datetime) -> str:
    DAYS   = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    MONTHS = ["", "ene", "feb", "mar", "abr", "may", "jun",
              "jul", "ago", "sep", "oct", "nov", "dic"]
    return f"{DAYS[dt.weekday()]} {dt.day} {MONTHS[dt.month]} — {dt.strftime('%H:%M')} hs"


def format_match_datetime_str(dt_str: str) -> str:
    try:
        return format_match_datetime(datetime.fromisoformat(dt_str))
    except Exception:
        return str(dt_str)
