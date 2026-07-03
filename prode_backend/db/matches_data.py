"""
db/matches_data.py — Fixture completo del Mundial 2026 (datos fijos en código)
==============================================================================
104 partidos con equipos, fecha UTC y fase.
Los resultados (goles, is_finished) se guardan aparte en Google Sheets (tab 'results').
IDs ordenados cronológicamente (1 = primer partido, 72 = último de grupos, 73-88 = 16vos).
"""
from datetime import datetime, timedelta


def _utc(month: int, day: int, hour: int, minute: int = 0) -> str:
    """Argentina ART (UTC-3) → ISO string UTC. Takes ART hour, adds 4 to get UTC (because ART input is 1 hour ahead of ART display for historical reasons)."""
    return (datetime(2026, month, day, hour, minute) + timedelta(hours=4)).isoformat()


# Cada entry: (id, home_team, away_team, match_datetime_utc_iso, stage)
_RAW = [
    # ══ JORNADA 1 — Jun 11-17 ════════════════════════════════════════════════
    (1,  "Corea del Sur",   "Chequia",          _utc(6,11,17),    "Grupo A"),
    (2,  "México",          "Sudáfrica",        _utc(6,11,20),    "Grupo A"),
    (3,  "Canadá",          "Bosnia y Her.",    _utc(6,12,15),    "Grupo B"),
    (4,  "EE.UU.",          "Paraguay",         _utc(6,12,21),    "Grupo D"),
    (5,  "Haití",           "Escocia",          _utc(6,13,15),    "Grupo C"),
    (6,  "Qatar",           "Suiza",            _utc(6,13,18),    "Grupo B"),
    (7,  "Brasil",          "Marruecos",        _utc(6,13,21),    "Grupo C"),
    (8,  "Suecia",          "Túnez",            _utc(6,14, 9),    "Grupo F"),
    (9,  "Países Bajos",    "Japón",            _utc(6,14,12),    "Grupo F"),
    (10, "Australia",       "Turquía",          _utc(6,14,15),    "Grupo D"),
    (11, "Alemania",        "Curazao",          _utc(6,14,18),    "Grupo E"),
    (12, "Costa de Marfil", "Ecuador",          _utc(6,14,21),    "Grupo E"),
    (13, "España",          "Cabo Verde",       _utc(6,15,12),    "Grupo H"),
    (14, "Bélgica",         "Egipto",           _utc(6,15,15),    "Grupo G"),
    (15, "Arabia Saudita",  "Uruguay",          _utc(6,15,18),    "Grupo H"),
    (16, "Irán",            "Nueva Zelanda",    _utc(6,15,21),    "Grupo G"),
    (17, "Francia",         "Senegal",          _utc(6,16,15),    "Grupo I"),
    (18, "Irak",            "Noruega",          _utc(6,16,18),    "Grupo I"),
    (19, "Argentina",       "Argelia",          _utc(6,16,21),    "Grupo J"),
    (20, "Austria",         "Jordania",         _utc(6,17, 0),    "Grupo J"),
    (21, "Portugal",        "RD Congo",         _utc(6,17,13),    "Grupo K"),
    (22, "Inglaterra",      "Croacia",          _utc(6,17,16),    "Grupo L"),
    (23, "Ghana",           "Panamá",           _utc(6,17,19),    "Grupo L"),
    (24, "Colombia",        "Uzbekistán",       _utc(6,17,22),    "Grupo K"),

    # ══ JORNADA 2 — Jun 18-21 ════════════════════════════════════════════════
    (25, "Suiza",           "Bosnia y Her.",    _utc(6,18,12),    "Grupo B"),
    (26, "Chequia",         "Sudáfrica",        _utc(6,18,15),    "Grupo A"),
    (27, "México",          "Corea del Sur",    _utc(6,18,18),    "Grupo A"),
    (28, "Canadá",          "Qatar",            _utc(6,18,21),    "Grupo B"),
    (29, "EE.UU.",          "Australia",        _utc(6,19,12),    "Grupo D"),
    (30, "Turquía",         "Paraguay",         _utc(6,19,15),    "Grupo D"),
    (31, "Escocia",         "Marruecos",        _utc(6,19,18),    "Grupo C"),
    (32, "Brasil",          "Haití",            _utc(6,19,21),    "Grupo C"),
    (33, "Países Bajos",    "Suecia",           _utc(6,20,15),    "Grupo F"),
    (34, "Alemania",        "Costa de Marfil",  _utc(6,20,18),    "Grupo E"),
    (35, "Ecuador",         "Curazao",          _utc(6,20,21),    "Grupo E"),
    (36, "Túnez",           "Japón",            _utc(6,21,12),    "Grupo F"),
    (37, "España",          "Arabia Saudita",   _utc(6,21,15),    "Grupo H"),
    (38, "Uruguay",         "Cabo Verde",       _utc(6,21,18),    "Grupo H"),
    (39, "Bélgica",         "Irán",             _utc(6,21,15),    "Grupo G"),
    (40, "Nueva Zelanda",   "Egipto",           _utc(6,21,21),    "Grupo G"),

    # ══ JORNADA 3 — Jun 22-28 ════════════════════════════════════════════════
    (41, "Argentina",       "Austria",          _utc(6,22,13),    "Grupo J"),
    (42, "Francia",         "Irak",             _utc(6,22,17),    "Grupo I"),
    (43, "Noruega",         "Senegal",          _utc(6,22,20),    "Grupo I"),
    (44, "Jordania",        "Argelia",          _utc(6,22,23),    "Grupo J"),
    (45, "Portugal",        "Uzbekistán",       _utc(6,23,13),    "Grupo K"),
    (46, "Inglaterra",      "Ghana",            _utc(6,23,16),    "Grupo L"),
    (47, "Panamá",          "Croacia",          _utc(6,23,19),    "Grupo L"),
    (48, "Colombia",        "RD Congo",         _utc(6,23,22),    "Grupo K"),
    (49, "Bosnia y Her.",   "Qatar",            _utc(6,24,15),    "Grupo B"),
    (50, "Suiza",           "Canadá",           _utc(6,24,15),    "Grupo B"),
    (51, "Marruecos",       "Haití",            _utc(6,24,18),    "Grupo C"),
    (52, "Escocia",         "Brasil",           _utc(6,24,18),    "Grupo C"),
    (53, "Chequia",         "México",           _utc(6,24,21),    "Grupo A"),
    (54, "Corea del Sur",   "Sudáfrica",        _utc(6,24,21),    "Grupo A"),
    (55, "Curazao",         "Costa de Marfil",  _utc(6,25,16),    "Grupo E"),
    (56, "Ecuador",         "Alemania",         _utc(6,25,16),    "Grupo E"),
    (57, "Japón",           "Suecia",           _utc(6,25,19),    "Grupo F"),
    (58, "Túnez",           "Países Bajos",     _utc(6,25,19),    "Grupo F"),
    (59, "Paraguay",        "Australia",        _utc(6,25,22),    "Grupo D"),
    (60, "Turquía",         "EE.UU.",           _utc(6,25,22),    "Grupo D"),
    (61, "Noruega",         "Francia",          _utc(6,26,15),    "Grupo I"),
    (62, "Senegal",         "Irak",             _utc(6,26,15),    "Grupo I"),
    (63, "Cabo Verde",      "Arabia Saudita",   _utc(6,26,20),    "Grupo H"),
    (64, "Uruguay",         "España",           _utc(6,26,20),    "Grupo H"),
    (65, "Egipto",          "Irán",             _utc(6,26,23),    "Grupo G"),
    (66, "Nueva Zelanda",   "Bélgica",          _utc(6,26,23),    "Grupo G"),
    (67, "Croacia",         "Ghana",            _utc(6,27,17),    "Grupo L"),
    (68, "Panamá",          "Inglaterra",       _utc(6,27,17),    "Grupo L"),
    (69, "Colombia",        "Portugal",         _utc(6,27,19,30), "Grupo K"),
    (70, "RD Congo",        "Uzbekistán",       _utc(6,27,19,30), "Grupo K"),
    (71, "Argelia",         "Austria",          _utc(6,27,22),    "Grupo J"),
    (72, "Jordania",        "Argentina",        _utc(6,27,22),    "Grupo J"),

    # ══ 16VOS DE FINAL — Jun 28-Jul 3 ════════════════════════════════════════
    (73, "Brasil",           "Japón",                _utc(6,29,13),    "16vos"),      # 29/6 14:00 ART
    (74, "Sudáfrica",        "Canadá",               _utc(6,28,15),    "16vos"),      # 28/6 16:00 ART (ayer)
    (75, "Países Bajos",     "Marruecos",            _utc(6,29,21),    "16vos"),      # 29/6 22:00 ART
    (76, "Alemania",         "Paraguay",             _utc(6,29,16,30), "16vos"),      # 29/6 17:30 ART
    (77, "Costa de Marfil",  "Noruega",              _utc(6,30,13),    "16vos"),      # 30/6 14:00 ART
    (78, "México",           "Ecuador",              _utc(6,30,21),    "16vos"),      # 30/6 22:00 ART
    (79, "Francia",          "Suecia",               _utc(6,30,17),    "16vos"),      # 30/6 18:00 ART
    (80, "Bélgica",          "Senegal",              _utc(7, 1,16),    "16vos"),      # 1/7 17:00 ART
    (81, "Estados Unidos",   "Bosnia y Herzegovina", _utc(7, 1,20),    "16vos"),      # 1/7 21:00 ART
    (82, "Inglaterra",       "RD Congo",             _utc(7, 1,12),    "16vos"),      # 1/7 13:00 ART
    (83, "España",           "Austria",              _utc(7, 2,15),    "16vos"),      # 2/7 16:00 ART
    (84, "Portugal",         "Croacia",              _utc(7, 2,19),    "16vos"),      # 2/7 20:00 ART
    (85, "Suiza",            "Argelia",              _utc(7, 2,23),    "16vos"),      # 3/7 00:00 ART
    (86, "Australia",        "Egipto",               _utc(7, 3,14),    "16vos"),      # 3/7 15:00 ART
    (87, "Colombia",         "Ghana",               _utc(7, 3,21,30), "16vos"),      # 3/7 22:30 ART
    (88, "Argentina",        "Cabo Verde",           _utc(7, 3,18),    "16vos"),      # 3/7 19:00 ART

    # ══ 8VOS DE FINAL — Jun 30 - Jul 7 ═══════════════════════════════════════
    (89, "Canadá",       "Marruecos",     _utc(6,30,14),    "Octavos de final"),      # 30/6 14:00 ART (mañana)
    (90, "Paraguay",     "Francia",       _utc(6,30,18),    "Octavos de final"),      # 30/6 18:00 ART (mañana)
    (91, "Brasil",       "Noruega",       _utc(7, 5,17),    "Octavos de final"),      # 5/7 17:00 ART
    (92, "México",       "Inglaterra",    _utc(7, 5,21),    "Octavos de final"),      # 5/7 21:00 ART
    (93, "Portugal",     "España",        _utc(7, 6,16),    "Octavos de final"),      # 6/7 16:00 ART
    (94, "Estados Unidos", "Bélgica",     _utc(7, 6,21),    "Octavos de final"),      # 6/7 21:00 ART
    (95, "8vos TBD 13",  "8vos TBD 14",   _utc(7, 7,13),    "Octavos de final"),      # 7/7 13:00 ART (A definir)
    (96, "Suiza",        "8vos TBD 16",   _utc(7, 7,17),    "Octavos de final"),      # 7/7 17:00 ART (Suiza vs A definir)

    # ══ 4TOS DE FINAL — Jul 9-11 ═════════════════════════════════════════════
    (97, "4tos TBD 1",   "4tos TBD 2",    _utc(7, 9,16),    "4tos de final"),
    (98, "4tos TBD 3",   "4tos TBD 4",    _utc(7,10,15),    "4tos de final"),
    (99, "4tos TBD 5",   "4tos TBD 6",    _utc(7,11,15),    "4tos de final"),
    (100, "4tos TBD 7",  "4tos TBD 8",    _utc(7,11,19),    "4tos de final"),

    # ══ SEMIFINALES — Jul 14-15 ══════════════════════════════════════════════
    (101, "Semi TBD 1",  "Semi TBD 2",    _utc(7,14,15),    "Semifinales"),
    (102, "Semi TBD 3",  "Semi TBD 4",    _utc(7,15,15),    "Semifinales"),

    # ══ FINAL Y TERCER PUESTO — Jul 18-19 ════════════════════════════════════
    (103, "3er puesto TBD 1", "3er puesto TBD 2", _utc(7,18,15), "Tercer puesto"),
    (104, "Final TBD 1", "Final TBD 2",   _utc(7,19,15),    "Final"),
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
