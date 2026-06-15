"""
db/seed.py — Carga inicial de partidos en Google Sheets
========================================================
Se ejecuta al iniciar el servidor. Si la hoja "matches" ya tiene datos, no hace nada.
"""
from datetime import datetime, timedelta


def et_to_arg(month: int, day: int, hour: int) -> str:
    """Convierte hora ET (UTC-4 en verano) a UTC y devuelve ISO string."""
    dt = datetime(2026, month, day, hour, 0) + timedelta(hours=4)
    return dt.isoformat()


# Filas: (home_team, away_team, match_datetime_iso, stage)
MATCHES = [
    # ── GRUPO A ───────────────────────────────────────────────────────────
    ("México",      "Ecuador",     et_to_arg(6,11,21), "Grupo A"),
    ("EE.UU.",      "Honduras",    et_to_arg(6,12,21), "Grupo A"),
    ("México",      "EE.UU.",      et_to_arg(6,16,18), "Grupo A"),
    ("Ecuador",     "Honduras",    et_to_arg(6,16,21), "Grupo A"),
    ("México",      "Honduras",    et_to_arg(6,19,18), "Grupo A"),
    ("Ecuador",     "EE.UU.",      et_to_arg(6,19,18), "Grupo A"),
    # ── GRUPO B ───────────────────────────────────────────────────────────
    ("España",      "Brasil",      et_to_arg(6,12,18), "Grupo B"),
    ("Japón",       "Perú",        et_to_arg(6,12,15), "Grupo B"),
    ("España",      "Japón",       et_to_arg(6,16,18), "Grupo B"),
    ("Brasil",      "Perú",        et_to_arg(6,17, 0), "Grupo B"),
    ("España",      "Perú",        et_to_arg(6,20,18), "Grupo B"),
    ("Brasil",      "Japón",       et_to_arg(6,20,18), "Grupo B"),
    # ── GRUPO C ───────────────────────────────────────────────────────────
    ("Argentina",   "Canadá",      et_to_arg(6,14,21), "Grupo C"),
    ("Noruega",     "Panamá",      et_to_arg(6,14,18), "Grupo C"),
    ("Argentina",   "Noruega",     et_to_arg(6,18,21), "Grupo C"),
    ("Canadá",      "Panamá",      et_to_arg(6,18,18), "Grupo C"),
    ("Argentina",   "Panamá",      et_to_arg(6,21,18), "Grupo C"),
    ("Canadá",      "Noruega",     et_to_arg(6,21,18), "Grupo C"),
    # ── GRUPO D ───────────────────────────────────────────────────────────
    ("Francia",     "Alemania",    et_to_arg(6,13,21), "Grupo D"),
    ("Portugal",    "Marruecos",   et_to_arg(6,13,18), "Grupo D"),
    ("Francia",     "Portugal",    et_to_arg(6,17,21), "Grupo D"),
    ("Alemania",    "Marruecos",   et_to_arg(6,17,18), "Grupo D"),
    ("Francia",     "Marruecos",   et_to_arg(6,21,18), "Grupo D"),
    ("Alemania",    "Portugal",    et_to_arg(6,21,18), "Grupo D"),
    # ── GRUPO E ───────────────────────────────────────────────────────────
    ("Colombia",    "Australia",   et_to_arg(6,14,15), "Grupo E"),
    ("Senegal",     "Corea del Sur",et_to_arg(6,14,12),"Grupo E"),
    ("Colombia",    "Senegal",     et_to_arg(6,18,15), "Grupo E"),
    ("Australia",   "Corea del Sur",et_to_arg(6,18,12),"Grupo E"),
    ("Colombia",    "Corea del Sur",et_to_arg(6,22,18),"Grupo E"),
    ("Australia",   "Senegal",     et_to_arg(6,22,18), "Grupo E"),
    # ── GRUPO F ───────────────────────────────────────────────────────────
    ("Inglaterra",  "Croacia",     et_to_arg(6,13,15), "Grupo F"),
    ("Italia",      "Arabia Saudita",et_to_arg(6,13,12),"Grupo F"),
    ("Inglaterra",  "Italia",      et_to_arg(6,17,15), "Grupo F"),
    ("Croacia",     "Arabia Saudita",et_to_arg(6,17,12),"Grupo F"),
    ("Inglaterra",  "Arabia Saudita",et_to_arg(6,22,18),"Grupo F"),
    ("Croacia",     "Italia",      et_to_arg(6,22,18), "Grupo F"),
    # ── GRUPO G ───────────────────────────────────────────────────────────
    ("Países Bajos","Uruguay",     et_to_arg(6,15,21), "Grupo G"),
    ("Turquía",     "Paraguay",    et_to_arg(6,15,18), "Grupo G"),
    ("Países Bajos","Turquía",     et_to_arg(6,19,21), "Grupo G"),
    ("Uruguay",     "Paraguay",    et_to_arg(6,19,18), "Grupo G"),
    ("Países Bajos","Paraguay",    et_to_arg(6,23,18), "Grupo G"),
    ("Uruguay",     "Turquía",     et_to_arg(6,23,18), "Grupo G"),
    # ── GRUPO H ───────────────────────────────────────────────────────────
    ("Bélgica",     "México",      et_to_arg(6,15,15), "Grupo H"),
    ("Polonia",     "Arabia Saudita",et_to_arg(6,15,12),"Grupo H"),
    ("Bélgica",     "Polonia",     et_to_arg(6,19,15), "Grupo H"),
    ("México",      "Arabia Saudita",et_to_arg(6,19,12),"Grupo H"),
    ("Bélgica",     "Arabia Saudita",et_to_arg(6,23,18),"Grupo H"),
    ("Polonia",     "México",      et_to_arg(6,23,18), "Grupo H"),
    # ── GRUPO I ───────────────────────────────────────────────────────────
    ("Suiza",       "Argelia",     et_to_arg(6,16,12), "Grupo I"),
    ("Austria",     "Irak",        et_to_arg(6,16,15), "Grupo I"),
    ("Suiza",       "Austria",     et_to_arg(6,20,15), "Grupo I"),
    ("Argelia",     "Irak",        et_to_arg(6,20,12), "Grupo I"),
    ("Suiza",       "Irak",        et_to_arg(6,24,18), "Grupo I"),
    ("Argelia",     "Austria",     et_to_arg(6,24,18), "Grupo I"),
    # ── GRUPO J ───────────────────────────────────────────────────────────
    ("Escocia",     "Chequia",     et_to_arg(6,17,12), "Grupo J"),
    ("Serbia",      "Costa Rica",  et_to_arg(6,17, 9), "Grupo J"),
    ("Escocia",     "Serbia",      et_to_arg(6,21,15), "Grupo J"),
    ("Chequia",     "Costa Rica",  et_to_arg(6,21,12), "Grupo J"),
    ("Escocia",     "Costa Rica",  et_to_arg(6,25,18), "Grupo J"),
    ("Chequia",     "Serbia",      et_to_arg(6,25,18), "Grupo J"),
    # ── GRUPO K ───────────────────────────────────────────────────────────
    ("Nueva Zelanda","Ghana",      et_to_arg(6,18, 9), "Grupo K"),
    ("Irán",        "Bosnia y Her.",et_to_arg(6,18,12),"Grupo K"),
    ("Nueva Zelanda","Irán",       et_to_arg(6,22,12), "Grupo K"),
    ("Ghana",       "Bosnia y Her.",et_to_arg(6,22, 9),"Grupo K"),
    ("Nueva Zelanda","Bosnia y Her.",et_to_arg(6,26,18),"Grupo K"),
    ("Ghana",       "Irán",        et_to_arg(6,26,18), "Grupo K"),
    # ── GRUPO L ───────────────────────────────────────────────────────────
    ("Japón",       "Ucrania",     et_to_arg(6,19, 9), "Grupo L"),
    ("Qatar",       "Jordania",    et_to_arg(6,19,12), "Grupo L"),
    ("Japón",       "Qatar",       et_to_arg(6,23,15), "Grupo L"),
    ("Ucrania",     "Jordania",    et_to_arg(6,23,12), "Grupo L"),
    ("Japón",       "Jordania",    et_to_arg(6,27,18), "Grupo L"),
    ("Ucrania",     "Qatar",       et_to_arg(6,27,18), "Grupo L"),

    # ── 16VOS DE FINAL ───────────────────────────────────────────────────
    ("Cuartos TBD 1",  "Cuartos TBD 2",  et_to_arg(7, 1,15), "Octavos"),
    ("Cuartos TBD 3",  "Cuartos TBD 4",  et_to_arg(7, 1,19), "Octavos"),
    ("Cuartos TBD 5",  "Cuartos TBD 6",  et_to_arg(7, 2,15), "Octavos"),
    ("Cuartos TBD 7",  "Cuartos TBD 8",  et_to_arg(7, 2,19), "Octavos"),
    ("Cuartos TBD 9",  "Cuartos TBD 10", et_to_arg(7, 3,15), "Octavos"),
    ("Cuartos TBD 11", "Cuartos TBD 12", et_to_arg(7, 3,19), "Octavos"),
    ("Cuartos TBD 13", "Cuartos TBD 14", et_to_arg(7, 4,15), "Octavos"),
    ("Cuartos TBD 15", "Cuartos TBD 16", et_to_arg(7, 4,19), "Octavos"),

    # ── 8VOS DE FINAL ────────────────────────────────────────────────────
    ("Oct TBD 1",  "Oct TBD 2",  et_to_arg(7, 5,15), "Cuartos de final"),
    ("Oct TBD 3",  "Oct TBD 4",  et_to_arg(7, 5,19), "Cuartos de final"),
    ("Oct TBD 5",  "Oct TBD 6",  et_to_arg(7, 6,16), "Cuartos de final"),
    ("Oct TBD 7",  "Oct TBD 8",  et_to_arg(7, 6,20), "Cuartos de final"),
    ("Oct TBD 9",  "Oct TBD 10", et_to_arg(7, 7,12), "Cuartos de final"),
    ("Oct TBD 11", "Oct TBD 12", et_to_arg(7, 7,16), "Cuartos de final"),
    ("Oct TBD 13", "Oct TBD 14", et_to_arg(7, 7,20), "Cuartos de final"),
    ("Oct TBD 15", "Oct TBD 16", et_to_arg(7, 8,12), "Cuartos de final"),

    # ── 4TOS DE FINAL ────────────────────────────────────────────────────
    ("Semi TBD 1", "Semi TBD 2", et_to_arg(7, 9,16), "4tos de final"),
    ("Semi TBD 3", "Semi TBD 4", et_to_arg(7,10,15), "4tos de final"),
    ("Semi TBD 5", "Semi TBD 6", et_to_arg(7,11,17), "4tos de final"),
    ("Semi TBD 7", "Semi TBD 8", et_to_arg(7,11,21), "4tos de final"),

    # ── SEMIFINALES ───────────────────────────────────────────────────────
    ("SF TBD 1",   "SF TBD 2",   et_to_arg(7,14,15), "Semifinales"),
    ("SF TBD 3",   "SF TBD 4",   et_to_arg(7,15,15), "Semifinales"),

    # ── TERCER PUESTO Y FINAL ─────────────────────────────────────────────
    ("3er puesto TBD 1", "3er puesto TBD 2", et_to_arg(7,18,17), "Tercer puesto"),
    ("Final TBD 1",      "Final TBD 2",      et_to_arg(7,19,15), "Final"),
]


def build_match_rows() -> list[list]:
    """Convierte la lista MATCHES a filas listas para insertar en Sheets."""
    rows = []
    for idx, (home, away, dt, stage) in enumerate(MATCHES, start=1):
        rows.append([idx, home, away, dt, stage, "", "", "FALSE"])
    return rows


def seed_matches(db=None) -> int:
    """
    Inserta partidos en Google Sheets si la hoja está vacía.
    El parámetro `db` se ignora (legacy, para compatibilidad).
    """
    from db.sheets import seed_matches_to_sheet
    rows = build_match_rows()
    return seed_matches_to_sheet(rows)
