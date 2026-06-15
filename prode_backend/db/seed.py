"""
db/seed.py — Partidos reales del Mundial 2026
==============================================
Grupos y fixture oficiales FIFA 2026.
Se ejecuta al iniciar el servidor sólo si la hoja "matches" está vacía.
"""
from datetime import datetime, timedelta


def et_to_utc(month: int, day: int, hour: int, minute: int = 0) -> str:
    """Convierte hora ET (UTC-4 en verano) a UTC y devuelve ISO string."""
    dt = datetime(2026, month, day, hour, minute) + timedelta(hours=4)
    return dt.isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# GRUPOS REALES FIFA 2026
# A: México, Sudáfrica, Corea del Sur, Chequia
# B: Canadá, Bosnia y Her., Qatar, Suiza
# C: Brasil, Marruecos, Haití, Escocia
# D: EE.UU., Paraguay, Australia, Turquía
# E: Alemania, Curazao, Costa de Marfil, Ecuador
# F: Países Bajos, Japón, Suecia, Túnez
# G: Bélgica, Egipto, Irán, Nueva Zelanda
# H: España, Cabo Verde, Arabia Saudita, Uruguay
# I: Francia, Senegal, Irak, Noruega
# J: Argentina, Argelia, Austria, Jordania
# K: Portugal, RD Congo, Uzbekistán, Colombia
# L: Inglaterra, Croacia, Ghana, Panamá
# ─────────────────────────────────────────────────────────────────────────────

