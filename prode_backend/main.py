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
    except Exception as e:
        print(f"⚠ Error en startup: {e}")


# ── Health check ──────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "app": "Prode Mundial 2026", "db": "Google Sheets"}

@app.get("/debug/results", tags=["health"])
def debug_results():
    """Diagnóstico: muestra el contenido real de la pestaña results."""
    try:
        from db.sheets import get_worksheet, get_all_results
        ws = get_worksheet("results")
        headers = ws.row_values(1)
        all_values = ws.get_all_values()
        rows = all_values[:8]  # header + primeras 7 filas
        parsed = get_all_results()
        return {
            "headers_row1": headers,
            "raw_rows": rows,
            "total_data_rows": len(all_values) - 1,
            "parsed_results_count": len(parsed),
            "parsed_sample": dict(list(parsed.items())[:5]),
        }
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}

@app.get("/admin/preview-id-migration", tags=["admin"])
def preview_id_migration():
    """Muestra exactamente qué cambios se harían en predictions y results antes de migrar."""
    from db.sheets import get_worksheet
    OLD_TO_NEW = {
        1:1,  2:2,  3:26, 4:27, 5:53, 6:54,
        7:3,  8:6,  9:25, 10:28,11:49,12:50,
        13:5, 14:7, 15:31,16:32,17:51,18:52,
        19:4, 20:10,21:29,22:30,23:59,24:60,
        25:11,26:12,27:34,28:35,29:55,30:56,
        31:9, 32:8, 33:33,34:36,35:57,36:58,
        37:14,38:16,39:39,40:40,41:65,42:66,
        43:13,44:15,45:37,46:38,47:63,48:64,
        49:17,50:18,51:42,52:43,53:61,54:62,
        55:19,56:20,57:41,58:44,59:71,60:72,
        61:21,62:24,63:45,64:48,65:69,66:70,
        67:22,68:23,69:46,70:47,71:67,72:68,
    }
    # Preview predictions
    pred_ws = get_worksheet("predictions")
    pred_rows = pred_ws.get_all_values()
    pred_headers = pred_rows[0] if pred_rows else []
    try:
        mid_col = pred_headers.index("match_id")
    except ValueError:
        return {"error": "No se encontró columna match_id en predictions"}
    pred_changes = []
    for i, row in enumerate(pred_rows[1:], start=2):
        try:
            old_id = int(row[mid_col])
            if old_id in OLD_TO_NEW and OLD_TO_NEW[old_id] != old_id:
                pred_changes.append({"row": i, "old_match_id": old_id, "new_match_id": OLD_TO_NEW[old_id]})
        except (ValueError, IndexError):
            pass
    # Preview results
    res_ws = get_worksheet("results")
    res_rows = res_ws.get_all_values()
    res_headers = res_rows[0] if res_rows else []
    id_col_name = "id" if "id" in res_headers else "match_id"
    try:
        id_col = res_headers.index(id_col_name)
    except ValueError:
        return {"error": f"No se encontró columna id/match_id en results. Headers: {res_headers}"}
    res_changes = []
    for i, row in enumerate(res_rows[1:], start=2):
        try:
            old_id = int(row[id_col])
            if old_id in OLD_TO_NEW and OLD_TO_NEW[old_id] != old_id:
                res_changes.append({"row": i, "old_id": old_id, "new_id": OLD_TO_NEW[old_id]})
        except (ValueError, IndexError):
            pass
    return {
        "predictions_changes": len(pred_changes),
        "results_changes": len(res_changes),
        "predictions_detail": pred_changes,
        "results_detail": res_changes,
    }


@app.post("/admin/execute-id-migration", tags=["admin"])
def execute_id_migration():
    """Actualiza match_id en predictions y results según el nuevo orden cronológico."""
    import gspread.utils
    from db.sheets import get_worksheet, _invalidate
    OLD_TO_NEW = {
        1:1,  2:2,  3:26, 4:27, 5:53, 6:54,
        7:3,  8:6,  9:25, 10:28,11:49,12:50,
        13:5, 14:7, 15:31,16:32,17:51,18:52,
        19:4, 20:10,21:29,22:30,23:59,24:60,
        25:11,26:12,27:34,28:35,29:55,30:56,
        31:9, 32:8, 33:33,34:36,35:57,36:58,
        37:14,38:16,39:39,40:40,41:65,42:66,
        43:13,44:15,45:37,46:38,47:63,48:64,
        49:17,50:18,51:42,52:43,53:61,54:62,
        55:19,56:20,57:41,58:44,59:71,60:72,
        61:21,62:24,63:45,64:48,65:69,66:70,
        67:22,68:23,69:46,70:47,71:67,72:68,
    }
    # ── Migrar predictions ──────────────────────────────────────────────────
    pred_ws = get_worksheet("predictions")
    pred_rows = pred_ws.get_all_values()
    pred_headers = pred_rows[0]
    mid_col = pred_headers.index("match_id")
    pred_updates = []
    for i, row in enumerate(pred_rows[1:], start=2):
        try:
            old_id = int(row[mid_col])
            if old_id in OLD_TO_NEW and OLD_TO_NEW[old_id] != old_id:
                cell = gspread.utils.rowcol_to_a1(i, mid_col + 1)
                pred_updates.append({"range": cell, "values": [[OLD_TO_NEW[old_id]]]})
        except (ValueError, IndexError):
            pass
    if pred_updates:
        pred_ws.batch_update(pred_updates, value_input_option="RAW")
    _invalidate("predictions")
    # ── Migrar results ──────────────────────────────────────────────────────
    res_ws = get_worksheet("results")
    res_rows = res_ws.get_all_values()
    res_headers = res_rows[0]
    id_col_name = "id" if "id" in res_headers else "match_id"
    id_col = res_headers.index(id_col_name)
    res_updates = []
    for i, row in enumerate(res_rows[1:], start=2):
        try:
            old_id = int(row[id_col])
            if old_id in OLD_TO_NEW and OLD_TO_NEW[old_id] != old_id:
                cell = gspread.utils.rowcol_to_a1(i, id_col + 1)
                res_updates.append({"range": cell, "values": [[OLD_TO_NEW[old_id]]]})
        except (ValueError, IndexError):
            pass
    if res_updates:
        res_ws.batch_update(res_updates, value_input_option="RAW")
    _invalidate("results")
    return {
        "predictions_updated": len(pred_updates),
        "results_updated": len(res_updates),
        "message": "Migración completada. IDs actualizados en predictions y results.",
    }


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
        # Resetear caché para forzar reconexión
        import db.sheets as sh
        sh._spreadsheet = None
        sp = _get_spreadsheet()
        tabs = [ws.title for ws in sp.worksheets()]
        return {"status": "ok", "sheet_title": sp.title, "tabs": tabs, "sheet_id_used": sheet_id}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__, "sheet_id_used": sheet_id}
