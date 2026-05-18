from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db.models import Match


def get_all_matches(db: Session) -> list[Match]:
    return db.query(Match).order_by(Match.match_datetime).all()


def get_matches_by_stage(db: Session, stage: str) -> list[Match]:
    return (
        db.query(Match)
        .filter(Match.stage == stage)
        .order_by(Match.match_datetime)
        .all()
    )


def get_upcoming_matches(db: Session, limit: int = 10) -> list[Match]:
    now = datetime.utcnow() + timedelta(hours=-3)  # UTC-3
    return (
        db.query(Match)
        .filter(Match.is_finished == False, Match.match_datetime >= now)
        .order_by(Match.match_datetime)
        .limit(limit)
        .all()
    )


def get_match_by_id(db: Session, match_id: int) -> Match | None:
    return db.query(Match).filter(Match.id == match_id).first()


def is_open_for_prediction(match: Match) -> bool:
    """Un partido acepta predicciones hasta 1 hora antes."""
    now = datetime.utcnow() + timedelta(hours=-3)
    return (not match.is_finished) and (match.match_datetime - now > timedelta(hours=1))


def set_match_result(db: Session, match_id: int, home_goals: int, away_goals: int) -> tuple[bool, str]:
    match = get_match_by_id(db, match_id)
    if not match:
        return False, "Partido no encontrado."
    match.home_goals = home_goals
    match.away_goals = away_goals
    match.is_finished = True
    db.commit()
    return True, "Resultado guardado."


def get_stages(db: Session) -> list[str]:
    rows = db.query(Match.stage, Match.match_datetime).order_by(Match.match_datetime).all()
    seen = []
    for stage, _ in rows:
        if stage not in seen:
            seen.append(stage)
    return seen


def format_match_datetime(dt: datetime) -> str:
    DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    MONTHS = ["", "ene", "feb", "mar", "abr", "may", "jun",
              "jul", "ago", "sep", "oct", "nov", "dic"]
    day_name = DAYS[dt.weekday()]
    return f"{day_name} {dt.day} {MONTHS[dt.month]} — {dt.strftime('%H:%M')} hs"