MATCHES = [
    # ══ GRUPO A: México · Sudáfrica · Corea del Sur · Chequia ════════════════
    # Jornada 1
    ("Corea del Sur", "Chequia",       et_to_utc(6,11,17),  "Grupo A"),
    ("México",        "Sudáfrica",     et_to_utc(6,11,20),  "Grupo A"),
    # Jornada 2
    ("Chequia",       "Sudáfrica",     et_to_utc(6,18,15),  "Grupo A"),
    ("México",        "Corea del Sur", et_to_utc(6,18,18),  "Grupo A"),
    # Jornada 3 (simultáneos)
    ("Chequia",       "México",        et_to_utc(6,24,21),  "Grupo A"),
    ("Corea del Sur", "Sudáfrica",     et_to_utc(6,24,21),  "Grupo A"),

    # ══ GRUPO B: Canadá · Bosnia y Her. · Qatar · Suiza ══════════════════════
    # Jornada 1
    ("Canadá",        "Bosnia y Her.", et_to_utc(6,12,15),  "Grupo B"),
    ("Qatar",         "Suiza",         et_to_utc(6,13,18),  "Grupo B"),
    # Jornada 2
    ("Suiza",         "Bosnia y Her.", et_to_utc(6,18,12),  "Grupo B"),
    ("Canadá",        "Qatar",         et_to_utc(6,18,21),  "Grupo B"),
    # Jornada 3 (simultáneos)
    ("Bosnia y Her.", "Qatar",         et_to_utc(6,24,15),  "Grupo B"),
    ("Suiza",         "Canadá",        et_to_utc(6,24,15),  "Grupo B"),

    # ══ GRUPO C: Brasil · Marruecos · Haití · Escocia ════════════════════════
    # Jornada 1
    ("Haití",         "Escocia",       et_to_utc(6,13,15),  "Grupo C"),
    ("Brasil",        "Marruecos",     et_to_utc(6,13,21),  "Grupo C"),
    # Jornada 2
    ("Escocia",       "Marruecos",     et_to_utc(6,19,18),  "Grupo C"),
    ("Brasil",        "Haití",         et_to_utc(6,19,21),  "Grupo C"),
    # Jornada 3 (simultáneos)
    ("Marruecos",     "Haití",         et_to_utc(6,24,18),  "Grupo C"),
    ("Escocia",       "Brasil",        et_to_utc(6,24,18),  "Grupo C"),

    # ══ GRUPO D: EE.UU. · Paraguay · Australia · Turquía ════════════════════
    # Jornada 1
    ("EE.UU.",        "Paraguay",      et_to_utc(6,12,21),  "Grupo D"),
    ("Australia",     "Turquía",       et_to_utc(6,14,15),  "Grupo D"),
    # Jornada 2
    ("EE.UU.",        "Australia",     et_to_utc(6,19,12),  "Grupo D"),
    ("Turquía",       "Paraguay",      et_to_utc(6,19,15),  "Grupo D"),
    # Jornada 3 (simultáneos)
    ("Paraguay",      "Australia",     et_to_utc(6,25,22),  "Grupo D"),
    ("Turquía",       "EE.UU.",        et_to_utc(6,25,22),  "Grupo D"),

    # ══ GRUPO E: Alemania · Curazao · Costa de Marfil · Ecuador ══════════════
    # Jornada 1
    ("Alemania",      "Curazao",       et_to_utc(6,14,18),  "Grupo E"),
    ("Costa de Marfil","Ecuador",      et_to_utc(6,14,21),  "Grupo E"),
    # Jornada 2
    ("Alemania",      "Costa de Marfil",et_to_utc(6,20,18), "Grupo E"),
    ("Ecuador",       "Curazao",       et_to_utc(6,20,21),  "Grupo E"),
    # Jornada 3 (simultáneos)
    ("Curazao",       "Costa de Marfil",et_to_utc(6,25,16), "Grupo E"),
    ("Ecuador",       "Alemania",      et_to_utc(6,25,16),  "Grupo E"),

    # ══ GRUPO F: Países Bajos · Japón · Suecia · Túnez ══════════════════════
    # Jornada 1
    ("Países Bajos",  "Japón",         et_to_utc(6,14,12),  "Grupo F"),
    ("Suecia",        "Túnez",         et_to_utc(6,14, 9),  "Grupo F"),
    # Jornada 2
    ("Países Bajos",  "Suecia",        et_to_utc(6,20,15),  "Grupo F"),
    ("Túnez",         "Japón",         et_to_utc(6,21,12),  "Grupo F"),
    # Jornada 3 (simultáneos)
    ("Japón",         "Suecia",        et_to_utc(6,25,19),  "Grupo F"),
    ("Túnez",         "Países Bajos",  et_to_utc(6,25,19),  "Grupo F"),

    # ══ GRUPO G: Bélgica · Egipto · Irán · Nueva Zelanda ════════════════════
    # Jornada 1
    ("Bélgica",       "Egipto",        et_to_utc(6,15,15),  "Grupo G"),
    ("Irán",          "Nueva Zelanda", et_to_utc(6,15,21),  "Grupo G"),
    # Jornada 2
    ("Bélgica",       "Irán",          et_to_utc(6,21,18),  "Grupo G"),
    ("Nueva Zelanda", "Egipto",        et_to_utc(6,21,18),  "Grupo G"),
    # Jornada 3 (simultáneos)
    ("Egipto",        "Irán",          et_to_utc(6,26,23),  "Grupo G"),
    ("Nueva Zelanda", "Bélgica",       et_to_utc(6,26,23),  "Grupo G"),

    # ══ GRUPO H: España · Cabo Verde · Arabia Saudita · Uruguay ══════════════
    # Jornada 1
    ("España",        "Cabo Verde",    et_to_utc(6,15,12),  "Grupo H"),
    ("Arabia Saudita","Uruguay",       et_to_utc(6,15,18),  "Grupo H"),
    # Jornada 2
    ("España",        "Arabia Saudita",et_to_utc(6,21,15),  "Grupo H"),
    ("Uruguay",       "Cabo Verde",    et_to_utc(6,21,15),  "Grupo H"),
    # Jornada 3 (simultáneos)
    ("Cabo Verde",    "Arabia Saudita",et_to_utc(6,26,20),  "Grupo H"),
    ("Uruguay",       "España",        et_to_utc(6,26,20),  "Grupo H"),

    # ══ GRUPO I: Francia · Senegal · Irak · Noruega ══════════════════════════
    # Jornada 1
    ("Francia",       "Senegal",       et_to_utc(6,16,15),  "Grupo I"),
    ("Irak",          "Noruega",       et_to_utc(6,16,18),  "Grupo I"),
    # Jornada 2
    ("Francia",       "Irak",          et_to_utc(6,22,17),  "Grupo I"),
    ("Noruega",       "Senegal",       et_to_utc(6,22,20),  "Grupo I"),
    # Jornada 3 (simultáneos)
    ("Noruega",       "Francia",       et_to_utc(6,26,15),  "Grupo I"),
    ("Senegal",       "Irak",          et_to_utc(6,26,15),  "Grupo I"),

    # ══ GRUPO J: Argentina · Argelia · Austria · Jordania ════════════════════
    # Jornada 1
    ("Argentina",     "Argelia",       et_to_utc(6,16,21),  "Grupo J"),
    ("Austria",       "Jordania",      et_to_utc(6,17, 0),  "Grupo J"),
    # Jornada 2
    ("Argentina",     "Austria",       et_to_utc(6,22,13),  "Grupo J"),
    ("Jordania",      "Argelia",       et_to_utc(6,22,23),  "Grupo J"),
    # Jornada 3 (simultáneos)
    ("Argelia",       "Austria",       et_to_utc(6,27,22),  "Grupo J"),
    ("Jordania",      "Argentina",     et_to_utc(6,27,22),  "Grupo J"),

    # ══ GRUPO K: Portugal · RD Congo · Uzbekistán · Colombia ═════════════════
    # Jornada 1
    ("Portugal",      "RD Congo",      et_to_utc(6,17,13),  "Grupo K"),
    ("Colombia",      "Uzbekistán",    et_to_utc(6,17,22),  "Grupo K"),
    # Jornada 2
    ("Portugal",      "Uzbekistán",    et_to_utc(6,23,13),  "Grupo K"),
    ("Colombia",      "RD Congo",      et_to_utc(6,23,22),  "Grupo K"),
    # Jornada 3 (simultáneos)
    ("Colombia",      "Portugal",      et_to_utc(6,27,19,30),"Grupo K"),
    ("RD Congo",      "Uzbekistán",    et_to_utc(6,27,19,30),"Grupo K"),

    # ══ GRUPO L: Inglaterra · Croacia · Ghana · Panamá ════════════════════════
    # Jornada 1
    ("Inglaterra",    "Croacia",       et_to_utc(6,17,16),  "Grupo L"),
    ("Ghana",         "Panamá",        et_to_utc(6,17,19),  "Grupo L"),
    # Jornada 2
    ("Inglaterra",    "Ghana",         et_to_utc(6,23,16),  "Grupo L"),
    ("Panamá",        "Croacia",       et_to_utc(6,23,19),  "Grupo L"),
    # Jornada 3 (simultáneos)
    ("Croacia",       "Ghana",         et_to_utc(6,27,17),  "Grupo L"),
    ("Panamá",        "Inglaterra",    et_to_utc(6,27,17),  "Grupo L"),

    # ══ 16VOS DE FINAL (Round of 32) — Jul 1-4 ══════════════════════════════
    ("16vos TBD 1",  "16vos TBD 2",  et_to_utc(7, 1,15),  "Octavos"),
    ("16vos TBD 3",  "16vos TBD 4",  et_to_utc(7, 1,19),  "Octavos"),
    ("16vos TBD 5",  "16vos TBD 6",  et_to_utc(7, 2,15),  "Octavos"),
    ("16vos TBD 7",  "16vos TBD 8",  et_to_utc(7, 2,19),  "Octavos"),
    ("16vos TBD 9",  "16vos TBD 10", et_to_utc(7, 3,15),  "Octavos"),
    ("16vos TBD 11", "16vos TBD 12", et_to_utc(7, 3,19),  "Octavos"),
    ("16vos TBD 13", "16vos TBD 14", et_to_utc(7, 4,15),  "Octavos"),
    ("16vos TBD 15", "16vos TBD 16", et_to_utc(7, 4,19),  "Octavos"),

    # ══ 8VOS DE FINAL (Round of 16) — Jul 5-8 ═══════════════════════════════
    ("8vos TBD 1",   "8vos TBD 2",   et_to_utc(7, 5,15),  "Cuartos de final"),
    ("8vos TBD 3",   "8vos TBD 4",   et_to_utc(7, 5,19),  "Cuartos de final"),
    ("8vos TBD 5",   "8vos TBD 6",   et_to_utc(7, 6,15),  "Cuartos de final"),
    ("8vos TBD 7",   "8vos TBD 8",   et_to_utc(7, 6,19),  "Cuartos de final"),
    ("8vos TBD 9",   "8vos TBD 10",  et_to_utc(7, 7,15),  "Cuartos de final"),
    ("8vos TBD 11",  "8vos TBD 12",  et_to_utc(7, 7,19),  "Cuartos de final"),
    ("8vos TBD 13",  "8vos TBD 14",  et_to_utc(7, 8,15),  "Cuartos de final"),
    ("8vos TBD 15",  "8vos TBD 16",  et_to_utc(7, 8,19),  "Cuartos de final"),

    # ══ 4TOS DE FINAL (Quarterfinals) — Jul 9-11 ════════════════════════════
    ("4tos TBD 1",   "4tos TBD 2",   et_to_utc(7, 9,16),  "4tos de final"),
    ("4tos TBD 3",   "4tos TBD 4",   et_to_utc(7,10,15),  "4tos de final"),
    ("4tos TBD 5",   "4tos TBD 6",   et_to_utc(7,11,15),  "4tos de final"),
    ("4tos TBD 7",   "4tos TBD 8",   et_to_utc(7,11,19),  "4tos de final"),

    # ══ SEMIFINALES — Jul 14-15 ══════════════════════════════════════════════
    ("Semi TBD 1",   "Semi TBD 2",   et_to_utc(7,14,15),  "Semifinales"),
    ("Semi TBD 3",   "Semi TBD 4",   et_to_utc(7,15,15),  "Semifinales"),

    # ══ FINAL Y TERCER PUESTO — Jul 18-19 ════════════════════════════════════
    ("3er puesto TBD 1","3er puesto TBD 2", et_to_utc(7,18,15), "Tercer puesto"),
    ("Final TBD 1",  "Final TBD 2",  et_to_utc(7,19,15),  "Final"),
]


def build_match_rows() -> list[list]:
    """Convierte la lista MATCHES a filas listas para insertar en Sheets."""
    return [
        [idx, home, away, dt, stage, "", "", "FALSE"]
        for idx, (home, away, dt, stage) in enumerate(MATCHES, start=1)
    ]


def seed_matches(db=None) -> int:
    """Inserta partidos en Google Sheets si la hoja está vacía."""
    from db.sheets import seed_matches_to_sheet
    return seed_matches_to_sheet(build_match_rows())
