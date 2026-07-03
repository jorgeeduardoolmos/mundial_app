// app.jsx — Prode root: state + theming + canvas wrapper

const { useState: useStateA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "arena",
  "ambient": true
}/*EDITMODE-END*/;

// ── Full look-and-feel themes (base tone + accents) ─────────────────────────
// Each theme rewrites every design token, so switching = a real re-skin,
// not just an accent swap.
const THEMES = {
  // Original midnight-navy + lime
  floodlight: {
    name: "Floodlight", swatch: "#D4FF3F", onAccent: "#0A0B1E",
    bg: "#0A0B1E", surface: "#14172E", surface2: "#1C2042", surface3: "#252A52",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.16)",
    text: "#F4F5FF", textDim: "rgba(244,245,255,0.62)", textMute: "rgba(244,245,255,0.38)",
    lime: "#D4FF3F", limeDeep: "#9BC10F", blue: "#3B5BFF", coral: "#FF5C4D", gold: "#FFD23F", green: "#00C46B",
  },
  // Refresh — neutral warm charcoal + acid lime. Cleaner, more modern.
  eclipse: {
    name: "Eclipse", swatch: "#C6F432", onAccent: "#0A0B1E",
    bg: "#0C0D10", surface: "#16181C", surface2: "#1E2126", surface3: "#2A2E34",
    border: "rgba(255,255,255,0.07)", borderStrong: "rgba(255,255,255,0.15)",
    text: "#F6F7F4", textDim: "rgba(246,247,244,0.6)", textMute: "rgba(246,247,244,0.36)",
    lime: "#C6F432", limeDeep: "#8FB814", blue: "#6B8CFF", coral: "#FF6A4D", gold: "#FFCB45", green: "#36D17A",
  },
  // Light — warm beige paper + grass green ink. The bright option.
  arena: {
    name: "Arena", swatch: "#E9E0CD", onAccent: "#F7F1E1",
    bg: "#E9E0CD", surface: "#F6F0E0", surface2: "#EFE7D3", surface3: "#E3D8BF",
    border: "rgba(60,48,26,0.14)", borderStrong: "rgba(60,48,26,0.26)",
    text: "#2C2517", textDim: "rgba(44,37,23,0.66)", textMute: "rgba(44,37,23,0.46)",
    lime: "#4E8C28", limeDeep: "#356A18", blue: "#2E5BBE", coral: "#D24B36", gold: "#B9821A", green: "#3E7D3A",
  },
  // Deep violet + coral/orange (nod to the original Prode brand)
  violeta: {
    name: "Violeta", swatch: "#FF7A4D", onAccent: "#0A0B1E",
    bg: "#100A22", surface: "#1B1140", surface2: "#261952", surface3: "#332468",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.18)",
    text: "#F3EEFF", textDim: "rgba(243,238,255,0.62)", textMute: "rgba(243,238,255,0.4)",
    lime: "#FF7A4D", limeDeep: "#C24A20", blue: "#7A6BFF", coral: "#FF5C8A", gold: "#FFD23F", green: "#38D18A",
  },
  // Deep teal night + cyan/mint
  marea: {
    name: "Marea", swatch: "#43E0D0", onAccent: "#0A0B1E",
    bg: "#06141A", surface: "#0E2128", surface2: "#143038", surface3: "#1C414B",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.16)",
    text: "#EAFBFF", textDim: "rgba(234,251,255,0.62)", textMute: "rgba(234,251,255,0.4)",
    lime: "#43E0D0", limeDeep: "#1E9E9E", blue: "#3B8BFF", coral: "#FF6B5D", gold: "#FFCB45", green: "#2BD17E",
  },
};

function applyTheme(key) {
  const th = THEMES[key] || THEMES.eclipse;
  Object.keys(th).forEach((k) => {
    if (k !== "name" && k !== "swatch") C[k] = th[k];
  });
  return th;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = applyTheme(t.theme);

  const [state, setState] = useStateA({
    ...USER,
    predictions: {},
    savedPredictions: {},
  });

  const setPrediction = (m, pred) => {
    setState(s => ({ ...s, predictions: { ...s.predictions, [`${m.home}-${m.away}`]: pred } }));
  };

  const savePrediction = (m, pred) => {
    setState(s => {
      const key = `${m.home}-${m.away}`;
      const wasSaved = !!s.savedPredictions[key];
      return {
        ...s,
        predictions: { ...s.predictions, [key]: pred },
        savedPredictions: { ...s.savedPredictions, [key]: pred },
        remaining: wasSaved ? s.remaining : Math.max(0, s.remaining - 1),
        predicted: wasSaved ? s.predicted : s.predicted + 1,
      };
    });
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: theme.bg, zIndex: -1 }} />
      <DesignCanvas>
        <DCSection id="dashboard" title="Inicio · Dashboard" subtitle={`Mundial 2026 · tema ${theme.name}`}>
          <DCArtboard id="desktop" label="Desktop · 1440" width={1440} height={1180}>
            <DesktopDashboard
              state={state} setPrediction={setPrediction} savePrediction={savePrediction}
              ambient={t.ambient}
            />
          </DCArtboard>
          <DCArtboard id="mobile" label="Mobile · 390" width={390} height={1400}>
            <MobileDashboard
              state={state} setPrediction={setPrediction} savePrediction={savePrediction}
              ambient={t.ambient}
            />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Look & feel" />
        <TweakColor
          label="Tema"
          value={theme.swatch}
          options={[THEMES.eclipse.swatch, THEMES.arena.swatch, THEMES.floodlight.swatch, THEMES.violeta.swatch, THEMES.marea.swatch]}
          onChange={(v) => {
            const key = Object.keys(THEMES).find((k) => THEMES[k].swatch === v) || "eclipse";
            setTweak("theme", key);
          }}
        />
        <TweakSelect
          label="Paleta"
          value={t.theme}
          options={[
            { value: "eclipse", label: "Eclipse · carbón + lima" },
            { value: "arena", label: "Arena · beige + verde" },
            { value: "floodlight", label: "Floodlight · midnight + lima" },
            { value: "violeta", label: "Violeta · índigo + coral" },
            { value: "marea", label: "Marea · teal + cyan" },
          ]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakSection label="Ambiente" />
        <TweakToggle label="Glow ambiente" value={t.ambient} onChange={(v) => setTweak("ambient", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
