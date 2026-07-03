// dashboard-desktop.jsx — Prode desktop dashboard (1440 wide artboard)

const { useState: useStateD, useMemo: useMemoD } = React;

function DesktopDashboard({ state, setPrediction, savePrediction, ambient = true }) {
  const next = FIXTURE[5]; // forced USA vs PAR
  const today = FIXTURE.slice(0, 12).filter(m => m.id !== next.id).slice(0, 5);

  const nextKey = `${next.home}-${next.away}`;
  const nextPred = state.predictions[nextKey] || { hg: 1, ag: 1 };

  return (
    <div style={{
      width: 1440, minHeight: 1180, background: C.bg, color: C.text,
      fontFamily: UI, position: "relative", overflow: "hidden",
    }} data-screen-label="01 Inicio · Desktop">
      {ambient && <BackgroundGlow />}
      <TopBar />
      <HeroBand state={state} />
      <MainGrid
        next={next}
        nextPred={nextPred}
        today={today}
        state={state}
        setPrediction={setPrediction}
        savePrediction={savePrediction}
      />
      <FooterStrip />
    </div>
  );
}

// ── Background ambient lime/blue glow ───────────────────────────────────────
function BackgroundGlow() {
  return (
    <>
      <div style={{
        position: "absolute", top: -200, right: -200, width: 700, height: 700,
        background: `radial-gradient(circle, ${C.lime}1A, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 400, left: -300, width: 800, height: 800,
        background: `radial-gradient(circle, ${C.blue}1A, transparent 60%)`,
        pointerEvents: "none",
      }} />
    </>
  );
}

// ── Top bar ─────────────────────────────────────────────────────────────────
function TopBar() {
  const items = ["Inicio", "Ranking", "Predecir", "Partidos", "Grupos"];
  return (
    <div style={{
      position: "relative", zIndex: 2,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 40px",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Logo />
        <div>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 900, fontSize: 22,
            color: C.text, letterSpacing: "0.04em", lineHeight: 1,
          }}>PRODE</div>
          <div style={{
            fontFamily: MONO, fontSize: 9, color: C.textMute,
            letterSpacing: "0.16em", marginTop: 2,
          }}>MUNDIAL · 2026</div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 4 }}>
        {items.map((it, i) => (
          <button key={it} style={{
            position: "relative", padding: "10px 18px",
            background: "transparent", border: 0, cursor: "pointer",
            fontFamily: UI, fontWeight: 600, fontSize: 13,
            color: i === 0 ? C.text : C.textDim, letterSpacing: "0.01em",
          }}>
            {it}
            {i === 0 && (
              <span style={{
                position: "absolute", bottom: -22, left: "50%",
                transform: "translateX(-50%)",
                width: 28, height: 3, borderRadius: 2, background: C.lime,
                boxShadow: `0 0 12px ${C.lime}`,
              }} />
            )}
          </button>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          padding: "8px 14px", borderRadius: 999,
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          fontFamily: MONO, fontSize: 11, color: C.textDim,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime }} />
          LIGA · ASADO DEL DOMINGO
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 14px 6px 6px", borderRadius: 999,
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          cursor: "pointer",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: C.lime,
            display: "grid", placeItems: "center",
            fontFamily: DISPLAY, fontWeight: 800, color: C.onAccent, fontSize: 12,
          }}>MC</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Maca</div>
            <div style={{ fontSize: 10, color: C.textMute, fontFamily: MONO }}>@maca</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: `linear-gradient(135deg, ${C.lime}, ${C.blue})`,
      display: "grid", placeItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)",
      }} />
      <span style={{
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 22,
        color: "#0A0B1E", letterSpacing: "0.02em", position: "relative",
      }}>P</span>
    </div>
  );
}

// ── Hero band ───────────────────────────────────────────────────────────────
function HeroBand({ state }) {
  return (
    <div style={{
      position: "relative", zIndex: 1,
      padding: "44px 40px 32px",
      display: "grid", gridTemplateColumns: "1fr 480px", gap: 40, alignItems: "end",
    }}>
      <div>
        <div style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 600,
          color: C.lime, letterSpacing: "0.16em", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", width: 28, height: 1, background: C.lime }} />
          DOMINGO · 11 JUN 2026 · JORNADA 02
        </div>
        <h1 style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 132, lineHeight: 0.86,
          letterSpacing: "-0.005em", margin: 0, color: C.text,
          textTransform: "uppercase",
        }}>
          Hola,&nbsp;
          <span style={{
            background: `linear-gradient(120deg, ${C.lime}, ${C.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Maca.</span>
        </h1>
        <p style={{
          fontFamily: UI, fontSize: 19, fontWeight: 400,
          color: C.textDim, marginTop: 18, maxWidth: 620, lineHeight: 1.5,
        }}>
          Te quedan <b style={{ color: C.text, fontWeight: 700 }}>{state.remaining} partidos</b> para
          predecir. Estás a <b style={{ color: C.lime }}>4 puntos</b> de
          subir al puesto&nbsp;5.
        </p>
      </div>

      <PositionTile state={state} />
    </div>
  );
}

function PositionTile({ state }) {
  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(160deg, rgba(212,255,63,0.10), rgba(59,91,255,0.05))",
      border: `1px solid ${C.borderStrong}`,
      borderRadius: 22, padding: "26px 30px",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.lime}, transparent)`,
      }} />
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: C.textMute,
            letterSpacing: "0.14em", marginBottom: 6,
          }}>TU POSICIÓN</div>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 4,
          }}>
            <span style={{
              fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 0.85,
              color: C.text, fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}>
              <CountUp to={state.position} />
            </span>
            <span style={{
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 32,
              color: C.textMute, lineHeight: 0.85,
            }}>/{state.totalPlayers}</span>
          </div>
        </div>
        <div style={{ flex: 1, borderLeft: `1px solid ${C.border}`, paddingLeft: 24, paddingBottom: 8 }}>
          <Stat label="PUNTOS"   value={state.points} accent={C.lime} />
          <Spacer h={12} />
          <Stat label="EXACTOS"  value={state.exact} />
          <Spacer h={12} />
          <Stat label="A LÍDER"  value={`-${state.pointsToLeader}`} mono />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = C.text, mono = false }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
      <span style={{
        fontFamily: MONO, fontSize: 10, color: C.textMute, letterSpacing: "0.12em",
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? MONO : DISPLAY, fontWeight: mono ? 600 : 800,
        fontSize: mono ? 18 : 28, color: accent, lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>{typeof value === "number" ? <CountUp to={value} /> : value}</span>
    </div>
  );
}

// ── Main grid (next match + today + side col) ───────────────────────────────
function MainGrid({ next, nextPred, today, state, setPrediction, savePrediction }) {
  return (
    <div style={{
      position: "relative", zIndex: 1,
      padding: "36px 40px 60px",
      display: "grid", gridTemplateColumns: "1fr 440px", gap: 28,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <NextMatchCard
          m={next}
          pred={nextPred}
          setPrediction={setPrediction}
          savePrediction={savePrediction}
          saved={!!state.savedPredictions[`${next.home}-${next.away}`]}
        />
        <TodayCard
          matches={today}
          state={state}
          onPredict={(m) => savePrediction(m, { hg: 1, ag: 0 })}
        />
        <GroupTable groupId="C" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <RankingCard state={state} />
        <PointsCard />
        <SinPredecirCard count={state.remaining} />
      </div>
    </div>
  );
}

// ── Next Match — hero card ──────────────────────────────────────────────────
function NextMatchCard({ m, pred, setPrediction, savePrediction, saved }) {
  const [savedAnim, setSavedAnim] = useStateD(false);
  const onSave = () => {
    savePrediction(m, pred);
    setSavedAnim(true);
    setTimeout(() => setSavedAnim(false), 1600);
  };

  return (
    <Card glow padded={false} style={{ overflow: "hidden" }}>
      <div style={{
        padding: "20px 26px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700,
            color: C.lime, letterSpacing: "0.14em",
            padding: "5px 9px", borderRadius: 5,
            background: "rgba(212,255,63,0.10)",
            border: `1px solid rgba(212,255,63,0.25)`,
          }}>PRÓXIMO PARTIDO</span>
          <span style={{
            fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: "0.08em",
          }}>VIE 12 JUN · 23:00 HS · ESTADIO BANC OF CALIFORNIA</span>
        </div>
        <span style={{
          fontFamily: MONO, fontSize: 11, color: C.textMute,
          letterSpacing: "0.10em",
        }}>EMPIEZA EN&nbsp;<span style={{ color: C.text, fontWeight: 700 }}>02D · 14H · 22M</span></span>
      </div>

      <div style={{
        padding: "44px 36px 36px",
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center", gap: 32,
        position: "relative",
      }}>
        <PitchGraphic />
        <TeamPlate code={m.home} align="left" />
        <div style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 48,
          color: C.textMute, letterSpacing: "0.06em", padding: "0 12px",
        }}>VS</div>
        <TeamPlate code={m.away} align="right" />
      </div>

      <div style={{
        padding: "0 36px 36px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "end",
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700,
            color: C.textMute, letterSpacing: "0.14em", marginBottom: 14,
          }}>TU PRONÓSTICO</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <ScoreInput
              value={pred.hg}
              onChange={(v) => setPrediction(m, { ...pred, hg: v })}
            />
            <span style={{
              fontFamily: DISPLAY, fontWeight: 900, fontSize: 56,
              color: C.textMute,
            }}>—</span>
            <ScoreInput
              value={pred.ag}
              onChange={(v) => setPrediction(m, { ...pred, ag: v })}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: "0.08em",
          }}>
            <span>PRONÓSTICOS DE LA LIGA</span>
            <span>8 / 9 YA PREDIJERON</span>
          </div>
          <ConsensusBar />
          <button onClick={onSave} style={{
            marginTop: 8,
            padding: "16px 24px", borderRadius: 12,
            background: saved || savedAnim ? "rgba(212,255,63,0.15)" : C.lime,
            color: saved || savedAnim ? C.lime : C.onAccent,
            border: saved || savedAnim ? `1px solid ${C.lime}` : "none",
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 18,
            letterSpacing: "0.04em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 200ms",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {savedAnim ? "✓ GUARDADO" : saved ? "✓ ACTUALIZAR PRONÓSTICO" : "Guardar pronóstico →"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function PitchGraphic() {
  return (
    <div style={{
      position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none",
      background: `
        radial-gradient(ellipse 60% 70% at 50% 50%, rgba(212,255,63,0.06), transparent 70%),
        repeating-linear-gradient(90deg, transparent 0 80px, rgba(255,255,255,0.02) 80px 81px)
      `,
    }} />
  );
}

function ConsensusBar() {
  // mocked: 4 voted ARG win, 3 draw, 1 PAR win
  const segs = [
    { label: "USA", pct: 50, color: C.blue },
    { label: "X",   pct: 37, color: C.textMute },
    { label: "PAR", pct: 13, color: C.coral },
  ];
  return (
    <div>
      <div style={{
        display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 2,
      }}>
        {segs.map((s) => (
          <div key={s.label} style={{
            width: `${s.pct}%`, background: s.color,
            display: "flex", alignItems: "center", justifyContent: "center",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {segs.map((s) => (
          <div key={s.label} style={{
            fontFamily: MONO, fontSize: 10, color: C.textDim, letterSpacing: "0.06em",
          }}>{s.label} <b style={{ color: C.text }}>{s.pct}%</b></div>
        ))}
      </div>
    </div>
  );
}

// ── Today card ──────────────────────────────────────────────────────────────
function TodayCard({ matches, state, onPredict }) {
  return (
    <Card padded={false}>
      <div style={{ padding: "22px 26px 18px" }}>
        <CardHeader
          eyebrow={`${matches.length} partidos`}
          title="HOY"
          right={
            <button style={{
              fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: "0.08em",
              background: "transparent", border: 0, cursor: "pointer",
            }}>VER FIXTURE →</button>
          }
        />
      </div>
      <div>
        {matches.map((m) => (
          <MatchRow
            key={m.id}
            m={m}
            prediction={state.savedPredictions[`${m.home}-${m.away}`]}
            onPredict={(mm) => onPredict(mm)}
          />
        ))}
      </div>
    </Card>
  );
}

// ── Group standings preview ─────────────────────────────────────────────────
function GroupTable({ groupId }) {
  const g = GROUPS.find(g => g.id === groupId);
  const rows = g.teams.map((code, i) => ({
    code, pj: 1, g: [1,1,0,0][i], e: [0,0,1,1][i], p: [0,0,0,0][i],
    gf: [3,2,1,0][i], gc: [1,1,1,3][i], pts: [3,3,1,1][i],
  }));
  return (
    <Card>
      <CardHeader
        eyebrow="EL GRUPO DE TU PRÓXIMO PARTIDO"
        title={`GRUPO ${groupId}`}
        right={
          <div style={{ display: "flex", gap: 4 }}>
            {["A","B","C","D","E","F"].map(id => (
              <button key={id} style={{
                width: 28, height: 28, borderRadius: 6,
                background: id === groupId ? "rgba(212,255,63,0.15)" : "transparent",
                border: `1px solid ${id === groupId ? C.lime + "55" : C.border}`,
                color: id === groupId ? C.lime : C.textDim,
                fontFamily: DISPLAY, fontWeight: 800, fontSize: 13,
                cursor: "pointer",
              }}>{id}</button>
            ))}
          </div>
        }
      />
      <div>
        <div style={{
          display: "grid", gridTemplateColumns: "30px 1fr repeat(5, 36px) 50px",
          gap: 10, padding: "0 4px 10px", fontFamily: MONO, fontSize: 10,
          color: C.textMute, letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}`,
        }}>
          <span></span><span>EQUIPO</span>
          <span style={{ textAlign: "right" }}>PJ</span>
          <span style={{ textAlign: "right" }}>G</span>
          <span style={{ textAlign: "right" }}>E</span>
          <span style={{ textAlign: "right" }}>P</span>
          <span style={{ textAlign: "right" }}>±</span>
          <span style={{ textAlign: "right" }}>PTS</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.code} style={{
            display: "grid", gridTemplateColumns: "30px 1fr repeat(5, 36px) 50px",
            gap: 10, padding: "12px 4px",
            alignItems: "center",
            borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
            borderLeft: i < 2 ? `2px solid ${C.lime}` : "2px solid transparent",
            paddingLeft: 8, marginLeft: -8,
          }}>
            <div style={{
              fontFamily: DISPLAY, fontWeight: 800, fontSize: 16,
              color: i < 2 ? C.lime : C.textDim, textAlign: "center",
            }}>{i + 1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <TeamChip code={r.code} size={22} radius={4} />
              <span style={{ fontFamily: UI, fontWeight: 600, fontSize: 14, color: C.text }}>
                {byCode(r.code).name}
              </span>
            </div>
            <span style={statCell}>{r.pj}</span>
            <span style={statCell}>{r.g}</span>
            <span style={statCell}>{r.e}</span>
            <span style={statCell}>{r.p}</span>
            <span style={statCell}>{r.gf - r.gc > 0 ? `+${r.gf-r.gc}` : (r.gf-r.gc)}</span>
            <span style={{
              ...statCell, fontFamily: DISPLAY, fontWeight: 800, fontSize: 18,
              color: i < 2 ? C.lime : C.text,
            }}>{r.pts}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const statCell = {
  fontFamily: MONO, fontSize: 12, color: C.textDim,
  textAlign: "right", fontVariantNumeric: "tabular-nums",
};

// ── Ranking card ────────────────────────────────────────────────────────────
function RankingCard({ state }) {
  return (
    <Card padded={false}>
      <div style={{ padding: "22px 26px 12px" }}>
        <CardHeader
          eyebrow="LIGA · 9 JUGADORES"
          title="RANKING"
          right={
            <button style={{
              fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: "0.08em",
              background: "transparent", border: 0, cursor: "pointer",
            }}>VER TODO →</button>
          }
        />
      </div>
      <div style={{ padding: "0 14px 16px" }}>
        {RANKING.map((p, i) => (
          <RankRow key={p.id} p={p} idx={i} isCurrent={p.isYou} />
        ))}
      </div>
    </Card>
  );
}

// ── Points card ─────────────────────────────────────────────────────────────
function PointsCard() {
  return (
    <Card>
      <CardHeader eyebrow="CÓMO SE CALCULA" title="PUNTOS" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SCORING.map((s) => (
          <div key={s.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", borderRadius: 10,
            background: s.accent ? "rgba(255,210,63,0.08)" : "rgba(255,255,255,0.025)",
            border: `1px solid ${s.accent ? "rgba(255,210,63,0.25)" : C.border}`,
          }}>
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 500, color: C.text }}>
              {s.label}
            </span>
            <span style={{
              fontFamily: DISPLAY, fontWeight: 800, fontSize: 18,
              color: s.accent ? C.gold : C.lime, letterSpacing: "0.02em",
            }}>{s.pts}</span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: "12px 14px",
        background: "rgba(255,255,255,0.02)", borderRadius: 10,
        fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: "0.04em",
        textAlign: "center",
      }}>
        Máx <b style={{ color: C.text }}>6 PTS</b> por partido · Empate exacto <b style={{ color: C.gold }}>8 PTS</b>
      </div>
    </Card>
  );
}

