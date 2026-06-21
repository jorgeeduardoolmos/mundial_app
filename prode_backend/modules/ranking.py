from db import sheets
from modules.predictions import calculate_points
from modules.matches import get_all_matches as _get_all_matches


def get_ranking(group_id: int) -> list[dict]:
    """Ranking calculado on-the-fly desde los resultados del sheet.
    No depende de points_earned guardado — funciona aunque los resultados
    se carguen directo en el Excel."""
    member_rows = sheets.get_members_of_group(group_id)
    user_ids    = {m["user_id"] for m in member_rows}
    users       = [u for u in sheets.get_all_users() if u["id"] in user_ids]

    all_preds   = [p for p in sheets.get_all_predictions() if p["group_id"] == group_id]
    all_matches = {m["id"]: m for m in _get_all_matches()}

    rows = []
    for user in users:
        user_preds = [p for p in all_preds if p["user_id"] == user["id"]]

        total_pts      = 0
        played         = 0
        pending        = 0
        exact_scores   = 0
        correct_winner = 0
        zero_pts       = 0

        for p in user_preds:
            m = all_matches.get(p["match_id"])
            if not m:
                continue
            if m["is_finished"]:
                pts = calculate_points(
                    p["predicted_home_goals"], p["predicted_away_goals"],
                    m["home_goals"], m["away_goals"],
                )
                total_pts += pts
                played    += 1
                if pts >= 6:
                    exact_scores += 1
                elif _result(p["predicted_home_goals"], p["predicted_away_goals"]) == \
                     _result(m["home_goals"], m["away_goals"]):
                    correct_winner += 1
                if pts == 0:
                    zero_pts += 1
            else:
                pending += 1

        rows.append({
            "user_id":        user["id"],
            "display_name":   user["display_name"],
            "username":       user["username"],
            "total_pts":      total_pts,
            "played":         played,
            "pending":        pending,
            "exact_scores":   exact_scores,
            "correct_winner": correct_winner,
            "zero_pts":       zero_pts,
        })

    rows.sort(key=lambda x: (-x["total_pts"], -x["played"]))
    return rows


def get_group_stats(group_id: int) -> dict:
    all_matches = _get_all_matches()
    all_preds   = sheets.get_all_predictions()
    finished    = sum(1 for m in all_matches if m["is_finished"])
    scored_preds = sum(
        1 for p in all_preds
        if p["group_id"] == group_id and all_matches
    )
    return {"matches_finished": finished, "total_predictions": scored_preds}


def _result(home: int, away: int) -> str:
    if home > away: return "home"
    if away > home: return "away"
    return "draw"
