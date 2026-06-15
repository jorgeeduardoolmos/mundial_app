from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from core.deps import get_current_user
from modules.predictions import (
    save_prediction, get_prediction,
    get_user_predictions_in_group, get_predictions_for_match,
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
    return PredictionResponse(
        id=p["id"],
        match_id=p["match_id"],
        group_id=p["group_id"],
        predicted_home_goals=p["predicted_home_goals"],
        predicted_away_goals=p["predicted_away_goals"],
        points_earned=p["points_earned"],
        match_home_team=m["home_team"],
        match_away_team=m["away_team"],
        match_datetime_str=format_match_datetime_str(m["match_datetime"]),
        match_is_finished=m["is_finished"],
        match_home_goals=m["home_goals"],
        match_away_goals=m["away_goals"],
    )


@router.post("", status_code=200)
def save(body: SavePredictionRequest, user: dict = Depends(get_current_user)):
    ok, msg = save_prediction(
        user["id"], body.match_id, body.group_id,
        body.predicted_home_goals, body.predicted_away_goals,
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    pred = get_prediction(user["id"], body.match_id, body.group_id)
    match = get_match_by_id(body.match_id)
    return {"message": msg, "prediction": _pred_to_response(pred, match)}


@router.get("", response_model=list[PredictionResponse])
def list_my_predictions(group_id: int = Query(...), user: dict = Depends(get_current_user)):
    preds = get_user_predictions_in_group(user["id"], group_id)
    matches_by_id = {m["id"]: m for m in get_all_matches()}
    return [_pred_to_response(p, matches_by_id[p["match_id"]]) for p in preds
            if p["match_id"] in matches_by_id]


@router.get("/match/{match_id}", response_model=list[PredictionResponse])
def list_match_predictions(
    match_id: int,
    group_id: int = Query(...),
    user: dict = Depends(get_current_user),
):
    match = get_match_by_id(match_id)
    if not match or not match["is_finished"]:
        raise HTTPException(status_code=403, detail="Las predicciones solo se muestran después del partido.")
    preds = get_predictions_for_match(match_id, group_id)
    return [_pred_to_response(p, match) for p in preds]
