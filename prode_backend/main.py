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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
