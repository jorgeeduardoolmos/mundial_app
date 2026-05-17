import streamlit as st
from db.models import SessionLocal


def get_db_session():
    """Returns a SQLAlchemy session. Caller is responsible for closing it."""
    return SessionLocal()


def init_session():
    """Initialize all session state keys if they don't exist."""
    defaults = {
        "user_id": None,
        "username": None,
        "display_name": None,
        "logged_in": False,
        "pending_invite_token": None,
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val


def login_user(user):
    st.session_state.user_id = user.id
    st.session_state.username = user.username
    st.session_state.display_name = user.display_name
    st.session_state.logged_in = True


def logout_user():
    st.session_state.user_id = None
    st.session_state.username = None
    st.session_state.display_name = None
    st.session_state.logged_in = False
    st.session_state.pending_invite_token = None


def is_logged_in() -> bool:
    return st.session_state.get("logged_in", False)


def require_login():
    """Call at the top of any protected page. Stops execution if not logged in."""
    if not is_logged_in():
        st.warning("Tenés que iniciar sesión para ver esta página.")
        st.stop()
