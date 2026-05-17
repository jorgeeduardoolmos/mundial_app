import streamlit as st
from modules.groups import (
    create_group, get_user_groups, get_group_members,
    join_group_by_token, regenerate_invite_token, get_group_by_id
)
from utils.session import get_db_session, require_login


def _build_invite_url(token: str) -> str:
    base = "https://mundial2026pronostico.streamlit.app"
    return f"{base}/?invite={token}"


def show():
    require_login()
    user_id = st.session_state.user_id

    st.title("🏟️ Mis grupos")

    # ── Handle pending invite from URL (after login/register) ─────────────
    pending = st.session_state.get("pending_invite_token")
    if pending:
        db = get_db_session()
        try:
            success, msg, group = join_group_by_token(db, pending, user_id)
            if success:
                st.success(f"¡Te uniste a **{group.name}**! 🎉")
            else:
                if "Ya sos miembro" not in msg:
                    st.warning(msg)
            st.session_state.pending_invite_token = None
        finally:
            db.close()

    # ── Tabs ──────────────────────────────────────────────────────────────
    tab_mis, tab_crear = st.tabs(["Mis grupos", "Crear grupo"])

    # ── MIS GRUPOS ────────────────────────────────────────────────────────
    with tab_mis:
        db = get_db_session()
        try:
            groups = get_user_groups(db, user_id)
        finally:
            db.close()

        if not groups:
            st.info("Todavía no pertenecés a ningún grupo. ¡Creá uno o pedile el link a un amigo!")
        else:
            for group in groups:
                db = get_db_session()
                try:
                    members = get_group_members(db, group.id)
                    is_owner = group.owner_id == user_id
                    invite_url = _build_invite_url(group.invite_token)
                finally:
                    db.close()

                with st.expander(f"**{group.name}** — {len(members)} miembro{'s' if len(members) != 1 else ''}", expanded=True):
                    if group.description:
                        st.caption(group.description)

                    # Member list
                    cols = st.columns(min(len(members), 4))
                    for i, member in enumerate(members):
                        with cols[i % 4]:
                            crown = " 👑" if member.id == group.owner_id else ""
                            st.markdown(f"**{member.display_name}**{crown}")
                            st.caption(f"@{member.username}")

                    st.divider()

                    # Invite link
                    st.markdown("**🔗 Link de invitación**")
                    st.code(invite_url, language=None)
                    st.caption("Compartí este link. Quien lo abra entra directo al grupo.")

                    # Regenerate link (owner only)
                    if is_owner:
                        if st.button("🔄 Regenerar link", key=f"regen_{group.id}",
                                     help="El link anterior dejará de funcionar"):
                            db = get_db_session()
                            try:
                                ok, msg = regenerate_invite_token(db, group.id, user_id)
                                if ok:
                                    st.success(msg)
                                    st.rerun()
                                else:
                                    st.error(msg)
                            finally:
                                db.close()

    # ── CREAR GRUPO ───────────────────────────────────────────────────────
    with tab_crear:
        with st.form("create_group_form"):
            name = st.text_input("Nombre del grupo", placeholder="Ej: Los del trabajo, Familia García...")
            description = st.text_area("Descripción (opcional)", placeholder="Una frase para describir el grupo", height=80)
            submitted = st.form_submit_button("Crear grupo ⚽", use_container_width=True)

        if submitted:
            if not name.strip():
                st.error("El nombre del grupo no puede estar vacío.")
            elif len(name.strip()) < 3:
                st.error("El nombre debe tener al menos 3 caracteres.")
            else:
                db = get_db_session()
                try:
                    group = create_group(db, name, description, user_id)
                    invite_url = _build_invite_url(group.invite_token)
                    st.success(f"¡Grupo **{group.name}** creado! 🎉")
                    st.markdown("**Compartí este link con tus amigos:**")
                    st.code(invite_url, language=None)
                    st.rerun()
                finally:
                    db.close()