// ── Sin predecir banner ─────────────────────────────────────────────────────
function SinPredecirCard({ count }) {
  return (
    <Card accent style={{
      background: `linear-gradient(135deg, rgba(255,92,77,0.12), rgba(255,92,77,0.04))`,
      borderColor: "rgba(255,92,77,0.30)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 84,
          color: C.coral, lineHeight: 0.8, letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}>
          <CountUp to={count} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 20,
            color: C.text, textTransform: "uppercase", lineHeight: 1,
            letterSpacing: "0.01em",
          }}>Sin predecir</div>
          <div style={{
            fontFamily: UI, fontSize: 12, color: C.textDim, marginTop: 6, lineHeight: 1.45,
          }}>Cargá tus pronósticos antes del<br/>cierre de cada partido.</div>
        </div>
      </div>
      <button style={{
        marginTop: 18, width: "100%",
        padding: "13px", borderRadius: 10,
        background: "transparent", border: `1px solid ${C.coral}`,
        color: C.coral, fontFamily: DISPLAY, fontWeight: 800, fontSize: 14,
        letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
      }}>Predecir en lote →</button>
    </Card>
  );
}

// ── Footer strip ────────────────────────────────────────────────────────────
function FooterStrip() {
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      padding: "20px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontFamily: MONO, fontSize: 11, color: C.textMute, letterSpacing: "0.08em",
    }}>
      <span>PRODE · MUNDIAL 2026 · v2.0</span>
      <span>JORNADA 02 · 104 PARTIDOS TOTALES · 12 GRUPOS</span>
      <span>ULTIMA ACTUALIZACIÓN HACE 2 MIN</span>
    </div>
  );
}

window.DesktopDashboard = DesktopDashboard;
