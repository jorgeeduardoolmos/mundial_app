import streamlit as st
from modules.auth import authenticate_user, create_user, validate_register
from utils.session import get_db_session, login_user, is_logged_in
from modules.groups import get_group_by_token


def show():
    if is_logged_in():
        st.info(f"Ya estás logueado como **{st.session_state.display_name}**.")
        return

    st.title("⚽ Mundial 2026 — Prode")

    # Show invite banner if arriving via magic link
    pending = st.session_state.get("pending_invite_token")
    if pending:
        db = get_db_session()
        try:
            group = get_group_by_token(db, pending)
            if group:
                st.success(f"🎉 Fuiste invitado al grupo **{group.name}**. Iniciá sesión o creá una cuenta para unirte.")
        finally:
            db.close()
    else:
        st.caption("Competí con amigos adivinando los resultados del Mundial.")

    tab_login, tab_register = st.tabs(["Iniciar sesión", "Crear cuenta"])

    # ── LOGIN ──────────────────────────────────────────────────────────────
    with tab_login:
        with st.form("login_form"):
            username = st.text_input("Usuario")
            password = st.text_input("Contraseña", type="password")
            submitted = st.form_submit_button("Entrar", use_container_width=True)

        if submitted:
            if not username or not password:
                st.error("Completá usuario y contraseña.")
            else:
                db = get_db_session()
                try:
                    user = authenticate_user(db, username, password)
                    if user:
                        login_user(user)
                        st.success(f"¡Bienvenido, {user.display_name}!")
                        st.rerun()
                    else:
                        st.error("Usuario o contraseña incorrectos.")
                finally:
                    db.close()

    # ── REGISTER ───────────────────────────────────────────────────────────
    with tab_register:
        with st.form("register_form"):
            display_name = st.text_input("¿Cómo querés que te llamen?")
            new_username = st.text_input("Nombre de usuario")
            new_email = st.text_input("Email")
            new_password = st.text_input("Contraseña", type="password")
            confirm_password = st.text_input("Repetí la contraseña", type="password")
            submitted_reg = st.form_submit_button("Crear cuenta", use_container_width=True)

        if submitted_reg:
            db = get_db_session()
            try:
                errors = validate_register(db, new_username, new_email, new_password, confirm_password)
                if not display_name.strip():
                    errors.insert(0, "Ingresá cómo querés que te llamen.")
                if errors:
                    for e in errors:
                        st.error(e)
                else:
                    user = create_user(db, new_username, new_email, new_password, display_name)
                    login_user(user)
                    st.success("¡Cuenta creada! Bienvenido/a 🎉")
                    st.rerun()
            finally:
                db.close()
