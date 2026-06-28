// dashboard-mobile.jsx — Prode mobile dashboard (390 wide)

const { useState: useStateM } = React;

function MobileDashboard({ state, setPrediction, savePrediction }) {
  const next = FIXTURE[5];
  const today = FIXTURE.slice(0, 12).filter(m => m.id !== next.id).slice(0, 4);
  const recent = FIXTURE.filter(m => m.status === "FT" || m.status === "LIVE");
  const nextKey = `${next.home}-${next.away}`;
  const nextPred = state.predictions[nextKey] || { hg: 1, ag: 1 };

  return (
    <div style={{
      width: 390, minHeight: 1400, background: C.bg, color: C.text,
      fontFamily: UI, position: "relative", overflow: "hidden",
      paddingBottom: 88,
    }} data-screen-label="02 Inicio · Mobile">
      <div style={{
        position: "absolute", top: -100, right: -200, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(212,255,63,0.12), transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 600, left: -200, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(59,91,255,0.10), transparent 60%)",
        pointerEvents: "none",
      }} />

      <MobileTopBar />
      <MobileHero state={state} />
      <MobileTicker recent={recent} />
      <MobileNextMatch
        m={next}
        pred={nextPred}
        setPrediction={setPrediction}
        savePrediction={savePrediction}
        saved={!!state.savedPredictions[`${next.home}-${next.away}`]}
      />
      <MobileToday matches={today} state={state} savePrediction={savePrediction} />
      <MobileMiniRanking />
      <MobileSinPredecir count={state.remaining} />
      <MobilePointsMini />
      <MobileBottomNav />
    </div>
  );
}

function MobileTopBar() {
  return (
    <div style={{
      position: "relative", zIndex: 2,
      padding: "16px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.lime}, ${C.blue})`,
          display: "grid", placeItems: "center",
        }}>
          <span style={{
            fontFamily: DISPLAY, fontWeight: 900, fontSize: 18, color: "#0A0B1E",
          }}>P</span>
        </div>
        <div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 16, letterSpacing: "0.04em", lineHeight: 1 }}>PRODE</div>
          <div style={{ fontFamily: MONO, fontSize: 8, color: C.textMute, letterSpacing: "0.14em", marginTop: 2 }}>MUNDIAL · 2026</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          color: C.textDim, cursor: "pointer", display: "grid", placeItems: "center",
          fontSize: 16,
        }}>🔔</button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: C.lime,
          display: "grid", placeItems: "center",
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, color: "#0A0B1E",
        }}>MC</div>
      </div>
    </div>
  );
}

function MobileHero({ state }) {
  return (
    <div style={{ position: "relative", zIndex: 1, padding: "28px 20px 20px" }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, fontWeight: 600,
        color: C.lime, letterSpacing: "0.14em",
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
      }}>
        <span style={{ width: 20, height: 1, background: C.lime }} />
        DOM 11 JUN · JORNADA 02
      </div>
      <h1 style={{
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, lineHeight: 0.88,
        margin: 0, letterSpacing: "-0.005em", textTransform: "uppercase",
      }}>
        Hola,<br/>
        <span style={{
          background: `linear-gradient(120deg, ${C.lime}, ${C.gold})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Maca.</span>
      </h1>

      <div style={{
        marginTop: 22,
        background: "linear-gradient(160deg, rgba(212,255,63,0.10), rgba(59,91,255,0.05))",
        border: `1px solid ${C.borderStrong}`, borderRadius: 16,
        padding: 18,
        display: "grid", gridTemplateColumns: "auto 1fr", gap: 16,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.lime}, transparent)`,
        }} />
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: C.textMute, letterSpacing: "0.14em", marginBottom: 4,
          }}>POSICIÓN</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{
              fontFamily: DISPLAY, fontWeight: 900, fontSize: 68,
              color: C.text, lineHeight: 0.8, fontVariantNumeric: "tabular-nums",
            }}><CountUp to={state.position} /></span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.textMute }}>
              /{state.totalPlayers}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, borderLeft: `1px solid ${C.border}`, paddingLeft: 16 }}>
          <MiniStat label="PUNTOS" value={state.points} accent={C.lime} />
          <MiniStat label="EXACTOS" value={state.exact} />
          <MiniStat label="A LÍDER" value={`-${state.pointsToLeader}`} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent = C.text }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: MONO, fontSize: 9, color: C.textMute, letterSpacing: "0.10em" }}>{label}</span>
      <span style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: accent,
        fontVariantNumeric: "tabular-nums", lineHeight: 1,
      }}>{typeof value === "number" ? <CountUp to={value} /> : value}</span>
    </div>
  );
}

