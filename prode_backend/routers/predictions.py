from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from core.deps import get_current_user
from modules.predictions import (
    save_prediction, get_prediction,
    get_user_predictions_in_group, get_predictions_for_match,
    calculate_points,
)
from modules.matches import get_match_by_id, format_match_datetime_str, get_all_matches

router = APIRouter(prefix="/predictions", tags=["predictions"])


class SavePredictionRequest(BaseModel):
    match_id: int
    group_id: int
    predicted_home_goals: int
    predicted_away_goals: int


class PredictionResponse(BaseModel):
    id: int
    match_id: int
    group_id: int
    predicted_home_goals: int
    predicted_away_goals: int
    points_earned: Optional[int]
    match_home_team: str
    match_away_team: str
    match_datetime_str: str
    match_is_finished: bool
    match_home_goals: Optional[int]
    match_away_goals: Optional[int]


def _pred_to_response(p: dict, m: dict) -> PredictionResponse:
    # Calcular puntos on-the-fly desde los resultados actuales del sheet
    if m["is_finished"] and m["home_goals"] is not None and m["away_goals"] is not None:
        pts = calculate_points(
            p["predicted_home_goals"], p["predicted_away_goals"],
            m["home_goals"], m["away_goals"],
        )
    else:
        pts = None
    return PredictionResponse(
        id=p["id"],
        match_id=p["match_id"],
        group_id=p["group_id"],
        predicted_home_goals=p["predicted_home_goals"],
        predicted_away_goals=p["predicted_away_goals"],
        points_earned=pts,
        match_home_team=m["home_team"],
        match_away_team=m["away_team"],
        match_datetime_str=format_match_datetime_str(m["match_datetime"]),
        match_is_finished=m["is_finished"],
        match_home_goals=m["home_goals"],
        match_away_goals=m["away_goals"],
    )


@router.post("", status_code=200)
def save(body: SavePredictionRequest, user: dict = Depends(get_current_user)):
    from db.sheets import get_all_group_members, save_prediction_in_sheet, _invalidate, get_prediction as db_get_prediction
    from modules.predictions import is_open_for_prediction

    # Validar que el partido está abierto
    match = get_match_by_id(body.match_id)
    if not match:
        raise HTTPException(status_code=400, detail="Partido no encontrado.")
    if not is_open_for_prediction(match):
        raise HTTPException(status_code=400, detail="El partido ya no acepta predicciones (menos de 1 hora o ya terminó).")

    # Guardar en el grupo solicitado + otros grupos del usuario (sin invalidar caché después de cada uno)
    group_ids = {body.group_id}
    other_group_ids = {
        m["group_id"] for m in get_all_group_members()
        if m["user_id"] == user["id"] and m["group_id"] != body.group_id
    }
    group_ids.update(other_group_ids)

    for gid in group_ids:
        ok, msg = save_prediction_in_sheet(user["id"], body.match_id, gid,
                                           body.predicted_home_goals, body.predicted_away_goals,
                                           invalidate=False)
        if not ok and gid == body.group_id:
            raise HTTPException(status_code=400, detail=msg)

    # Invalidar caché UNA SOLA VEZ al final
    _invalidate("predictions")

    pred = db_get_prediction(user["id"], body.match_id, body.group_id)
    return {"message": f"¡Predicción guardada en {len(group_ids)} grupo(s)!", "prediction": _pred_to_response(pred, match)}


@router.get("", response_model=list[PredictionResponse])
def list_my_predictions(group_id: int = Query(...), user: dict = Depends(get_current_user)):
    preds = get_user_predictions_in_group(user["id"], group_id)
    matches_by_id = {m["id"]: m for m in get_all_matches()}
    return [_pred_to_response(p, matches_by_id[p["match_id"]]) for p in preds
            if p["match_id"] in matches_by_id]


@router.delete("/{match_id}", status_code=200)
def delete_prediction(match_id: int, group_id: int = Query(...), user: dict = Depends(get_current_user)):
    from db.sheets import delete_prediction_in_sheet, _invalidate
    ok, msg = delete_prediction_in_sheet(user["id"], match_id, group_id)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    _invalidate("predictions")
    return {"message": "Predicción eliminada"}


@router.get("/match/{match_id}")
def list_match_predictions(
    match_id: int,
    group_id: int = Query(...),
    user: dict = Depends(get_current_user),
):
    """Devuelve los pronósticos de todos los miembros del grupo para un partido."""
    from db.sheets import get_user_by_id, get_members_of_group
    match = get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Partido no encontrado.")
    preds = get_predictions_for_match(match_id, group_id)
    preds_by_user = {p["user_id"]: p for p in preds}
    members = get_members_of_group(group_id)
    result = []
    for m in members:
        u = get_user_by_id(m["user_id"])
        if not u:
            continue
        p = preds_by_user.get(m["user_id"])
        # Calcular puntos on-the-fly si el partido está terminado
        pts = None
        if p and match["is_finished"] and match["home_goals"] is not None and match["away_goals"] is not None:
            pts = calculate_points(
                p["predicted_home_goals"], p["predicted_away_goals"],
                match["home_goals"], match["away_goals"],
            )
        result.append({
            "user_id":              m["user_id"],
            "display_name":         u.get("display_name") or u.get("username", ""),
            "predicted_home_goals": p["predicted_home_goals"] if p else None,
            "predicted_away_goals": p["predicted_away_goals"] if p else None,
            "points_earned":        pts,
        })
    return result
