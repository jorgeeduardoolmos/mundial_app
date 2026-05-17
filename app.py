import streamlit as st
from db.models import init_db
from utils.session import init_session, is_logged_in, logout_user
from utils.theme import inject_css, sidebar_logo, sidebar_user, sidebar_separator
from views import auth_page, groups_page, matches_page, predictions_page, ranking_page

st.set_page_config(
    page_title="Prode Mundial 2026",
    page_icon="⚽",
    layout="centered",
)

inject_css()
init_db()
init_session()

# ── Capture ?invite= token ────────────────────────────────────────────────
params = st.query_params
invite_token = params.get("invite", None)
if invite_token and not st.session_state.get("pending_invite_token"):
    st.session_state.pending_invite_token = invite_token

# ── SIDEBAR ───────────────────────────────────────────────────────────────
with st.sidebar:
    sidebar_logo()

    if is_logged_in():
        # ── Navegación ────────────────────────────────────────────────────
        default_nav = "Mis grupos" if st.session_state.get("pending_invite_token") else "Inicio"

        nav_labels = ["Inicio", "Ranking", "Mis predicciones", "Partidos", "Mis grupos"]
        nav_keys   = ["Inicio", "Ranking", "Predecir",         "Partidos", "Mis grupos"]

        # Separadores visuales entre grupos de nav
        # Grupo 1: Inicio
        # Grupo 2: Ranking, Predecir  (acciones del usuario)
        # Grupo 3: Partidos, Mis grupos (datos)
        nav_with_sep = [
            "Inicio",
            "— sep —",
            "Ranking",
            "Mis predicciones",
            "— sep —",
            "Partidos",
            "Mis grupos",
        ]

        # Usamos radio oculto para el estado real
        default_idx = nav_keys.index(default_nav)
        nav_selection = st.radio(
            "nav",
            nav_labels,
            index=default_idx,
            label_visibility="collapsed",
        )
        nav = nav_keys[nav_labels.index(nav_selection)]

        # ── Usuario y logout ──────────────────────────────────────────────
        sidebar_separator()
        sidebar_user(st.session_state.display_name, st.session_state.username)

        if st.button("Cerrar sesión", use_container_width=True):
            logout_user()
            st.rerun()
    else:
        nav = "Auth"

# ── ROUTING ───────────────────────────────────────────────────────────────
if not is_logged_in():
    auth_page.show()

elif nav == "Inicio":
    st.title(f"Hola, {st.session_state.display_name}")
    st.caption("Mundial 2026 · Prode con amigos")
    st.divider()
    st.markdown("""
**¿Cómo funciona?**

Predecí el resultado de cada partido antes de que empiece.
Cuanto más acertés, más puntos sumás en el ranking de tu grupo.
""")
    st.markdown("""
| Acierto | Puntos |
|---|---|
| Ganador o empate | 2 pts |
| Goles del ganador | 2 pts |
| Goles del perdedor | 2 pts |
| Empate + marcador exacto | 4 pts extra |
""")

elif nav == "Mis grupos":
    groups_page.show()

elif nav == "Partidos":
    matches_page.show()

elif nav == "Predecir":
    predictions_page.show()

elif nav == "Ranking":
    ranking_page.show()
