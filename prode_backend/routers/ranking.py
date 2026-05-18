"""
Router de ranking
=================
GET /ranking?group_id=X  → ranking completo de un grupo
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.deps import get_db, get_current_user
from modules.ranking import get_ranking, get_group_stats
from modules.groups import is_member
from db.models import User

router = APIRouter(prefix="/ranking", tags=["ranking"])


class RankingEntry(BaseModel):
    position: int
    user_id: int
    display_name: str
    username: str
    total_pts: int
    played: int
    pending: int
    exact_scores: int
    is_me: bool

class RankingResponse(BaseModel):
    group_id: int
    matches_finished: int
    total_predictions: int
    entries: list[RankingEntry]


@router.get("", response_model=RankingResponse)
def get(
    group_id: int = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not is_member(db, group_id, user.id):
        raise HTTPException(status_code=403, detail="No pertenecés a este grupo.")

    rows = get_ranking(db, group_id)
    stats = get_group_stats(db, group_id)

    entries = [
        RankingEntry(
            position=i + 1,
            user_id=r["user_id"],
            display_name=r["display_name"],
            username=r["username"],
            total_pts=r["total_pts"],
            played=r["played"],
            pending=r["pending"],
            exact_scores=r["exact_scores"],
            is_me=(r["user_id"] == user.id),
        )
        for i, r in enumerate(rows)
    ]

    return RankingResponse(
        group_id=group_id,
        matches_finished=stats["matches_finished"],
        total_predictions=stats["total_predictions"],
        entries=entries,
    )
