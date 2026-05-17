import streamlit as st
from db.models import init_db
from utils.session import init_session, is_logged_in, logout_user
from views import auth_page, groups_page, matches_page, predictions_page

st.set_page_config(
    page_title="Prode Mundial 2026",
    page_icon="⚽",
    layout="centered",
)

# Bootstrap DB and session
init_db()
init_session()

# ── Capture ?invite= token from URL (before anything else) ────────────────
params = st.query_params
invite_token = params.get("invite", None)
if invite_token and not st.session_state.get("pending_invite_token"):
    st.session_state.pending_invite_token = invite_token

# ── SIDEBAR ───────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚽ Prode Mundial 2026")
    st.divider()

    if is_logged_in():
        st.markdown(f"👤 **{st.session_state.display_name}**")
        st.caption(f"@{st.session_state.username}")
        st.divider()

        # If user arrived via invite link, default to Mis grupos
        default_nav = "Mis grupos" if st.session_state.get("pending_invite_token") else "Inicio"
        nav_options = ["Inicio", "Mis grupos", "Partidos", "Predecir", "Ranking"]
        default_idx = nav_options.index(default_nav)

        nav = st.radio(
            "Navegación",
            nav_options,
            index=default_idx,
            label_visibility="collapsed",
        )

        st.divider()
        if st.button("Cerrar sesión", use_container_width=True):
            logout_user()
            st.rerun()
    else:
        nav = "Auth"

# ── ROUTING ───────────────────────────────────────────────────────────────
if not is_logged_in():
    auth_page.show()

elif nav == "Inicio":
    st.title(f"¡Hola, {st.session_state.display_name}! 👋")
    st.markdown("""
    #### ¿Qué podés hacer?
    - 🏟️ **Mis grupos**: crear un grupo privado y compartirlo con tus amigos
    - ⚽ **Partidos**: predecir el resultado antes de que empiece
    - 🏆 **Ranking**: ver quién va punteando en tu grupo

    #### Sistema de puntos
    | Acierto | Puntos |
    |---|---|
    | Acertaste quién ganó | 2 pts |
    | Acertaste los goles del ganador | 2 pts |
    | Acertaste los goles del perdedor | 2 pts |
    | Acertaste que fue empate | 2 pts |
    | Acertaste el marcador exacto de un empate | 4 pts |
    """)

elif nav == "Mis grupos":
    groups_page.show()

elif nav == "Partidos":
    matches_page.show()

elif nav == "Predecir":
    predictions_page.show()

elif nav == "Ranking":
    st.title("Ranking")
    st.info("🔧 Módulo 5 — próximamente.")
