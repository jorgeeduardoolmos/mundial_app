from db import sheets
from modules.predictions import calculate_points


def get_ranking(group_id: int) -> list[dict]:
    """Ranking ordenado por puntos de todos los miembros del grupo."""
    # Miembros del grupo
    member_rows = sheets.get_members_of_group(group_id)
    user_ids = {m["user_id"] for m in member_rows}
    users = [u for u in sheets.get_all_users() if u["id"] in user_ids]

    # Predicciones del grupo
    all_preds = [p for p in sheets.get_all_predictions() if p["group_id"] == group_id]

    # Partidos terminados (para saber si una pred está pendiente)
    all_matches = {m["id"]: m for m in sheets.get_all_matches()}

    rows = []
    for user in users:
        user_preds = [p for p in all_preds if p["user_id"] == user["id"]]
        scored = [p for p in user_preds if p["points_earned"] is not None]
        pending = sum(
            1 for p in user_preds
            if not all_matches.get(p["match_id"], {}).get("is_finished", False)
        )

        total_pts       = sum(p["points_earned"] for p in scored)
        exact_scores    = sum(1 for p in scored if _is_exact(p, all_matches))
        correct_winner  = sum(1 for p in scored if _correct_winner(p, all_matches) and not _is_exact(p, all_matches))
        zero_pts        = sum(1 for p in scored if p["points_earned"] == 0)

        rows.append({
            "user_id":      user["id"],
            "display_name": user["display_name"],
            "username":     user["username"],
            "total_pts":    total_pts,
            "played":       len(scored),
            "pending":      pending,
            "exact_scores": exact_scores,
            "correct_winner": correct_winner,
            "zero_pts":     zero_pts,
        })

    rows.sort(key=lambda x: (-x["total_pts"], -x["played"]))
    return rows


def get_group_stats(group_id: int) -> dict:
    all_matches = sheets.get_all_matches()
    all_preds   = sheets.get_all_predictions()
    finished    = sum(1 for m in all_matches if m["is_finished"])
    scored_preds = sum(1 for p in all_preds
                       if p["group_id"] == group_id and p["points_earned"] is not None)
    return {"matches_finished": finished, "total_predictions": scored_preds}


# ── Helpers ───────────────────────────────────────────────────────────────

def _result(home: int, away: int) -> str:
    if home > away:  return "home"
    if away > home:  return "away"
    return "draw"


def _is_exact(pred: dict, matches: dict) -> bool:
    m = matches.get(pred["match_id"])
    if not m or not m["is_finished"]:
        return False
    return (pred["predicted_home_goals"] == m["home_goals"] and
            pred["predicted_away_goals"] == m["away_goals"])


def _correct_winner(pred: dict, matches: dict) -> bool:
    m = matches.get(pred["match_id"])
    if not m or not m["is_finished"]:
        return False
    return _result(pred["predicted_home_goals"], pred["predicted_away_goals"]) == \
           _result(m["home_goals"], m["away_goals"])
