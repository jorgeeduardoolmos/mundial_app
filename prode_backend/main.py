"""
Prode Mundial 2026 — Backend FastAPI
=====================================
Punto de entrada de la aplicación.

Para correr en local:
    pip install -r requirements.txt
    uvicorn main:app --reload

Documentación automática:
    http://localhost:8000/docs      ← Swagger UI (podés probar endpoints)
    http://localhost:8000/redoc     ← ReDoc
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from db.models import init_db, SessionLocal
from db.seed import seed_matches
from routers import auth, groups, matches, predictions, ranking

app = FastAPI(
    title="Prode Mundial 2026",
    description="API REST para el prode del Mundial 2026",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────
# CORS = Cross-Origin Resource Sharing
# El browser bloquea por seguridad llamadas entre dominios distintos.
# Acá le decimos al backend qué frontends tienen permiso.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",        # desarrollo local
        "http://localhost:5500",        # Live Server de VSCode
        "http://127.0.0.1:5500",
        "https://mundial-app-prode-frontend.vercel.app",  # reemplazar al deployar
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────
# Cada router maneja una sección de la API
app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(matches.router)
app.include_router(predictions.router)
app.include_router(ranking.router)


# ── Startup ───────────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    """Se ejecuta una sola vez cuando arranca el servidor."""
    init_db()                    # crea las tablas si no existen
    db = SessionLocal()
    try:
        inserted = seed_matches(db)
        if inserted:
            print(f"✓ {inserted} partidos cargados en la DB")
        # Migración: renombrar "Semifinales" TBDs a "4tos de final"
        result = db.execute(text(
            "UPDATE matches SET stage='4tos de final' WHERE stage='Semifinales' AND home_team LIKE 'Semi TBD%'"
        ))
        if result.rowcount:
            db.commit()
            print(f"✓ {result.rowcount} partidos migrados a '4tos de final'")
    finally:
        db.close()


# ── Health check ──────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    """Endpoint de prueba — Railway lo usa para verificar que la app está viva."""
    return {"status": "ok", "app": "Prode Mundial 2026"}
