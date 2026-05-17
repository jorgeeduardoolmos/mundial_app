from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db.models import Prediction, Match, User, Group
from modules.matches import is_open_for_prediction, get_match_by_id


# ── Queries ───────────────────────────────────────────────────────────────

def get_prediction(db: Session, user_id: int, match_id: int, group_id: int) -> Prediction | None:
    return (
        db.query(Prediction)
        .filter(
            Prediction.user_id == user_id,
            Prediction.match_id == match_id,
            Prediction.group_id == group_id,
        )
        .first()
    )


def get_predictions_for_match(db: Session, match_id: int, group_id: int) -> list[Prediction]:
    return (
        db.query(Prediction)
        .filter(Prediction.match_id == match_id, Prediction.group_id == group_id)
        .all()
    )


def get_user_predictions_in_group(db: Session, user_id: int, group_id: int) -> list[Prediction]:
    return (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id, Prediction.group_id == group_id)
        .all()
    )


# ── Save / Edit ───────────────────────────────────────────────────────────

def save_prediction(
    db: Session,
    user_id: int,
    match_id: int,
    group_id: int,
    home_goals: int,
    away_goals: int,
) -> tuple[bool, str]:

    match = get_match_by_id(db, match_id)
    if not match:
        return False, "Partido no encontrado."
    if not is_open_for_prediction(match):
        return False, "El partido ya no acepta predicciones (menos de 1 hora o ya terminó)."

    existing = get_prediction(db, user_id, match_id, group_id)

    if existing:
        existing.predicted_home_goals = home_goals
        existing.predicted_away_goals = away_goals
        existing.updated_at = datetime.utcnow()
        db.commit()
        return True, "¡Predicción actualizada!"
    else:
        pred = Prediction(
            user_id=user_id,
            match_id=match_id,
            group_id=group_id,
            predicted_home_goals=home_goals,
            predicted_away_goals=away_goals,
        )
        db.add(pred)
        try:
            db.commit()
            return True, "¡Predicción guardada!"
        except IntegrityError:
            db.rollback()
            return False, "Error al guardar. Intentá de nuevo."


# ── Points calculation ────────────────────────────────────────────────────

def calculate_points(
    pred_home: int,
    pred_away: int,
    real_home: int,
    real_away: int,
) -> int:
    """
    Reglas:
    - Acertaste quién ganó (o que fue empate): 2 pts
    - Acertaste goles del ganador: 2 pts
    - Acertaste goles del perdedor: 2 pts
    - Empate: si además acertaste los goles exactos de ambos: 4 pts extra
    """
    points = 0

    pred_result = _result(pred_home, pred_away)
    real_result = _result(real_home, real_away)

    # Acertaste el resultado (ganador o empate)
    if pred_result == real_result:
        points += 2

        # Partido empatado: puntos por marcador exacto
        if real_result == "draw":
            if pred_home == real_home and pred_away == real_away:
                points += 4
        else:
            # Acertaste goles del ganador
            winner_pred = pred_home if real_result == "home" else pred_away
            winner_real = real_home if real_result == "home" else real_away
            if winner_pred == winner_real:
                points += 2

            # Acertaste goles del perdedor
            loser_pred = pred_away if real_result == "home" else pred_home
            loser_real = real_away if real_result == "home" else real_home
            if loser_pred == loser_real:
                points += 2

    return points


def _result(home: int, away: int) -> str:
    if home > away:
        return "home"
    elif away > home:
        return "away"
    return "draw"


def score_prediction(db: Session, prediction: Prediction) -> int:
    """Calcula y guarda los puntos de una predicción ya con resultado."""
    match = prediction.match
    if not match.is_finished:
        return 0

    pts = calculate_points(
        prediction.predicted_home_goals,
        prediction.predicted_away_goals,
        match.home_goals,
        match.away_goals,
    )
    prediction.points_earned = pts
    db.commit()
    return pts


def score_all_predictions_for_match(db: Session, match_id: int) -> int:
    """Llama cuando se carga un resultado. Puntúa todas las predicciones del partido."""
    preds = db.query(Prediction).filter(Prediction.match_id == match_id).all()
    total = 0
    for pred in preds:
        total += score_prediction(db, pred)
    return total
