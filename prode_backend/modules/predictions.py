from db import sheets
from modules.matches import get_match_by_id, is_open_for_prediction


# ── Points calculation ─────────────────────────────────────────────────────

def calculate_points(pred_home: int, pred_away: int, real_home: int, real_away: int) -> int:
    """
    Reglas (fase de grupos):
    - Acertaste quién ganó (o empate): 4 pts
    - Acertaste goles del ganador:     2 pts  (solo si hubo ganador)
    - Acertaste goles del perdedor:    2 pts  (solo si hubo ganador)
    Máx: 8 pts (partido con ganador) / 4 pts (empate)
    """
    points = 0
    pred_result = _result(pred_home, pred_away)
    real_result = _result(real_home, real_away)

    if pred_result == real_result:
        points += 4
        if real_result != "draw":
            winner_pred = pred_home if real_result == "home" else pred_away
            winner_real = real_home if real_result == "home" else real_away
            if winner_pred == winner_real:
                points += 2
            loser_pred = pred_away if real_result == "home" else pred_home
            loser_real = real_away if real_result == "home" else real_home
            if loser_pred == loser_real:
                points += 2
    return points


def _result(home: int, away: int) -> str:
    if home > away:  return "home"
    if away > home:  return "away"
    return "draw"


# ── CRUD ──────────────────────────────────────────────────────────────────

def get_prediction(user_id: int, match_id: int, group_id: int) -> dict | None:
    return sheets.get_prediction(user_id, match_id, group_id)


def get_user_predictions_in_group(user_id: int, group_id: int) -> list[dict]:
    return sheets.get_user_predictions_in_group(user_id, group_id)


def get_predictions_for_match(match_id: int, group_id: int) -> list[dict]:
    return sheets.get_predictions_for_match(match_id, group_id)


def save_prediction(user_id: int, match_id: int, group_id: int,
                    home_goals: int, away_goals: int) -> tuple[bool, str]:
    match = get_match_by_id(match_id)
    if not match:
        return False, "Partido no encontrado."
    if not is_open_for_prediction(match):
        return False, "El partido ya no acepta predicciones (menos de 1 hora o ya terminó)."
    return sheets.save_prediction_in_sheet(user_id, match_id, group_id, home_goals, away_goals)


def score_all_predictions_for_match(match_id: int) -> int:
    """Llama cuando se carga un resultado. Puntúa todas las predicciones del partido."""
    match = get_match_by_id(match_id)
    if not match or not match["is_finished"]:
        return 0
    return sheets.score_predictions_for_match(
        match_id, match["home_goals"], match["away_goals"]
    )
