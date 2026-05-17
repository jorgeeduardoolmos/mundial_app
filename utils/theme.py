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
