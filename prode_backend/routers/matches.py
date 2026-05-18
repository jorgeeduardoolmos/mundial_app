"""
Router de partidos
==================
GET  /matches          → todos los partidos (con filtro opcional por fase)
GET  /matches/upcoming → próximos partidos abiertos para predecir
PUT  /matches/{id}/result → cargar resultado (solo admin)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from core.deps import get_db, get_current_user
from modules.matches import (
    get_all_matches, get_upcoming_matches, get_match_by_id,
    set_match_result, get_stages, is_open_for_prediction,
    format_match_datetime
)
from modules.predictions import score_all_predictions_for_match
from db.models import User

router = APIRouter(prefix="/matches", tags=["matches"])

ADMIN_USERS = {"jorgeeduardoolmos"}


class MatchResponse(BaseModel):
    id: int
    home_team: str
    away_team: str
    match_datetime: datetime
    match_datetime_str: str
    stage: str
    is_finished: bool
    home_goals: Optional[int]
    away_goals: Optional[int]
    is_open: bool

class SetResultRequest(BaseModel):
    home_goals: int
    away_goals: int


def _match_to_response(m) -> MatchResponse:
    return MatchResponse(
        id=m.id,
        home_team=m.home_team,
        away_team=m.away_team,
        match_datetime=m.match_datetime,
        match_datetime_str=format_match_datetime(m.match_datetime),
        stage=m.stage,
        is_finished=m.is_finished,
        home_goals=m.home_goals,
        away_goals=m.away_goals,
        is_open=is_open_for_prediction(m),
    )


@router.get("", response_model=list[MatchResponse])
def list_matches(
    stage: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    matches = get_all_matches(db)
    if stage:
        matches = [m for m in matches if m.stage == stage]
    return [_match_to_response(m) for m in matches]


@router.get("/stages", response_model=list[str])
def list_stages(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_stages(db)


@router.get("/upcoming", response_model=list[MatchResponse])
def upcoming(limit: int = 10, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    matches = get_upcoming_matches(db, limit)
    return [_match_to_response(m) for m in matches]


@router.put("/{match_id}/result")
def set_result(
    match_id: int,
    body: SetResultRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.username not in ADMIN_USERS:
        raise HTTPException(status_code=403, detail="Solo el admin puede cargar resultados.")
    ok, msg = set_match_result(db, match_id, body.home_goals, body.away_goals)
    if not ok:
        raise HTTPException(status_code=404, detail=msg)
    scored = score_all_predictions_for_match(db, match_id)
    return {"message": msg, "predictions_scored": scored}
