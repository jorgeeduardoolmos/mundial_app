import streamlit as st
from modules.ranking import get_ranking, get_group_stats
from modules.groups import get_user_groups
from utils.session import get_db_session, require_login

MEDALS = ["🥇", "🥈", "🥉"]


def show():
    require_login()
    user_id = st.session_state.user_id

    st.title("🏆 Ranking")

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
    selected_name = st.selectbox("Grupo:", list(group_options.keys()))
    selected_group = group_options[selected_name]

    st.divider()

    # ── Stats generales ───────────────────────────────────────────────────
    db = get_db_session()
    try:
        ranking = get_ranking(db, selected_group.id)
        stats = get_group_stats(db, selected_group.id)
    finally:
        db.close()

    col1, col2, col3 = st.columns(3)
    col1.metric("Partidos jugados", stats["matches_finished"])
    col2.metric("Miembros", len(ranking))
    col3.metric("Predicciones totales", stats["total_predictions"])

    st.divider()

    if not ranking:
        st.info("Todavía no hay datos para mostrar.")
        return

    # ── Podio top 3 ───────────────────────────────────────────────────────
    if len(ranking) >= 3:
        st.markdown("### Podio")
        p1, p2, p3 = st.columns(3)
        for col, pos, entry in zip([p2, p1, p3], [1, 0, 2], ranking[:3]):
            medal = MEDALS[pos]
            with col:
                st.markdown(f"#### {medal} {entry['display_name']}")
                st.markdown(f"## **{entry['total_pts']} pts**")
                st.caption(f"@{entry['username']}")
        st.divider()

    # ── Tabla completa ────────────────────────────────────────────────────
    st.markdown("### Tabla completa")

    for i, entry in enumerate(ranking):
        is_me = entry["user_id"] == user_id
        medal = MEDALS[i] if i < 3 else f"#{i+1}"
        name_str = f"**{entry['display_name']}** {'← vos' if is_me else ''}"

        with st.container():
            col_pos, col_name, col_pts, col_detail = st.columns([1, 4, 2, 4])

            with col_pos:
                st.markdown(f"### {medal}")
            with col_name:
                st.markdown(name_str)
                st.caption(f"@{entry['username']}")
            with col_pts:
                st.markdown(f"## {entry['total_pts']}")
                st.caption("puntos")
            with col_detail:
                st.caption(
                    f"✅ {entry['played']} puntuados  "
                    f"·  🎯 {entry['exact_scores']} exactos  "
                    f"·  ⏳ {entry['pending']} pendientes"
                )

        if i < len(ranking) - 1:
            st.divider()
