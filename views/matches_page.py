import streamlit as st
from modules.matches import (
    get_all_matches, get_stages, set_match_result,
    is_open_for_prediction, format_match_datetime
)
from modules.predictions import score_all_predictions_for_match
from db.seed import seed_matches
from utils.session import get_db_session, require_login

# Usuario admin (podés cambiar esto por tu username)
ADMIN_USERS = {"jorgeeduardoolmos"}


def show():
    require_login()

    # Sembrar partidos si la tabla está vacía
    db = get_db_session()
    try:
        inserted = seed_matches(db)
        if inserted:
            st.toast(f"✅ {inserted} partidos cargados en la base de datos.")
    finally:
        db.close()

    is_admin = st.session_state.username in ADMIN_USERS

    st.title("⚽ Partidos — Mundial 2026")

    # ── Filtro por fase ───────────────────────────────────────────────────
    db = get_db_session()
    try:
        stages = get_stages(db)
        all_matches = get_all_matches(db)
    finally:
        db.close()

    selected_stage = st.selectbox("Fase", ["Todas"] + stages, index=0)

    matches = all_matches if selected_stage == "Todas" else [
        m for m in all_matches if m.stage == selected_stage
    ]

    # ── Tabla de partidos ─────────────────────────────────────────────────
    st.markdown(f"**{len(matches)} partidos**")

    for match in matches:
        open_pred = is_open_for_prediction(match)

        if match.is_finished:
            status = "✅ Finalizado"
            result = f"**{match.home_goals} — {match.away_goals}**"
            color = "🟢"
        elif open_pred:
            status = "🟡 Abierto"
            result = "vs"
            color = "🟡"
        else:
            status = "🔒 Cerrado"
            result = "vs"
            color = "🔴"

        with st.expander(
            f"{color} {match.home_team} {result} {match.away_team}  ·  {format_match_datetime(match.match_datetime)}  ·  {match.stage}",
            expanded=False
        ):
            col1, col2, col3 = st.columns([2, 1, 2])
            with col1:
                st.markdown(f"### {match.home_team}")
            with col2:
                if match.is_finished:
                    st.markdown(f"## {match.home_goals} — {match.away_goals}", unsafe_allow_html=True)
                else:
                    st.markdown("### vs")
            with col3:
                st.markdown(f"### {match.away_team}")

            st.caption(f"📅 {format_match_datetime(match.match_datetime)}  |  🏟️ {match.stage}")

            if not open_pred and not match.is_finished:
                st.warning("🔒 Predicciones cerradas (menos de 1 hora para el partido).")

            # ── Panel admin: cargar resultado ─────────────────────────────
            if is_admin and not match.is_finished:
                st.divider()
                st.caption("👤 Panel admin — cargar resultado")
                c1, c2, c3 = st.columns([2, 1, 2])
                with c1:
                    hg = st.number_input(
                        f"Goles {match.home_team}",
                        min_value=0, max_value=20, value=0,
                        key=f"hg_{match.id}"
                    )
                with c2:
                    st.markdown("###")
                    st.markdown("**—**")
                with c3:
                    ag = st.number_input(
                        f"Goles {match.away_team}",
                        min_value=0, max_value=20, value=0,
                        key=f"ag_{match.id}"
                    )
                if st.button("💾 Guardar resultado", key=f"save_{match.id}"):
                    db = get_db_session()
                    try:
                        ok, msg = set_match_result(db, match.id, hg, ag)
                        if ok:
                            scored = score_all_predictions_for_match(db, match.id)
                            st.success(f"{msg} Se puntuaron {scored} predicciones.")
                            st.rerun()
                        else:
                            st.error(msg)
                    finally:
                        db.close()
