import streamlit as st
from db.models import init_db
from utils.session import init_session, is_logged_in, logout_user
from pages import auth_page

st.set_page_config(
    page_title="Prode Mundial 2026",
    page_icon="⚽",
    layout="centered",
)

# Bootstrap DB and session
init_db()
init_session()

# ── SIDEBAR ───────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚽ Prode Mundial 2026")
    st.divider()

    if is_logged_in():
        st.markdown(f"👤 **{st.session_state.display_name}**")
        st.caption(f"@{st.session_state.username}")
        st.divider()

        nav = st.radio(
            "Navegación",
            ["Inicio", "Mis grupos", "Partidos", "Ranking"],
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
    st.info("El prode del Mundial 2026 está en construcción. Los módulos de grupos, partidos y predicciones se van a ir habilitando de a uno.")
    st.markdown("""
    #### ¿Qué podés hacer?
    - 🏟️ **Grupos**: crear un grupo privado y compartirlo con tus amigos
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
    st.title("Mis grupos")
    st.info("🔧 Módulo 2 — próximamente.")

elif nav == "Partidos":
    st.title("Partidos")
    st.info("🔧 Módulo 3 — próximamente.")

elif nav == "Ranking":
    st.title("Ranking")
    st.info("🔧 Módulo 5 — próximamente.")
