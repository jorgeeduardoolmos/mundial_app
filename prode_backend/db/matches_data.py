"""
db/matches_data.py — Fixture completo del Mundial 2026 (datos fijos en código)
==============================================================================
96 partidos con equipos, fecha UTC y fase.
Los resultados (goles, is_finished) se guardan aparte en Google Sheets (tab 'results').
"""
from datetime import datetime, timedelta


def _utc(month: int, day: int, hour: int, minute: int = 0) -> str:
    """ET (UTC-4 en verano) → ISO string UTC."""
    return (datetime(2026, month, day, hour, minute) + timedelta(hours=4)).isoformat()


# Cada entry: (id, home_team, away_team, match_datetime_utc_iso, stage)
_RAW = [
    # ══ GRUPO A: México · Sudáfrica · Corea del Sur · Chequia ══════════════
    (1,  "Corea del Sur", "Chequia",        _utc(6,11,17),    "Grupo A"),
    (2,  "México",        "Sudáfrica",      _utc(6,11,20),    "Grupo A"),
    (3,  "Chequia",       "Sudáfrica",      _utc(6,18,15),    "Grupo A"),
    (4,  "México",        "Corea del Sur",  _utc(6,18,18),    "Grupo A"),
    (5,  "Chequia",       "México",         _utc(6,24,21),    "Grupo A"),
    (6,  "Corea del Sur", "Sudáfrica",      _utc(6,24,21),    "Grupo A"),

    # ══ GRUPO B: Canadá · Bosnia y Her. · Qatar · Suiza ════════════════════
    (7,  "Canadá",        "Bosnia y Her.",  _utc(6,12,15),    "Grupo B"),
    (8,  "Qatar",         "Suiza",          _utc(6,13,18),    "Grupo B"),
    (9,  "Suiza",         "Bosnia y Her.",  _utc(6,18,12),    "Grupo B"),
    (10, "Canadá",        "Qatar",          _utc(6,18,21),    "Grupo B"),
    (11, "Bosnia y Her.", "Qatar",          _utc(6,24,15),    "Grupo B"),
    (12, "Suiza",         "Canadá",         _utc(6,24,15),    "Grupo B"),

    # ══ GRUPO C: Brasil · Marruecos · Haití · Escocia ══════════════════════
    (13, "Haití",         "Escocia",        _utc(6,13,15),    "Grupo C"),
    (14, "Brasil",        "Marruecos",      _utc(6,13,21),    "Grupo C"),
    (15, "Escocia",       "Marruecos",      _utc(6,19,18),    "Grupo C"),
    (16, "Brasil",        "Haití",          _utc(6,19,21),    "Grupo C"),
    (17, "Marruecos",     "Haití",          _utc(6,24,18),    "Grupo C"),
    (18, "Escocia",       "Brasil",         _utc(6,24,18),    "Grupo C"),

    # ══ GRUPO D: EE.UU. · Paraguay · Australia · Turquía ═══════════════════
    (19, "EE.UU.",        "Paraguay",       _utc(6,12,21),    "Grupo D"),
    (20, "Australia",     "Turquía",        _utc(6,14,15),    "Grupo D"),
    (21, "EE.UU.",        "Australia",      _utc(6,19,12),    "Grupo D"),
    (22, "Turquía",       "Paraguay",       _utc(6,19,15),    "Grupo D"),
    (23, "Paraguay",      "Australia",      _utc(6,25,22),    "Grupo D"),
    (24, "Turquía",       "EE.UU.",         _utc(6,25,22),    "Grupo D"),

    # ══ GRUPO E: Alemania · Curazao · Costa de Marfil · Ecuador ════════════
    (25, "Alemania",      "Curazao",        _utc(6,14,18),    "Grupo E"),
    (26, "Costa de Marfil","Ecuador",       _utc(6,14,21),    "Grupo E"),
    (27, "Alemania",      "Costa de Marfil",_utc(6,20,18),    "Grupo E"),
    (28, "Ecuador",       "Curazao",        _utc(6,20,21),    "Grupo E"),
    (29, "Curazao",       "Costa de Marfil",_utc(6,25,16),    "Grupo E"),
    (30, "Ecuador",       "Alemania",       _utc(6,25,16),    "Grupo E"),

    # ══ GRUPO F: Países Bajos · Japón · Suecia · Túnez ═════════════════════
    (31, "Países Bajos",  "Japón",          _utc(6,14,12),    "Grupo F"),
    (32, "Suecia",        "Túnez",          _utc(6,14, 9),    "Grupo F"),
    (33, "Países Bajos",  "Suecia",         _utc(6,20,15),    "Grupo F"),
    (34, "Túnez",         "Japón",          _utc(6,21,12),    "Grupo F"),
    (35, "Japón",         "Suecia",         _utc(6,25,19),    "Grupo F"),
    (36, "Túnez",         "Países Bajos",   _utc(6,25,19),    "Grupo F"),

    # ══ GRUPO G: Bélgica · Egipto · Irán · Nueva Zelanda ══════════════════
    (37, "Bélgica",       "Egipto",         _utc(6,15,15),    "Grupo G"),
    (38, "Irán",          "Nueva Zelanda",  _utc(6,15,21),    "Grupo G"),
    (39, "Bélgica",       "Irán",           _utc(6,21,18),    "Grupo G"),
    (40, "Nueva Zelanda", "Egipto",         _utc(6,21,18),    "Grupo G"),
    (41, "Egipto",        "Irán",           _utc(6,26,23),    "Grupo G"),
    (42, "Nueva Zelanda", "Bélgica",        _utc(6,26,23),    "Grupo G"),

    # ══ GRUPO H: España · Cabo Verde · Arabia Saudita · Uruguay ════════════
    (43, "España",        "Cabo Verde",     _utc(6,15,12),    "Grupo H"),
    (44, "Arabia Saudita","Uruguay",        _utc(6,15,18),    "Grupo H"),
    (45, "España",        "Arabia Saudita", _utc(6,21,15),    "Grupo H"),
    (46, "Uruguay",       "Cabo Verde",     _utc(6,21,15),    "Grupo H"),
    (47, "Cabo Verde",    "Arabia Saudita", _utc(6,26,20),    "Grupo H"),
    (48, "Uruguay",       "España",         _utc(6,26,20),    "Grupo H"),

    # ══ GRUPO I: Francia · Senegal · Irak · Noruega ════════════════════════
    (49, "Francia",       "Senegal",        _utc(6,16,15),    "Grupo I"),
    (50, "Irak",          "Noruega",        _utc(6,16,18),    "Grupo I"),
    (51, "Francia",       "Irak",           _utc(6,22,17),    "Grupo I"),
    (52, "Noruega",       "Senegal",        _utc(6,22,20),    "Grupo I"),
    (53, "Noruega",       "Francia",        _utc(6,26,15),    "Grupo I"),
    (54, "Senegal",       "Irak",           _utc(6,26,15),    "Grupo I"),

    # ══ GRUPO J: Argentina · Argelia · Austria · Jordania ══════════════════
    (55, "Argentina",     "Argelia",        _utc(6,16,21),    "Grupo J"),
    (56, "Austria",       "Jordania",       _utc(6,17, 0),    "Grupo J"),
    (57, "Argentina",     "Austria",        _utc(6,22,13),    "Grupo J"),
    (58, "Jordania",      "Argelia",        _utc(6,22,23),    "Grupo J"),
    (59, "Argelia",       "Austria",        _utc(6,27,22),    "Grupo J"),
    (60, "Jordania",      "Argentina",      _utc(6,27,22),    "Grupo J"),

    # ══ GRUPO K: Portugal · RD Congo · Uzbekistán · Colombia ═══════════════
    (61, "Portugal",      "RD Congo",       _utc(6,17,13),    "Grupo K"),
    (62, "Colombia",      "Uzbekistán",     _utc(6,17,22),    "Grupo K"),
    (63, "Portugal",      "Uzbekistán",     _utc(6,23,13),    "Grupo K"),
    (64, "Colombia",      "RD Congo",       _utc(6,23,22),    "Grupo K"),
    (65, "Colombia",      "Portugal",       _utc(6,27,19,30), "Grupo K"),
    (66, "RD Congo",      "Uzbekistán",     _utc(6,27,19,30), "Grupo K"),

    # ══ GRUPO L: Inglaterra · Croacia · Ghana · Panamá ═════════════════════
    (67, "Inglaterra",    "Croacia",        _utc(6,17,16),    "Grupo L"),
    (68, "Ghana",         "Panamá",         _utc(6,17,19),    "Grupo L"),
    (69, "Inglaterra",    "Ghana",          _utc(6,23,16),    "Grupo L"),
    (70, "Panamá",        "Croacia",        _utc(6,23,19),    "Grupo L"),
    (71, "Croacia",       "Ghana",          _utc(6,27,17),    "Grupo L"),
    (72, "Panamá",        "Inglaterra",     _utc(6,27,17),    "Grupo L"),

    # ══ 16VOS DE FINAL — Jul 1-4 ═══════════════════════════════════════════
    (73, "16vos TBD 1",  "16vos TBD 2",   _utc(7, 1,15),    "Octavos"),
    (74, "16vos TBD 3",  "16vos TBD 4",   _utc(7, 1,19),    "Octavos"),
    (75, "16vos TBD 5",  "16vos TBD 6",   _utc(7, 2,15),    "Octavos"),
    (76, "16vos TBD 7",  "16vos TBD 8",   _utc(7, 2,19),    "Octavos"),
    (77, "16vos TBD 9",  "16vos TBD 10",  _utc(7, 3,15),    "Octavos"),
    (78, "16vos TBD 11", "16vos TBD 12",  _utc(7, 3,19),    "Octavos"),
    (79, "16vos TBD 13", "16vos TBD 14",  _utc(7, 4,15),    "Octavos"),
    (80, "16vos TBD 15", "16vos TBD 16",  _utc(7, 4,19),    "Octavos"),

    # ══ 8VOS DE FINAL — Jul 5-8 ════════════════════════════════════════════
    (81, "8vos TBD 1",   "8vos TBD 2",    _utc(7, 5,15),    "Cuartos de final"),
    (82, "8vos TBD 3",   "8vos TBD 4",    _utc(7, 5,19),    "Cuartos de final"),
    (83, "8vos TBD 5",   "8vos TBD 6",    _utc(7, 6,15),    "Cuartos de final"),
    (84, "8vos TBD 7",   "8vos TBD 8",    _utc(7, 6,19),    "Cuartos de final"),
    (85, "8vos TBD 9",   "8vos TBD 10",   _utc(7, 7,15),    "Cuartos de final"),
    (86, "8vos TBD 11",  "8vos TBD 12",   _utc(7, 7,19),    "Cuartos de final"),
    (87, "8vos TBD 13",  "8vos TBD 14",   _utc(7, 8,15),    "Cuartos de final"),
    (88, "8vos TBD 15",  "8vos TBD 16",   _utc(7, 8,19),    "Cuartos de final"),

    # ══ 4TOS DE FINAL — Jul 9-11 ═══════════════════════════════════════════
    (89, "4tos TBD 1",   "4tos TBD 2",    _utc(7, 9,16),    "4tos de final"),
    (90, "4tos TBD 3",   "4tos TBD 4",    _utc(7,10,15),    "4tos de final"),
    (91, "4tos TBD 5",   "4tos TBD 6",    _utc(7,11,15),    "4tos de final"),
    (92, "4tos TBD 7",   "4tos TBD 8",    _utc(7,11,19),    "4tos de final"),

    # ══ SEMIFINALES — Jul 14-15 ════════════════════════════════════════════
    (93, "Semi TBD 1",   "Semi TBD 2",    _utc(7,14,15),    "Semifinales"),
    (94, "Semi TBD 3",   "Semi TBD 4",    _utc(7,15,15),    "Semifinales"),

    # ══ FINAL Y TERCER PUESTO — Jul 18-19 ══════════════════════════════════
    (95, "3er puesto TBD 1","3er puesto TBD 2", _utc(7,18,15), "Tercer puesto"),
    (96, "Final TBD 1",  "Final TBD 2",   _utc(7,19,15),    "Final"),
]

# Dict por ID para lookup rápido
MATCHES_BY_ID: dict[int, dict] = {}

ALL_MATCHES: list[dict] = []

for _id, _home, _away, _dt, _stage in _RAW:
    _m = {
        "id":             _id,
        "home_team":      _home,
        "away_team":      _away,
        "match_datetime": _dt,
        "stage":          _stage,
        "home_goals":     None,
        "away_goals":     None,
        "is_finished":    False,
    }
    ALL_MATCHES.append(_m)
    MATCHES_BY_ID[_id] = _m
