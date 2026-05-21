// app.jsx — Prode root: state + tweaks + canvas wrapper

const { useState: useStateA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "lime",
  "density": "regular",
  "ambient": true
}/*EDITMODE-END*/;

const PALETTES = {
  lime:   { primary: "#D4FF3F", deep: "#9BC10F", name: "Floodlight Lime" },
  coral:  { primary: "#FF7A4D", deep: "#C24A20", name: "Sunset Coral" },
  electric:{ primary: "#5DC8FF", deep: "#1E8EC8", name: "Electric Blue" },
  gold:   { primary: "#FFD23F", deep: "#C19A0F", name: "Trophy Gold" },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // Map palette tweak → re-apply primary across the design tokens.
  const palette = PALETTES[t.palette] || PALETTES.lime;
  // Override C.lime live (works since tokens are read at render time):
  C.lime = palette.primary;
  C.limeDeep = palette.deep;

  // Top-level state: predictions (draft, in-progress) + saved
  const [state, setState] = useStateA({
    ...USER,
    predictions: {},
    savedPredictions: {},
  });

  const setPrediction = (m, pred) => {
    setState(s => ({
      ...s,
      predictions: { ...s.predictions, [`${m.home}-${m.away}`]: pred },
    }));
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
      <DesignCanvas>
        <DCSection id="dashboard" title="Inicio · Dashboard" subtitle="Mundial 2026 · Floodlight system">
          <DCArtboard id="desktop" label="Desktop · 1440" width={1440} height={1180}>
            <DesktopDashboard
              state={state}
              setPrediction={setPrediction}
              savePrediction={savePrediction}
            />
          </DCArtboard>
          <DCArtboard id="mobile" label="Mobile · 390" width={390} height={1400}>
            <MobileDashboard
              state={state}
              setPrediction={setPrediction}
              savePrediction={savePrediction}
            />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Palette" />
        <TweakColor
          label="Accent"
          value={palette.primary}
          options={[
            PALETTES.lime.primary,
            PALETTES.coral.primary,
            PALETTES.electric.primary,
            PALETTES.gold.primary,
          ]}
          onChange={(v) => {
            const key = Object.keys(PALETTES).find(k => PALETTES[k].primary === v) || "lime";
            setTweak("palette", key);
          }}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakToggle
          label="Ambient glow"
          value={t.ambient}
          onChange={(v) => setTweak("ambient", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