function MobileTicker({ recent }) {
  return (
    <div style={{ marginTop: 8 }}>
      <Ticker items={recent} speed={40} />
    </div>
  );
}

function MobileNextMatch({ m, pred, setPrediction, savePrediction, saved }) {
  const [savedAnim, setSavedAnim] = useStateM(false);
  const onSave = () => {
    savePrediction(m, pred);
    setSavedAnim(true); setTimeout(() => setSavedAnim(false), 1500);
  };
  return (
    <div style={{ position: "relative", zIndex: 1, padding: "24px 20px 0" }}>
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 20px 60px -20px rgba(212,255,63,0.15)",
      }}>
        <div style={{
          padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.lime,
            letterSpacing: "0.14em", padding: "4px 7px", borderRadius: 4,
            background: "rgba(212,255,63,0.10)", border: `1px solid rgba(212,255,63,0.25)`,
          }}>PRÓXIMO</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: "0.06em" }}>
            VIE 12 · 23:00 HS
          </span>
        </div>

        <div style={{ padding: "26px 18px 8px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center", gap: 12,
          }}>
            <TeamPlate code={m.home} align="left" size="sm" />
            <span style={{
              fontFamily: DISPLAY, fontWeight: 900, fontSize: 28,
              color: C.textMute, letterSpacing: "0.06em",
            }}>VS</span>
            <TeamPlate code={m.away} align="right" size="sm" />
          </div>
        </div>

        <div style={{ padding: "18px 18px 14px" }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 700,
            color: C.textMute, letterSpacing: "0.14em", marginBottom: 12,
            textAlign: "center",
          }}>TU PRONÓSTICO</div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <ScoreInput
              big={false}
              value={pred.hg}
              onChange={(v) => setPrediction(m, { ...pred, hg: v })}
            />
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 26, color: C.textMute }}>—</span>
            <ScoreInput
              big={false}
              value={pred.ag}
              onChange={(v) => setPrediction(m, { ...pred, ag: v })}
            />
          </div>
        </div>

        <div style={{ padding: "0 18px 18px" }}>
          <button onClick={onSave} style={{
            width: "100%", padding: "14px",
            background: saved || savedAnim ? "rgba(212,255,63,0.15)" : C.lime,
            color: saved || savedAnim ? C.lime : "#0A0B1E",
            border: saved || savedAnim ? `1px solid ${C.lime}` : "none",
            borderRadius: 10, cursor: "pointer",
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 15,
            letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "all 200ms",
          }}>
            {savedAnim ? "✓ GUARDADO" : saved ? "✓ ACTUALIZAR" : "Guardar pronóstico →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileToday({ matches, state, savePrediction }) {
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.textMute,
            letterSpacing: "0.12em", marginBottom: 2,
          }}>{matches.length} PARTIDOS</div>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, color: C.text,
            letterSpacing: "0.01em", textTransform: "uppercase", lineHeight: 1,
          }}>HOY</div>
        </div>
        <button style={{
          fontFamily: MONO, fontSize: 10, color: C.lime, letterSpacing: "0.10em",
          background: "transparent", border: 0, cursor: "pointer",
        }}>FIXTURE →</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {matches.map((m) => (
          <MobileMatchRow
            key={m.id}
            m={m}
            prediction={state.savedPredictions[`${m.home}-${m.away}`]}
            onPredict={() => savePrediction(m, { hg: 1, ag: 0 })}
          />
        ))}
      </div>
    </div>
  );
}

