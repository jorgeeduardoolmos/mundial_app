from sqlalchemy.orm import Session
from sqlalchemy import func
from db.models import Prediction, GroupMember, User, Match


def get_ranking(db: Session, group_id: int) -> list[dict]:
    """
    Retorna lista ordenada por puntos de todos los miembros del grupo.
    Incluye miembros con 0 predicciones también.
    """
    # Todos los miembros del grupo
    members = (
        db.query(User)
        .join(GroupMember, GroupMember.user_id == User.id)
        .filter(GroupMember.group_id == group_id)
        .all()
    )

    rows = []
    for user in members:
        # Predicciones con resultado ya calculado
        preds = (
            db.query(Prediction)
            .filter(
                Prediction.user_id == user.id,
                Prediction.group_id == group_id,
                Prediction.points_earned != None,
            )
            .all()
        )

        total_pts = sum(p.points_earned for p in preds)
        played = len(preds)

        # Desglose de puntos
        exact_scores   = sum(1 for p in preds if _is_exact(p))
        correct_winner = sum(1 for p in preds if _correct_winner(p) and not _is_exact(p))
        zero_pts       = sum(1 for p in preds if p.points_earned == 0)

        # Predicciones pendientes (partidos aún no terminados)
        pending = (
            db.query(Prediction)
            .join(Match, Match.id == Prediction.match_id)
            .filter(
                Prediction.user_id == user.id,
                Prediction.group_id == group_id,
                Match.is_finished == False,
            )
            .count()
        )

        rows.append({
            "user_id": user.id,
            "display_name": user.display_name,
            "username": user.username,
            "total_pts": total_pts,
            "played": played,
            "pending": pending,
            "exact_scores": exact_scores,
            "correct_winner": correct_winner,
            "zero_pts": zero_pts,
        })

    # Ordenar: primero por puntos, desempate por menos partidos jugados (más eficiente)
    rows.sort(key=lambda x: (-x["total_pts"], -x["played"]))
    return rows


def _is_exact(pred: Prediction) -> bool:
    """Marcador exacto: máximos puntos posibles."""
    m = pred.match
    if not m.is_finished:
        return False
    return (
        pred.predicted_home_goals == m.home_goals and
        pred.predicted_away_goals == m.away_goals
    )


def _correct_winner(pred: Prediction) -> bool:
    m = pred.match
    if not m.is_finished:
        return False
    pred_res = _result(pred.predicted_home_goals, pred.predicted_away_goals)
    real_res = _result(m.home_goals, m.away_goals)
    return pred_res == real_res


def _result(home: int, away: int) -> str:
    if home > away:
        return "home"
    elif away > home:
        return "away"
    return "draw"


def get_group_stats(db: Session, group_id: int) -> dict:
    """Estadísticas generales del grupo."""
    total_matches_finished = (
        db.query(Match)
        .filter(Match.is_finished == True)
        .count()
    )
    total_predictions = (
        db.query(Prediction)
        .filter(
            Prediction.group_id == group_id,
            Prediction.points_earned != None,
        )
        .count()
    )
    return {
        "matches_finished": total_matches_finished,
        "total_predictions": total_predictions,
    }
