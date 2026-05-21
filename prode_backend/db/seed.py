"""
Fixture completo del Mundial 2026.
Horarios en UTC-3 (hora Argentina).
Eastern Time (ET) = UTC-5  →  Argentina (UTC-3) = ET + 2hs
"""
from datetime import datetime
from sqlalchemy.orm import Session
from db.models import Match


def et_to_arg(month, day, hour, minute=0):
    """Convierte hora ET a hora Argentina (UTC-3). ET = UTC-5, ARG = UTC-3 → +2hs."""
    h = hour + 2
    d = day
    m = month
    if h >= 24:
        h -= 24
        d += 1
    return datetime(2026, m, d, h, minute)


FIXTURES = [
    # ── FASE DE GRUPOS ────────────────────────────────────────────────────
    # Jueves 11/6
    ("México", "Sudáfrica",       et_to_arg(6,11,15),    "Grupo A"),
    ("Corea del Sur", "Chequia",  et_to_arg(6,11,22),    "Grupo A"),
    # Viernes 12/6
    ("Canadá", "Bosnia y Her.",   et_to_arg(6,12,15),    "Grupo B"),
    ("EE.UU.", "Paraguay",        et_to_arg(6,12,21),    "Grupo D"),
    # Sábado 13/6
    ("Qatar", "Suiza",            et_to_arg(6,13,15),    "Grupo B"),
    ("Brasil", "Marruecos",       et_to_arg(6,13,18),    "Grupo C"),
    ("Haití", "Escocia",          et_to_arg(6,13,21),    "Grupo C"),
    # Domingo 14/6
    ("Australia", "Türkiye",      et_to_arg(6,14,12),    "Grupo D"),
    ("Alemania", "Curazao",       et_to_arg(6,14,13),    "Grupo E"),
    ("Países Bajos", "Japón",     et_to_arg(6,14,16),    "Grupo F"),
    ("Costa de Marfil", "Ecuador",et_to_arg(6,14,19),    "Grupo E"),
    ("Suecia", "Túnez",           et_to_arg(6,14,22),    "Grupo F"),
    # Lunes 15/6
    ("España", "Cabo Verde",      et_to_arg(6,15,12),    "Grupo H"),
    ("Bélgica", "Egipto",         et_to_arg(6,15,15),    "Grupo G"),
    ("Arabia Saudita", "Uruguay", et_to_arg(6,15,18),    "Grupo H"),
    ("Irán", "Nueva Zelanda",     et_to_arg(6,15,21),    "Grupo G"),
    # Martes 16/6
    ("Francia", "Senegal",        et_to_arg(6,16,15),    "Grupo I"),
    ("Irak", "Noruega",           et_to_arg(6,16,18),    "Grupo I"),
    ("Argentina", "Argelia",      et_to_arg(6,16,21),    "Grupo J"),
    # Miércoles 17/6
    ("Austria", "Jordania",       et_to_arg(6,17, 0),    "Grupo J"),
    ("Portugal", "RD Congo",      et_to_arg(6,17,13),    "Grupo K"),
    ("Inglaterra", "Croacia",     et_to_arg(6,17,16),    "Grupo L"),
    ("Ghana", "Panamá",           et_to_arg(6,17,19),    "Grupo L"),
    ("Uzbekistán", "Colombia",    et_to_arg(6,17,22),    "Grupo K"),
    # Jueves 18/6
    ("Chequia", "Sudáfrica",      et_to_arg(6,18,12),    "Grupo A"),
    ("Suiza", "Bosnia y Her.",    et_to_arg(6,18,15),    "Grupo B"),
    ("Canadá", "Qatar",           et_to_arg(6,18,18),    "Grupo B"),
    ("México", "Corea del Sur",   et_to_arg(6,18,21),    "Grupo A"),
    # Viernes 19/6
    ("EE.UU.", "Australia",       et_to_arg(6,19,15),    "Grupo D"),
    ("Escocia", "Marruecos",      et_to_arg(6,19,18),    "Grupo C"),
    ("Brasil", "Haití",           et_to_arg(6,19,20,30), "Grupo C"),
    ("Türkiye", "Paraguay",       et_to_arg(6,19,23),    "Grupo D"),
    # Sábado 20/6
    ("Países Bajos", "Suecia",    et_to_arg(6,20,13),    "Grupo F"),
    ("Alemania", "Costa de Marfil",et_to_arg(6,20,16),   "Grupo E"),
    ("Ecuador", "Curazao",        et_to_arg(6,20,20),    "Grupo E"),
    # Domingo 21/6
    ("Túnez", "Japón",            et_to_arg(6,21, 0),    "Grupo F"),
    ("España", "Arabia Saudita",  et_to_arg(6,21,12),    "Grupo H"),
    ("Bélgica", "Irán",           et_to_arg(6,21,15),    "Grupo G"),
    ("Uruguay", "Cabo Verde",     et_to_arg(6,21,18),    "Grupo H"),
    ("Nueva Zelanda", "Egipto",   et_to_arg(6,21,21),    "Grupo G"),
    # Lunes 22/6
    ("Argentina", "Austria",      et_to_arg(6,22,13),    "Grupo J"),
    ("Francia", "Irak",           et_to_arg(6,22,17),    "Grupo I"),
    ("Noruega", "Senegal",        et_to_arg(6,22,20),    "Grupo I"),
    ("Jordania", "Argelia",       et_to_arg(6,22,23),    "Grupo J"),
    # Martes 23/6
    ("Portugal", "Uzbekistán",    et_to_arg(6,23,13),    "Grupo K"),
    ("Inglaterra", "Ghana",       et_to_arg(6,23,16),    "Grupo L"),
    ("Panamá", "Croacia",         et_to_arg(6,23,19),    "Grupo L"),
    ("Colombia", "RD Congo",      et_to_arg(6,23,22),    "Grupo K"),
    # Miércoles 24/6
    ("Suiza", "Canadá",           et_to_arg(6,24,15),    "Grupo B"),
    ("Bosnia y Her.", "Qatar",    et_to_arg(6,24,15),    "Grupo B"),
    ("Escocia", "Brasil",         et_to_arg(6,24,18),    "Grupo C"),
    ("Marruecos", "Haití",        et_to_arg(6,24,18),    "Grupo C"),
    ("Chequia", "México",         et_to_arg(6,24,21),    "Grupo A"),
    ("Sudáfrica", "Corea del Sur",et_to_arg(6,24,21),    "Grupo A"),
    # Jueves 25/6
    ("Curazao", "Costa de Marfil",et_to_arg(6,25,16),    "Grupo E"),
    ("Ecuador", "Alemania",       et_to_arg(6,25,16),    "Grupo E"),
    ("Japón", "Suecia",           et_to_arg(6,25,19),    "Grupo F"),
    ("Túnez", "Países Bajos",     et_to_arg(6,25,19),    "Grupo F"),
    ("Türkiye", "EE.UU.",         et_to_arg(6,25,22),    "Grupo D"),
    ("Paraguay", "Australia",     et_to_arg(6,25,22),    "Grupo D"),
    # Viernes 26/6
    ("Noruega", "Francia",        et_to_arg(6,26,15),    "Grupo I"),
    ("Senegal", "Irak",           et_to_arg(6,26,15),    "Grupo I"),
    ("Cabo Verde", "Arabia Saudita",et_to_arg(6,26,20),  "Grupo H"),
    ("Uruguay", "España",         et_to_arg(6,26,20),    "Grupo H"),
    ("Egipto", "Irán",            et_to_arg(6,26,23),    "Grupo G"),
    ("Nueva Zelanda", "Bélgica",  et_to_arg(6,26,23),    "Grupo G"),
    # Sábado 27/6
    ("Panamá", "Inglaterra",      et_to_arg(6,27,17),    "Grupo L"),
    ("Croacia", "Ghana",          et_to_arg(6,27,17),    "Grupo L"),
    ("Colombia", "Portugal",      et_to_arg(6,27,19,30), "Grupo K"),
    ("RD Congo", "Uzbekistán",    et_to_arg(6,27,19,30), "Grupo K"),
    ("Argelia", "Austria",        et_to_arg(6,27,22),    "Grupo J"),
    ("Jordania", "Argentina",     et_to_arg(6,27,22),    "Grupo J"),

    # ── OCTAVOS DE FINAL (Round of 32) ────────────────────────────────────
    ("2º A", "2º B",              et_to_arg(6,28,15),    "Octavos"),
    ("1º C", "2º F",              et_to_arg(6,29,13),    "Octavos"),
    ("1º E", "3º ABCDF",          et_to_arg(6,29,16,30), "Octavos"),
    ("1º F", "2º C",              et_to_arg(6,29,21),    "Octavos"),
    ("2º E", "2º I",              et_to_arg(6,30,13),    "Octavos"),
    ("1º I", "3º CDFGH",          et_to_arg(6,30,17),    "Octavos"),
    ("1º A", "3º CEFHI",          et_to_arg(6,30,21),    "Octavos"),
    ("1º L", "3º EHIJK",          et_to_arg(7, 1,12),    "Octavos"),
    ("1º G", "3º AEHIJ",          et_to_arg(7, 1,16),    "Octavos"),
    ("1º D", "3º BEFIJ",          et_to_arg(7, 1,20),    "Octavos"),
    ("1º H", "2º J",              et_to_arg(7, 2,15),    "Octavos"),
    ("2º K", "2º L",              et_to_arg(7, 2,19),    "Octavos"),
    ("1º B", "3º EFGIJ",          et_to_arg(7, 2,23),    "Octavos"),
    ("2º D", "2º G",              et_to_arg(7, 3,14),    "Octavos"),
    ("1º J", "2º H",              et_to_arg(7, 3,18),    "Octavos"),
    ("1º K", "3º DEIJL",          et_to_arg(7, 3,21,30), "Octavos"),

    # ── CUARTOS DE FINAL ──────────────────────────────────────────────────
    ("Cuartos TBD 1", "Cuartos TBD 2", et_to_arg(7, 4,13),  "Cuartos de final"),
    ("Cuartos TBD 3", "Cuartos TBD 4", et_to_arg(7, 4,17),  "Cuartos de final"),
    ("Cuartos TBD 5", "Cuartos TBD 6", et_to_arg(7, 5,16),  "Cuartos de final"),
    ("Cuartos TBD 7", "Cuartos TBD 8", et_to_arg(7, 5,20),  "Cuartos de final"),
    ("Cuartos TBD 9", "Cuartos TBD 10",et_to_arg(7, 6,15),  "Cuartos de final"),
    ("Cuartos TBD 11","Cuartos TBD 12",et_to_arg(7, 6,20),  "Cuartos de final"),
    ("Cuartos TBD 13","Cuartos TBD 14",et_to_arg(7, 7,12),  "Cuartos de final"),
    ("Cuartos TBD 15","Cuartos TBD 16",et_to_arg(7, 7,16),  "Cuartos de final"),

    # ── 4TOS DE FINAL ─────────────────────────────────────────────────────
    ("Semi TBD 1",    "Semi TBD 2",    et_to_arg(7, 9,16),  "4tos de final"),
    ("Semi TBD 3",    "Semi TBD 4",    et_to_arg(7,10,15),  "4tos de final"),
    ("Semi TBD 5",    "Semi TBD 6",    et_to_arg(7,11,17),  "4tos de final"),
    ("Semi TBD 7",    "Semi TBD 8",    et_to_arg(7,11,21),  "4tos de final"),

    # ── SEMIFINALES RONDA 2 ───────────────────────────────────────────────
    ("SF TBD 1",      "SF TBD 2",      et_to_arg(7,14,15),  "Semifinales"),
    ("SF TBD 3",      "SF TBD 4",      et_to_arg(7,15,15),  "Semifinales"),

    # ── TERCER PUESTO Y FINAL ─────────────────────────────────────────────
    ("3er puesto TBD 1","3er puesto TBD 2", et_to_arg(7,18,17), "Tercer puesto"),
    ("Final TBD 1",   "Final TBD 2",   et_to_arg(7,19,15),  "Final"),
]


def seed_matches(db: Session) -> int:
    """Inserta todos los partidos si la tabla está vacía. Retorna cantidad insertada."""
    existing = db.query(Match).count()
    if existing > 0:
        return 0

    matches = [
        Match(
            home_team=home,
            away_team=away,
            match_datetime=dt,
            stage=stage,
        )
        for home, away, dt, stage in FIXTURES
    ]
    db.bulk_save_objects(matches)
    db.commit()
    return len(matches)
