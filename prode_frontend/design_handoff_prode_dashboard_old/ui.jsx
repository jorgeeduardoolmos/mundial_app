// ui.jsx — Prode shared UI primitives.
// Dark "Floodlight" system: midnight base, lime/blue/coral accents,
// Big Shoulders display type for numerals & headlines.

const { useState, useEffect, useRef, useMemo } = React;

// ── tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0B1E",
  surface: "#14172E",
  surface2: "#1C2042",
  surface3: "#252A52",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.16)",
  text: "#F4F5FF",
  textDim: "rgba(244,245,255,0.62)",
  textMute: "rgba(244,245,255,0.38)",
  lime: "#D4FF3F",
  limeDeep: "#9BC10F",
  blue: "#3B5BFF",
  coral: "#FF5C4D",
  gold: "#FFD23F",
  green: "#00C46B",
};

const DISPLAY = "'Big Shoulders Display', 'Archivo Black', system-ui, sans-serif";
const UI      = "'Geist', 'Inter Tight', system-ui, sans-serif";
const MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ── tiny helpers ────────────────────────────────────────────────────────────
const Spacer = ({ h = 12 }) => <div style={{ height: h }} />;

function CountUp({ to, dur = 900, format = (n) => n }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <>{format(n)}</>;
}

function LiveDot({ size = 8 }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      background: C.coral, boxShadow: `0 0 0 0 ${C.coral}`,
      animation: "prodePulse 1.4s ease-out infinite",
    }} />
  );
}

// ── TeamChip — abstract "flag" block: two diagonal colors + code label ──────
function TeamChip({ code, size = 36, radius = 8 }) {
  const t = byCode(code);
  const isLight = t.c2 === "#F4F5FF" || t.c2 === "#FFD23F";
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, position: "relative",
      overflow: "hidden", flexShrink: 0,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: t.c1 }} />
      <div style={{
        position: "absolute", inset: 0,
        background: t.c2,
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.36,
        color: isLight ? "#0A0B1E" : "#F4F5FF",
        letterSpacing: "0.02em",
        textShadow: isLight ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
        mixBlendMode: "normal",
      }}>
        {code.slice(0, 3)}
      </div>
    </div>
  );
}

// ── Big team plate (for hero next-match) ────────────────────────────────────
function TeamPlate({ code, align = "left", size = "lg" }) {
  const t = byCode(code);
  const big = size === "lg";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: big ? 18 : 12,
      flexDirection: align === "right" ? "row-reverse" : "row",
      flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: big ? 88 : 56, height: big ? 88 : 56, borderRadius: 14,
        position: "relative", overflow: "hidden", flexShrink: 0,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: t.c1 }} />
        <div style={{
          position: "absolute", inset: 0, background: t.c2,
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: DISPLAY, fontWeight: 900, fontSize: big ? 32 : 22,
          color: (t.c2 === "#F4F5FF" || t.c2 === "#FFD23F") ? "#0A0B1E" : "#F4F5FF",
          letterSpacing: "0.02em",
          textShadow: (t.c2 === "#F4F5FF" || t.c2 === "#FFD23F") ? "none" : "0 2px 4px rgba(0,0,0,0.4)",
        }}>{t.code.slice(0, 3)}</div>
      </div>
      <div style={{
        textAlign: align, minWidth: 0,
      }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 800,
          fontSize: big ? 38 : 24, lineHeight: 0.95,
          letterSpacing: "0.005em", color: C.text,
          textTransform: "uppercase",
        }}>{t.name}</div>
        <div style={{
          fontFamily: MONO, fontSize: big ? 11 : 10, fontWeight: 500,
          color: C.textMute, letterSpacing: "0.08em", marginTop: 4,
          textTransform: "uppercase",
        }}>FIFA · grupo C</div>
      </div>
    </div>
  );
}

// ── ScoreInput: -/0/+/  with big bebas number ──────────────────────────────
function ScoreInput({ value, onChange, accent = C.lime, big = true }) {
  const [pulse, setPulse] = useState(0);
  const bump = (delta) => {
    const next = Math.max(0, Math.min(9, value + delta));
    onChange(next);
    setPulse(p => p + 1);
  };
  const numSize = big ? 84 : 52;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: big ? 8 : 4,
      background: "rgba(255,255,255,0.04)", borderRadius: big ? 18 : 12,
      padding: big ? "10px 14px" : "6px 8px",
      border: `1px solid ${C.border}`,
    }}>
      <button
        onClick={() => bump(-1)}
        style={btnStyle(big ? 38 : 28, accent)}
        aria-label="menos"
      >−</button>
      <div key={pulse} style={{
        fontFamily: DISPLAY, fontWeight: 900, fontSize: numSize, lineHeight: 0.85,
        color: C.text, minWidth: big ? 60 : 36, textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        animation: "prodeBump 200ms ease-out",
      }}>{value}</div>
      <button
        onClick={() => bump(1)}
        style={btnStyle(big ? 38 : 28, accent)}
        aria-label="más"
      >+</button>
    </div>
  );
}

