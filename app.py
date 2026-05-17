import streamlit as st
import pandas as pd

# Configuraci車n de la p芍gina
st.set_page_config(page_title="Serrano Turismo 2025", layout="wide")

st.title("?? Serrano Turismo - Planes 2025")
st.markdown("Consulta las opciones de pago para tu viaje a C車rdoba.")

# Datos extra赤dos del PDF 
data = {
    "Programa": [
        "C車rdoba 6 d赤as en bus", "C車rdoba 6 d赤as en avi車n", 
        "C車rdoba 5 d赤as en bus", "C車rdoba 5 d赤as en avi車n", 
        "C車rdoba 4 d赤as en avi車n"
    ],
    "Cuota Inscripci車n": [10800, 10800, 9000, 9000, 8100],
    "Valor Total": [690000, 840000, 570000, 720000, 600000],
    "Contado": [600000, 750000, 495000, 645000, 540000],
    "3 cuotas consec.": [230000, 280000, 190000, 240000, 200000],
    "6 cuotas consec.": [150000, 182000, 123500, 156000, 130000],
    "Fija_Plan3": [60000, 60000, 50000, 50000, 45000],
    "Fija_Plan4": [45000, 45000, 37500, 37500, 33750],
    "IPC_18": [28333, 36667, 23333, 31667, 25833],
    "IPC_17": [30000, 38824, 24706, 33529, 27353],
    "IPC_16": [31875, 41250, 26250, 35625, 29063]
}

df = pd.DataFrame(data)

# Selector en la barra lateral
opcion = st.sidebar.selectbox("Selecciona tu viaje:", df["Programa"])
viaje = df[df["Programa"] == opcion].iloc[0]

# M谷tricas principales
c1, c2, c3 = st.columns(3)
c1.metric("Valor Lista", f"${viaje['Valor Total']:,}")
c2.metric("Pago Contado", f"${viaje['Contado']:,}")
c3.metric("Inscripci車n", f"${viaje['Cuota Inscripci車n']:,}")

st.divider()

# Tabs para organizar la info [cite: 4, 9]
t1, t2 = st.tabs(["Cuotas Fijas/Consecutivas", "Plan Mixto (IPC)"])

with t1:
    st.write("### Opciones de cuotas fijas consecutivas")
    col_a, col_b = st.columns(2)
    col_a.info(f"**3 cuotas de:** ${viaje['3 cuotas consec.']:,}")
    col_b.info(f"**6 cuotas de:** ${viaje['6 cuotas consec.']:,}")

with t2:
    st.write("### Plan Combinado (Fijas + Ajuste IPC)")
    st.write("Se abonan cuotas fijas iniciales y el resto se ajusta por IPC.")
    
    f1, f2 = st.columns(2)
    f1.success(f"Opci車n 3 cuotas fijas de: ${viaje['Fija_Plan3']:,}")
    f2.success(f"Opci車n 4 cuotas fijas de: ${viaje['Fija_Plan4']:,}")
    
    st.markdown("**Cuotas restantes ajustables:**")
    i1, i2, i3 = st.columns(3)
    i1.warning(f"18 cuotas: ${viaje['IPC_18']:,}")
    i2.warning(f"17 cuotas: ${viaje['IPC_17']:,}")
    i3.warning(f"16 cuotas: ${viaje['IPC_16']:,}")

st.sidebar.info("Los planes de 3 o 4 cuotas fijas se complementan con el plan de cuotas ajustado por IPC.")