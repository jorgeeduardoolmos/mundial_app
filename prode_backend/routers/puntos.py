from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.deps import get_current_user
from db import sheets

router = APIRouter(prefix="/puntos", tags=["puntos"])


@router.get("")
def get_puntos_zona_grupos(user: dict = Depends(get_current_user)):
    """Lee la solapa 'Puntos zona de grupos' del Google Sheet."""
    try:
        data = sheets.get_puntos_zona_grupos()
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e), "data": []}