function btnStyle(s, accent) {
  return {
    width: s, height: s, borderRadius: s / 2,
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${C.border}`,
    color: accent, fontFamily: DISPLAY, fontWeight: 800,
    fontSize: s * 0.55, lineHeight: 1, cursor: "pointer",
    display: "grid", placeItems: "center",
    transition: "all 120ms",
  };
}

// ── Ticker — horizontal scrolling results strip ─────────────────────────────
function Ticker({ items, speed = 60 }) {
  // Duplicate for seamless loop
  const loop = [...items, ...items, ...items];
  const totalWidth = items.length * 220;
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      background: "rgba(212,255,63,0.03)",
      maskImage: "linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent)",
    }}>
      <div style={{
        display: "flex", gap: 28, padding: "10px 0",
        animation: `prodeTicker ${totalWidth / speed}s linear infinite`,
        width: "max-content",
      }}>
        {loop.map((m, i) => (
          <TickerItem key={i} m={m} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ m }) {
  const isLive = m.status === "LIVE";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      paddingRight: 28, borderRight: `1px solid ${C.border}`,
      minWidth: 200,
    }}>
      {isLive && <LiveDot size={6} />}
      <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMute, letterSpacing: "0.04em" }}>
        {isLive ? `${m.minute}'` : (m.status === "FT" ? "FT" : "—")}
      </span>
      <TeamChip code={m.home} size={20} radius={4} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: "0.02em" }}>
        {byCode(m.home).code.slice(0,3)}
      </span>
      <span style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 18,
        color: isLive ? C.coral : C.lime,
        fontVariantNumeric: "tabular-nums",
      }}>
        {m.hg}–{m.ag}
      </span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: "0.02em" }}>
        {byCode(m.away).code.slice(0,3)}
      </span>
      <TeamChip code={m.away} size={20} radius={4} />
    </div>
  );
}

// ── RankRow ─────────────────────────────────────────────────────────────────
function RankRow({ p, idx, isCurrent }) {
  const medal = idx < 3 ? ["#FFD23F","#D7DDE6","#C7935C"][idx] : null;
  const delta = p.delta;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 12,
      background: isCurrent ? "rgba(212,255,63,0.10)" : "transparent",
      border: `1px solid ${isCurrent ? "rgba(212,255,63,0.35)" : "transparent"}`,
      position: "relative",
      transition: "background 200ms",
    }}>
      <div style={{
        width: 28, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 22,
        color: medal ?? (isCurrent ? C.lime : C.textDim),
        lineHeight: 1, fontVariantNumeric: "tabular-nums",
      }}>{String(idx + 1).padStart(2, "0")}</div>

      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: p.color,
        display: "grid", placeItems: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 13,
        color: "#0A0B1E", letterSpacing: "0.02em",
        flexShrink: 0,
      }}>{p.initials}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.text,
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
          {p.isYou && (
            <span style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 700,
              color: "#0A0B1E", background: C.lime,
              padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em",
            }}>VOS</span>
          )}
        </div>
        <div style={{
          display: "flex", gap: 10, marginTop: 2,
          fontFamily: MONO, fontSize: 10, color: C.textMute,
          letterSpacing: "0.04em",
        }}>
          <span>{p.exact} exactos</span>
          {p.streak > 0 && <span style={{ color: C.gold }}>🔥 {p.streak}</span>}
        </div>
      </div>

      <DeltaArrow delta={delta} />

      <div style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 28,
        color: C.text, fontVariantNumeric: "tabular-nums",
        lineHeight: 1, minWidth: 50, textAlign: "right",
      }}>
        {p.points}
        <span style={{ fontSize: 11, color: C.textMute, marginLeft: 3, letterSpacing: "0.06em" }}>PTS</span>
      </div>
    </div>
  );
}

function DeltaArrow({ delta }) {
  if (delta === 0) return (
    <div style={{ width: 28, textAlign: "center", color: C.textMute, fontFamily: MONO, fontSize: 11 }}>—</div>
  );
  const up = delta > 0;
  return (
    <div style={{
      width: 28, textAlign: "center", lineHeight: 1,
      color: up ? C.green : C.coral,
      fontFamily: MONO, fontSize: 11, fontWeight: 700,
    }}>
      <div style={{ fontSize: 10 }}>{up ? "▲" : "▼"}</div>
      <div style={{ fontSize: 10, marginTop: 1 }}>{Math.abs(delta)}</div>
    </div>
  );
}

