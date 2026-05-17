import streamlit as st
from modules.matches import (
    get_all_matches, is_open_for_prediction, format_match_datetime
)
from modules.predictions import (
    get_prediction, save_prediction, get_user_predictions_in_group
)
from modules.groups import get_user_groups
from utils.session import get_db_session, require_login


def show():
    require_login()
    user_id = st.session_state.user_id

    st.title("🎯 Mis predicciones")

    # ── Seleccionar grupo ─────────────────────────────────────────────────
    db = get_db_session()
    try:
        groups = get_user_groups(db, user_id)
    finally:
        db.close()

    if not groups:
        st.warning("Primero tenés que unirte o crear un grupo en **Mis grupos**.")
        return

    group_options = {g.name: g for g in groups}
    selected_name = st.selectbox("Predecir en el grupo:", list(group_options.keys()))
    selected_group = group_options[selected_name]

    st.divider()

    # ── Tabs: Predecir / Ver mis predicciones ─────────────────────────────
    tab_open, tab_mine = st.tabs(["📝 Predecir partidos", "📋 Mis predicciones"])

    # ── TAB 1: Partidos abiertos para predecir ────────────────────────────
    with tab_open:
        db = get_db_session()
        try:
            all_matches = get_all_matches(db)
            open_matches = [m for m in all_matches if is_open_for_prediction(m)]
        finally:
            db.close()

        if not open_matches:
            st.info("No hay partidos abiertos para predecir en este momento.")
        else:
            st.caption(f"{len(open_matches)} partido(s) disponibles para predecir")

            for match in open_matches:
                db = get_db_session()
                try:
                    existing = get_prediction(db, user_id, match.id, selected_group.id)
                finally:
                    db.close()

                pred_label = ""
                if existing is not None:
                    pred_label = f"  ✏️ Tu predicción: **{existing.predicted_home_goals}–{existing.predicted_away_goals}**"

                with st.expander(
                    f"🟡 {match.home_team} vs {match.away_team}  ·  {format_match_datetime(match.match_datetime)}{pred_label}",
                    expanded=(existing is None)
                ):
                    st.caption(f"Fase: {match.stage}")

                    col1, col2, col3 = st.columns([3, 1, 3])
                    with col1:
                        st.markdown(f"**{match.home_team}**")
                        hg = st.number_input(
                            "Goles",
                            min_value=0, max_value=20,
                            value=existing.predicted_home_goals if existing else 0,
                            key=f"ph_{match.id}_{selected_group.id}",
                            label_visibility="collapsed"
                        )
                    with col2:
                        st.markdown("###")
                        st.markdown("**—**")
                    with col3:
                        st.markdown(f"**{match.away_team}**")
                        ag = st.number_input(
                            "Goles",
                            min_value=0, max_value=20,
                            value=existing.predicted_away_goals if existing else 0,
                            key=f"pa_{match.id}_{selected_group.id}",
                            label_visibility="collapsed"
                        )

                    btn_label = "💾 Actualizar predicción" if existing else "💾 Guardar predicción"
                    if st.button(btn_label, key=f"save_pred_{match.id}_{selected_group.id}"):
                        db = get_db_session()
                        try:
                            ok, msg = save_prediction(
                                db, user_id, match.id, selected_group.id, hg, ag
                            )
                            if ok:
                                st.success(msg)
                                st.rerun()
                            else:
                                st.error(msg)
                        finally:
                            db.close()

    # ── TAB 2: Historial de predicciones ──────────────────────────────────
    with tab_mine:
        db = get_db_session()
        try:
            my_preds = get_user_predictions_in_group(db, user_id, selected_group.id)
            # Cargar partidos relacionados en la misma sesión
            preds_data = []
            for p in my_preds:
                m = p.match
                preds_data.append({
                    "home": m.home_team,
                    "away": m.away_team,
                    "datetime": format_match_datetime(m.match_datetime),
                    "stage": m.stage,
                    "pred_home": p.predicted_home_goals,
                    "pred_away": p.predicted_away_goals,
                    "finished": m.is_finished,
                    "real_home": m.home_goals,
                    "real_away": m.away_goals,
                    "points": p.points_earned,
                })
        finally:
            db.close()

        if not preds_data:
            st.info("Todavía no hiciste ninguna predicción en este grupo.")
        else:
            total_pts = sum(p["points"] or 0 for p in preds_data if p["finished"])
            st.metric("Puntos acumulados en este grupo", total_pts)
            st.divider()

            for p in sorted(preds_data, key=lambda x: x["datetime"]):
                if p["finished"]:
                    pts = p["points"] or 0
                    pts_label = f"**{pts} pts**"
                    icon = "✅"
                    result_str = f"{p['real_home']}–{p['real_away']}"
                else:
                    pts_label = "pendiente"
                    icon = "🟡"
                    result_str = "por jugar"

                st.markdown(
                    f"{icon} **{p['home']} vs {p['away']}** — "
                    f"Tu predicción: `{p['pred_home']}–{p['pred_away']}` — "
                    f"Resultado: `{result_str}` — {pts_label}"
                )
                st.caption(f"{p['datetime']}  ·  {p['stage']}")
