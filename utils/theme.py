import streamlit as st
import os


def inject_css():
    css_path = os.path.join(os.path.dirname(__file__), "..", ".streamlit", "style.css")
    css_path = os.path.normpath(css_path)
    try:
        with open(css_path) as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
    except FileNotFoundError:
        pass


def sidebar_logo():
    st.sidebar.markdown("""
<div style="display:flex;align-items:center;gap:10px;padding:4px 0 24px;">
  <div style="width:30px;height:30px;background:#c9a84c;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">⚽</div>
  <div>
    <div style="font-size:12px;font-weight:500;color:#c9a84c;letter-spacing:0.4px;">Prode</div>
    <div style="font-size:10px;color:#2e2e2e;letter-spacing:0.3px;">Mundial 2026</div>
  </div>
</div>
""", unsafe_allow_html=True)


def sidebar_user(display_name: str, username: str):
    initials = "".join(w[0].upper() for w in display_name.split()[:2])
    st.sidebar.markdown(f"""
<div style="border-top:0.5px solid #141414;padding:16px 0 4px;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
    <div style="width:30px;height:30px;border-radius:50%;background:#c9a84c18;border:0.5px solid #c9a84c33;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;color:#c9a84c;flex-shrink:0;">{initials}</div>
    <div>
      <div style="font-size:12px;font-weight:500;color:#e8e0cc;">{display_name}</div>
      <div style="font-size:10px;color:#2e2e2e;margin-top:1px;">@{username}</div>
    </div>
  </div>
</div>
""", unsafe_allow_html=True)


def sidebar_separator():
    st.sidebar.markdown("""
<div style="margin:6px 0;height:0.5px;background:linear-gradient(to right,#1c1c1c 0%,#1c1c1c 60%,transparent 100%);"></div>
""", unsafe_allow_html=True)