// ── Compact match row (for "today's matches") ───────────────────────────────
function MatchRow({ m, onPredict, prediction }) {
  const isLive = m.status === "LIVE";
  const isFT = m.status === "FT";
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "60px 1fr auto 1fr 88px",
      alignItems: "center", gap: 14,
      padding: "12px 16px",
      borderTop: `1px solid ${C.border}`,
      transition: "background 150ms",
      cursor: "pointer",
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      onClick={() => onPredict && onPredict(m)}
    >
      <div style={{ fontFamily: MONO, fontSize: 10, color: C.textMute, letterSpacing: "0.06em" }}>
        {isLive ? <span style={{ color: C.coral, display: "inline-flex", alignItems: "center", gap: 4 }}><LiveDot size={5} /> {m.minute}'</span>
          : isFT ? "FINAL" : m.time}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", minWidth: 0 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.text, letterSpacing: "0.01em" }}>
          {byCode(m.home).name}
        </span>
        <TeamChip code={m.home} size={26} radius={6} />
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "4px 12px",
        background: isLive ? "rgba(255,92,77,0.12)" : (isFT ? "rgba(212,255,63,0.06)" : "rgba(255,255,255,0.04)"),
        border: `1px solid ${isLive ? "rgba(255,92,77,0.3)" : C.border}`,
        borderRadius: 8,
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 22,
          color: isFT ? C.lime : C.text, fontVariantNumeric: "tabular-nums", lineHeight: 1,
        }}>
          {isFT || isLive ? m.hg : "—"}
        </span>
        <span style={{ color: C.textMute, fontSize: 14 }}>·</span>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 22,
          color: isFT ? C.lime : C.text, fontVariantNumeric: "tabular-nums", lineHeight: 1,
        }}>
          {isFT || isLive ? m.ag : "—"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <TeamChip code={m.away} size={26} radius={6} />
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.text, letterSpacing: "0.01em" }}>
          {byCode(m.away).name}
        </span>
      </div>
      <div style={{ textAlign: "right" }}>
        {prediction ? (
          <span style={{
            fontFamily: MONO, fontSize: 11, fontWeight: 600, color: C.lime,
            border: `1px solid ${C.lime}33`, padding: "4px 8px", borderRadius: 6,
          }}>{prediction.hg}–{prediction.ag}</span>
        ) : (
          <span style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 600, color: C.textDim,
            letterSpacing: "0.08em",
          }}>PREDECIR →</span>
        )}
      </div>
    </div>
  );
}

// ── Section / card chrome ───────────────────────────────────────────────────
function Card({ children, accent = false, glow = false, style = {}, padded = true }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(180deg, rgba(212,255,63,0.05), transparent)" : C.surface,
      border: `1px solid ${accent ? "rgba(212,255,63,0.20)" : C.border}`,
      borderRadius: 18,
      padding: padded ? 22 : 0,
      position: "relative",
      boxShadow: glow ? "0 0 0 1px rgba(212,255,63,0.1), 0 20px 60px -20px rgba(212,255,63,0.15)" : "none",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ eyebrow, title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        {eyebrow && (
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700,
            color: C.textMute, letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 4,
          }}>{eyebrow}</div>
        )}
        <div style={{
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: C.text,
          letterSpacing: "0.01em", textTransform: "uppercase", lineHeight: 0.95,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ── Global keyframes (injected once) ────────────────────────────────────────
(function injectKeyframes() {
  if (document.getElementById("prode-keyframes")) return;
  const s = document.createElement("style");
  s.id = "prode-keyframes";
  s.textContent = `
    @keyframes prodePulse {
      0%   { box-shadow: 0 0 0 0 rgba(255,92,77,0.7); }
      70%  { box-shadow: 0 0 0 8px rgba(255,92,77,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,92,77,0); }
    }
    @keyframes prodeTicker {
      from { transform: translateX(0); }
      to   { transform: translateX(-33.333%); }
    }
    @keyframes prodeBump {
      0%   { transform: scale(1.15); color: ${C.lime}; }
      100% { transform: scale(1); color: ${C.text}; }
    }
    @keyframes prodeFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes prodeShimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes prodeSlideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, {
  C, DISPLAY, UI, MONO,
  Spacer, CountUp, LiveDot,
  TeamChip, TeamPlate, ScoreInput,
  Ticker, RankRow, MatchRow,
  Card, CardHeader,
});
