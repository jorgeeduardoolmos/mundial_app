import base64
import os
import streamlit as st
from modules.auth import authenticate_user, create_user, validate_register
from utils.session import get_db_session, login_user, is_logged_in
from modules.groups import get_group_by_token


def _get_copa_b64() -> str:
    img_path = os.path.join(os.path.dirname(__file__), "..", "static", "copa.png")
    img_path = os.path.normpath(img_path)
    try:
        with open(img_path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except FileNotFoundError:
        return ""


def _render_shell():
    """Inyecta el CSS específico de la pantalla de auth."""
    st.markdown("""
<style>
/* Centrar y limitar ancho del contenido de auth */
[data-testid="stAppViewContainer"] > .main .block-container {
    max-width: 360px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    padding-top: 48px !important;
}
/* Ocultar labels de los inputs en auth */
.auth-field label { display: none !important; }
.auth-field .stTextInput > label { display: none !important; }

/* Inputs con borde dorado */
.auth-field .stTextInput > div > div > input {
    background-color: #141414 !important;
    border: 0.5px solid #c9a84c66 !important;
    border-radius: 7px !important;
    color: #e8e0cc !important;
    font-size: 13px !important;
    padding: 13px 16px !important;
    letter-spacing: 0.2px !important;
}
.auth-field .stTextInput > div > div > input:focus {
    border-color: #c9a84c !important;
    box-shadow: 0 0 0 1px #c9a84c22, 0 0 16px #c9a84c11 !important;
    outline: none !important;
}
/* Anular el rojo de Streamlit en cualquier estado */
.auth-field .stTextInput > div > div {
    border: none !important;
    box-shadow: none !important;
}
.auth-field [data-baseweb="input"] {
    border: none !important;
    box-shadow: none !important;
}
.auth-field [data-baseweb="base-input"] {
    background-color: #141414 !important;
    border: 0.5px solid #c9a84c66 !important;
    border-radius: 7px !important;
}
.auth-field [data-baseweb="base-input"]:focus-within {
    border-color: #c9a84c !important;
    box-shadow: 0 0 0 1px #c9a84c22 !important;
}
/* Botón entrar */
.auth-submit .stFormSubmitButton > button {
    background-color: #c9a84c !important;
    border: none !important;
    color: #0a0a0a !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    padding: 12px !important;
    border-radius: 7px !important;
    width: 100% !important;
}
.auth-submit .stFormSubmitButton > button:hover {
    background-color: #d4b56a !important;
}
/* Botón Crear Jugador — centrado */
[data-testid="stAppViewContainer"] .auth-switch {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}
[data-testid="stAppViewContainer"] .auth-switch .stButton {
    display: flex !important;
    justify-content: center !important;
}
[data-testid="stAppViewContainer"] .auth-switch .stButton > button {
    background: transparent !important;
    border: none !important;
    color: #c9a84c !important;
    font-size: 12px !important;
    letter-spacing: 1px !important;
    padding: 8px 0 !important;
    text-decoration: none !important;
    box-shadow: none !important;
}
[data-testid="stAppViewContainer"] .auth-switch .stButton > button:hover {
    color: #d4b56a !important;
    background: transparent !important;
    border: none !important;
}
/* Tabs ocultos */
.auth-tabs .stTabs [data-baseweb="tab-list"] { display: none !important; }
.auth-tabs .stTabs [data-baseweb="tab-panel"] { padding: 0 !important; }
</style>
""", unsafe_allow_html=True)


def show():
    if is_logged_in():
        st.rerun()
        return

    _render_shell()

    # ── Init mode en session_state ────────────────────────────────────────
    if "auth_mode" not in st.session_state:
        st.session_state.auth_mode = "login"

    # ── Invite banner ─────────────────────────────────────────────────────
    pending = st.session_state.get("pending_invite_token")
    if pending:
        db = get_db_session()
        try:
            group = get_group_by_token(db, pending)
            if group:
                st.markdown(f"""
<div style="border:0.5px solid #c9a84c44;border-radius:8px;padding:12px 16px;margin-bottom:24px;background:#c9a84c08;">
  <span style="font-size:12px;color:#c9a84c;letter-spacing:0.3px;">
    Fuiste invitado al grupo <strong>{group.name}</strong>
  </span>
</div>
""", unsafe_allow_html=True)
        finally:
            db.close()

    # ── Logo ──────────────────────────────────────────────────────────────
    st.markdown("""
<div style="text-align:center;margin-bottom:40px;">
  <div style="font-size:11px;font-weight:500;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Prode</div>
  <div style="font-size:10px;color:#2e2e2e;letter-spacing:1px;">Mundial 2026</div>
</div>
""", unsafe_allow_html=True)

    # ── Formulario LOGIN ──────────────────────────────────────────────────
    if st.session_state.auth_mode == "login":
        with st.form("login_form"):
            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                username = st.text_input("u", placeholder="", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                password = st.text_input("p", type="password", placeholder="", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            # Línea dorada difuminada
            st.markdown("""
<div style="height:0.5px;background:linear-gradient(to right,transparent 0%,#c9a84c88 30%,#c9a84c88 70%,transparent 100%);margin:8px 0 20px;"></div>
""", unsafe_allow_html=True)

            st.markdown('<div class="auth-submit">', unsafe_allow_html=True)
            submitted = st.form_submit_button("Entrar", use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        if submitted:
            if not username or not password:
                st.error("Completá los campos.")
            else:
                db = get_db_session()
                try:
                    user = authenticate_user(db, username, password)
                    if user:
                        login_user(user)
                        st.rerun()
                    else:
                        st.error("Usuario o contraseña incorrectos.")
                finally:
                    db.close()

        # Switch a registro
        st.markdown('<div class="auth-switch">', unsafe_allow_html=True)
        if st.button("Crear Jugador", use_container_width=False, key="goto_register"):
            st.session_state.auth_mode = "register"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    # ── Formulario REGISTRO ───────────────────────────────────────────────
    else:
        with st.form("register_form"):
            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                display_name = st.text_input("n", placeholder="Nombre", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                new_username = st.text_input("u", placeholder="Usuario", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                new_email = st.text_input("e", placeholder="Email", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                new_password = st.text_input("pw", type="password", placeholder="Contraseña", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            with st.container():
                st.markdown('<div class="auth-field">', unsafe_allow_html=True)
                confirm_password = st.text_input("cpw", type="password", placeholder="Repetir contraseña", label_visibility="collapsed")
                st.markdown('</div>', unsafe_allow_html=True)

            st.markdown("""
<div style="height:0.5px;background:linear-gradient(to right,transparent 0%,#c9a84c88 30%,#c9a84c88 70%,transparent 100%);margin:8px 0 20px;"></div>
""", unsafe_allow_html=True)

            st.markdown('<div class="auth-submit">', unsafe_allow_html=True)
            submitted_reg = st.form_submit_button("Crear Jugador", use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        if submitted_reg:
            db = get_db_session()
            try:
                errors = validate_register(db, new_username, new_email, new_password, confirm_password)
                if not display_name.strip():
                    errors.insert(0, "Ingresá tu nombre.")
                if errors:
                    for e in errors:
                        st.error(e)
                else:
                    user = create_user(db, new_username, new_email, new_password, display_name)
                    login_user(user)
                    st.rerun()
            finally:
                db.close()

        st.markdown('<div class="auth-switch">', unsafe_allow_html=True)
        if st.button("← Volver", use_container_width=False, key="goto_login"):
            st.session_state.auth_mode = "login"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    # ── Copa del Mundo ────────────────────────────────────────────────────
    copa_b64 = _get_copa_b64()
    if copa_b64:
        st.markdown(f"""
<div style="display:flex;justify-content:center;margin-top:40px;">
  <img src="data:image/png;base64,{copa_b64}"
       style="width:110px;opacity:0.88;filter:drop-shadow(0 8px 28px #c9a84c33);"
       alt="Copa del Mundo"/>
</div>
""", unsafe_allow_html=True)
