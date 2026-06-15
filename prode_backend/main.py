"""
Prode Mundial 2026 — Backend FastAPI
=====================================
Base de datos: Google Sheets (via gspread)

Variables de entorno requeridas en Railway:
  GOOGLE_SHEETS_CREDS  → JSON completo del Service Account de Google
  GOOGLE_SHEET_ID      → ID del spreadsheet (está en la URL de la planilla)
  SECRET_KEY           → clave secreta para JWT

Para correr en local:
    pip install -r requirements.txt
    uvicorn main:app --reload
"""
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from db.sheets import ensure_worksheets
from db.seed import seed_matches
from routers import auth, groups, matches, predictions, ranking

app = FastAPI(
    title="Prode Mundial 2026",
    description="API REST para el prode del Mundial 2026",
    version="2.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://mundial-app-prode-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Error handler (muestra el error real en lugar de 500 genérico) ────────
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__},
    )

# ── Routers ───────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(matches.router)
app.include_router(predictions.router)
app.include_router(ranking.router)


# ── Startup ───────────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    """Crea las pestañas en Sheets si no existen y carga los partidos."""
    try:
        ensure_worksheets()
        print("✓ Google Sheets conectado.")
        inserted = seed_matches()
        if inserted:
            print(f"✓ {inserted} partidos cargados en la planilla.")
    except Exception as e:
        print(f"⚠ Error en startup: {e}")


# ── Health check ──────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "app": "Prode Mundial 2026", "db": "Google Sheets"}

@app.get("/debug/sheets", tags=["health"])
def debug_sheets():
    """Diagnóstico: prueba la conexión a Google Sheets."""
    import os
    from db.sheets import _get_spreadsheet
    creds = os.environ.get("GOOGLE_SHEETS_CREDS")
    sheet_id = os.environ.get("GOOGLE_SHEET_ID")
    if not creds:
        return {"error": "Falta GOOGLE_SHEETS_CREDS en Railway"}
    if not sheet_id:
        return {"error": "Falta GOOGLE_SHEET_ID en Railway"}
    try:
        sp = _get_spreadsheet()
        tabs = [ws.title for ws in sp.worksheets()]
        return {"status": "ok", "sheet_title": sp.title, "tabs": tabs}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}
