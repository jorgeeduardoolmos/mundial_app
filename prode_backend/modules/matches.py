from datetime import datetime, timedelta
from db import sheets


def get_all_matches() -> list[dict]:
    return sheets.get_all_matches()


def get_match_by_id(match_id: int) -> dict | None:
    return sheets.get_match_by_id(match_id)


def is_open_for_prediction(match: dict) -> bool:
    """Un partido acepta predicciones hasta 1 hora antes del inicio."""
    try:
        dt = datetime.fromisoformat(match["match_datetime"])
    except Exception:
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
    ok = sheets.set_match_result_in_sheet(match_id, home_goals, away_goals)
    if not ok:
        return False, "Partido no encontrado."
    return True, "Resultado guardado."


def get_stages() -> list[str]:
    matches = get_all_matches()
    seen = []
    for m in matches:
        if m["stage"] not in seen:
            seen.append(m["stage"])
    return seen


def format_match_datetime(dt: datetime) -> str:
    DAYS   = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    MONTHS = ["", "ene", "feb", "mar", "abr", "may", "jun",
              "jul", "ago", "sep", "oct", "nov", "dic"]
    day_name = DAYS[dt.weekday()]
    return f"{day_name} {dt.day} {MONTHS[dt.month]} — {dt.strftime('%H:%M')} hs"


def format_match_datetime_str(dt_str: str) -> str:
    try:
        return format_match_datetime(datetime.fromisoformat(dt_str))
    except Exception:
        return str(dt_str)