function MobileMatchRow({ m, prediction, onPredict }) {
  const isLive = m.status === "LIVE";
  const isFT = m.status === "FT";
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "12px 14px",
      display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center",
    }}>
      <div>
        <div style={{
          fontFamily: MONO, fontSize: 9, color: isLive ? C.coral : C.textMute,
          letterSpacing: "0.08em", marginBottom: 6,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {isLive && <LiveDot size={5} />}
          {isLive ? `${m.minute}'` : isFT ? "FINAL" : m.time + " HS"}
          <span>·</span>
          <span>GRUPO {m.group}</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: C.text,
          letterSpacing: "0.01em",
        }}>
          <TeamChip code={m.home} size={18} radius={4} />
          <span style={{ flex: 1 }}>{byCode(m.home).name}</span>
          {(isFT || isLive) && (
            <span style={{ fontFamily: DISPLAY, color: isFT ? C.lime : C.coral, fontSize: 19 }}>
              {m.hg}
            </span>
          )}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 4,
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: C.text,
          letterSpacing: "0.01em",
        }}>
          <TeamChip code={m.away} size={18} radius={4} />
          <span style={{ flex: 1 }}>{byCode(m.away).name}</span>
          {(isFT || isLive) && (
            <span style={{ fontFamily: DISPLAY, color: isFT ? C.lime : C.coral, fontSize: 19 }}>
              {m.ag}
            </span>
          )}
        </div>
      </div>
      <button onClick={onPredict} style={{
        padding: "8px 12px", borderRadius: 8,
        background: prediction ? "rgba(212,255,63,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${prediction ? C.lime + "55" : C.border}`,
        color: prediction ? C.lime : C.textDim,
        fontFamily: MONO, fontSize: 11, fontWeight: 700,
        letterSpacing: "0.04em", cursor: "pointer",
        minWidth: 56,
      }}>
        {prediction ? `${prediction.hg}–${prediction.ag}` : "+"}
      </button>
    </div>
  );
}

function MobileMiniRanking() {
  const top3 = RANKING.slice(0, 3);
  const you = RANKING.find(p => p.isYou);
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.textMute,
            letterSpacing: "0.12em",
          }}>LIGA · 9 JUGADORES</div>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, color: C.text,
            letterSpacing: "0.01em", textTransform: "uppercase", lineHeight: 1, marginTop: 2,
          }}>RANKING</div>
        </div>
        <button style={{
          fontFamily: MONO, fontSize: 10, color: C.lime, letterSpacing: "0.10em",
          background: "transparent", border: 0, cursor: "pointer",
        }}>VER TODO →</button>
      </div>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 6,
      }}>
        {top3.map((p, i) => (
          <RankRow key={p.id} p={p} idx={i} isCurrent={false} />
        ))}
        <div style={{
          height: 1, background: C.border, margin: "8px 14px",
          backgroundImage: `repeating-linear-gradient(90deg, ${C.border} 0 4px, transparent 4px 8px)`,
        }} />
        <RankRow p={you} idx={5} isCurrent={true} />
      </div>
    </div>
  );
}

function MobileSinPredecir({ count }) {
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(255,92,77,0.15), rgba(255,92,77,0.04))`,
        border: `1px solid rgba(255,92,77,0.30)`,
        borderRadius: 16, padding: "18px 20px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: C.coral,
          lineHeight: 0.8, letterSpacing: "-0.02em",
        }}><CountUp to={count} /></div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: C.text,
            textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1,
          }}>Sin predecir</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>
            Cargá tus pronósticos antes del cierre.
          </div>
        </div>
        <button style={{
          padding: "10px 12px", borderRadius: 8, background: "transparent",
          border: `1px solid ${C.coral}`, color: C.coral,
          fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
          cursor: "pointer", whiteSpace: "nowrap",
        }}>IR →</button>
      </div>
    </div>
  );
}

function MobilePointsMini() {
  return (
    <div style={{ padding: "24px 20px 0" }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: 16,
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.textMute,
          letterSpacing: "0.12em", marginBottom: 12,
        }}>CÓMO SE PUNTÚA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SCORING.map(s => (
            <div key={s.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontFamily: UI, fontSize: 13, color: C.text, fontWeight: 500 }}>{s.label}</span>
              <span style={{
                fontFamily: DISPLAY, fontWeight: 800, fontSize: 16,
                color: s.accent ? C.gold : C.lime,
              }}>{s.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const items = [
    { label: "Inicio", icon: "⌂", active: true },
    { label: "Ranking", icon: "♛" },
    { label: "Predecir", icon: "⊕" },
    { label: "Partidos", icon: "▦" },
    { label: "Grupos", icon: "◧" },
  ];
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      background: "rgba(10,11,30,0.92)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.border}`,
      padding: "10px 8px 18px",
      display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
      zIndex: 5,
    }}>
      {items.map((it) => (
        <button key={it.label} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: "8px 4px", background: "transparent", border: 0, cursor: "pointer",
          color: it.active ? C.lime : C.textDim, position: "relative",
        }}>
          <span style={{
            fontSize: 18, lineHeight: 1,
            filter: it.active ? `drop-shadow(0 0 8px ${C.lime})` : "none",
          }}>{it.icon}</span>
          <span style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>{it.label}</span>
          {it.active && (
            <span style={{
              position: "absolute", top: 0, width: 28, height: 2, borderRadius: 2,
              background: C.lime, boxShadow: `0 0 10px ${C.lime}`,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

window.MobileDashboard = MobileDashboard;
