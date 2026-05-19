/* ── INICIO ──────────────────────────────────────────────────────────── */

async function renderInicio(el) {
  const s = getSession();
  el.innerHTML = `<div class="loading">Cargando...</div>`;

  if (!document.getElementById("inicio-style")) {
    const style = document.createElement("style");
    style.id = "inicio-style";
    style.textContent = `
      .widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .widget { border-radius: 14px; padding: 16px 18px; cursor: pointer; transition: filter 0.15s, transform 0.12s; position: relative; border: 0.5px solid transparent; }
      .widget:hover { filter: brightness(1.06); transform: translateY(-1px); }
      .widget:active { transform: scale(0.99); }
      .widget.full { grid-column: 1 / -1; }
      .widget.no-cursor { cursor: default; }
      .widget.no-cursor:hover { filter: none; transform: none; }
      .w-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; opacity: 0.5; }
      .w-label::after { content:''; flex:1; height:0.5px; background: currentColor; opacity: 0.2; }
      .w-arrow { position: absolute; top: 14px; right: 16px; font-size: 13px; opacity: 0.2; transition: opacity 0.15s; }
      .widget:hover .w-arrow { opacity: 0.6; }
      .streak-dot { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
      .pts-rule { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 0.5px solid rgba(49,44,81,0.15); }
      .pts-rule:last-child { border-bottom: none; }

      /* Oscuros */
      .w-greeting  { background: linear-gradient(135deg, #3d3868, #48426D); border-color: #544f80; color: #f5f0ff; }
      .w-resultado { background: linear-gradient(135deg, #3a3560, #44406e); border-color: #4a4578; color: #f5f0ff; }
      .w-stats     { background: linear-gradient(135deg, #312C51, #3a3560); border-color: #4a4578; color: #f5f0ff; }
      .w-sinpred   { background: linear-gradient(135deg, #38305e, #44406e); border-color: #544f80; color: #f5f0ff; }

      /* Melocotón */
      .w-proximo   { background: linear-gradient(135deg, #F0C38E, #e8a96a); border-color: #d4944a; color: #312C51; }
      .w-ranking   { background: linear-gradient(135deg, #F0C38E, #edb97a); border-color: #d4944a; color: #312C51; }
      .w-puntos    { background: linear-gradient(135deg, #F1AA9B, #e8907e); border-color: #d4704a; color: #312C51; }

      /* Empty state — teal/verde azulado */
      .w-empty-teal {
        background: linear-gradient(135deg, #1a4a4a, #1e5a5a);
        border-color: #2a7a7a;
        color: #a0e0e0;
      }
      /* Empty state — índigo */
      .w-empty-indigo {
        background: linear-gradient(135deg, #2a2060, #352878);
        border-color: #4a3a9a;
        color: #b0a0f0;
      }
      /* Empty state — verde */
      .w-empty-green {
        background: linear-gradient(135deg, #1a4030, #1e5038);
        border-color: #2a7a50;
        color: #80d0a0;
      }

      .w-empty-icon { font-size: 28px; margin-bottom: 10px; display: block; }
      .w-empty-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
      .w-empty-msg { font-size: 12px; opacity: 0.7; line-height: 1.5; margin-bottom: 12px; }
      .w-empty-btn {
        display: inline-block;
        background: rgba(255,255,255,0.15);
        border: 0.5px solid rgba(255,255,255,0.25);
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
      }
      .w-empty-btn:hover { background: rgba(255,255,255,0.22); }
    `;
    document.head.appendChild(style);
  }

  // ── Cargar datos ──────────────────────────────────────────────────────
  let groups = [], matches = [], myPreds = [], rankingData = null;
  let selectedGroup = null, lastFinished = null, nextOpen = null;
  let lastPred = null, nextPred = null;

  try {
    [groups, matches] = await Promise.all([
      api.groups.list(),
      api.matches.list(),
    ]);
  } catch (e) {
    el.innerHTML = `<div class="empty"><p>Error cargando datos: ${e.message}</p></div>`;
    return;
  }

  const openMatches = matches.filter(m => m.is_open);
  const finishedMatches = matches.filter(m => m.is_finished);
  lastFinished = finishedMatches[finishedMatches.length - 1] || null;
  nextOpen = openMatches[0] || null;
  selectedGroup = groups[0] || null;

  if (selectedGroup) {
    try {
      [myPreds, rankingData] = await Promise.all([
        api.predictions.list(selectedGroup.id),
        api.ranking.get(selectedGroup.id),
      ]);
    } catch (e) {
      myPreds = [];
      rankingData = null;
    }
    if (lastFinished) lastPred = myPreds.find(p => p.match_id === lastFinished.id) || null;
    if (nextOpen)     nextPred = myPreds.find(p => p.match_id === nextOpen.id) || null;
  }

  const scored = myPreds.filter(p => p.points_earned !== null);
  const totalPts = scored.reduce((sum, p) => sum + (p.points_earned || 0), 0);
  const exactos = scored.filter(p => p.points_earned >= 6).length;
  const lastScored = scored.slice(-7).reverse();

  // ── Construir widgets ─────────────────────────────────────────────────
  el.innerHTML = `<div class="widget-grid" id="widget-grid"></div>`;
  const grid = document.getElementById("widget-grid");

  // ── W saludo (full) ───────────────────────────────────────────────────
  grid.innerHTML += `
    <div class="widget w-greeting full no-cursor">
      <div style="font-size:22px;font-weight:700;margin-bottom:4px;">Hola, ${s.display_name} 👋</div>
      <div style="font-size:13px;opacity:0.45;">Mundial 2026 · ${openMatches.length} partidos abiertos para predecir</div>
    </div>`;

  // ── FILA 1: Último resultado | Mi ranking ─────────────────────────────

  // Último resultado
  if (lastFinished) {
    const pts = lastPred ? (lastPred.points_earned || 0) : null;
    const hPred = lastPred ? lastPred.predicted_home_goals : null;
    const aPred = lastPred ? lastPred.predicted_away_goals : null;
    const ptsBadge = pts !== null
      ? `<div style="font-size:15px;font-weight:700;color:#F0C38E;">${pts} pts</div>`
      : `<div style="font-size:12px;opacity:0.4;">sin predicción</div>`;

    grid.innerHTML += `
      <div class="widget w-resultado" data-nav="predicciones">
        <i class="ti ti-chevron-right w-arrow"></i>
        <div class="w-label">Último resultado</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="flex:1;font-size:14px;font-weight:600;">${lastFinished.home_team}</div>
          <div style="background:#F0C38E18;border:0.5px solid #F0C38E44;border-radius:6px;padding:4px 12px;font-size:15px;font-weight:700;color:#F0C38E;">${lastFinished.home_goals}—${lastFinished.away_goals}</div>
          <div style="flex:1;font-size:14px;font-weight:600;text-align:right;">${lastFinished.away_team}</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:0.5px solid rgba(255,255,255,0.07);">
          <div>
            <div style="font-size:9px;opacity:0.4;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:5px;">Tu pronóstico</div>
            <div style="display:flex;align-items:center;gap:5px;">
              <div style="width:32px;height:28px;background:rgba(255,255,255,0.07);border:0.5px solid #F0C38E33;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#F0C38E;">${hPred !== null ? hPred : "—"}</div>
              <span style="font-size:11px;opacity:0.3;">—</span>
              <div style="width:32px;height:28px;background:rgba(255,255,255,0.07);border:0.5px solid #F0C38E33;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#F0C38E;">${aPred !== null ? aPred : "—"}</div>
            </div>
          </div>
          ${ptsBadge}
        </div>
      </div>`;
  } else {
    grid.innerHTML += `
      <div class="widget w-empty-indigo" data-nav="partidos">
        <i class="ti ti-chevron-right w-arrow"></i>
        <span class="w-empty-icon">⏳</span>
        <div class="w-empty-title">Esperando el pitazo</div>
        <div class="w-empty-msg">El Mundial aún no empezó. Los resultados van a aparecer acá cuando arranquen los partidos.</div>
        <span class="w-empty-btn">Ver partidos →</span>
      </div>`;
  }

  // Mi ranking
  if (rankingData && rankingData.entries.length > 0) {
    const top3 = rankingData.entries.slice(0, 3);
    const me = rankingData.entries.find(e => e.user_id === s.user_id);
    const rankRows = top3.map(e => {
      const isMe = e.user_id === s.user_id;
      const medal = e.position === 1 ? "🥇" : e.position === 2 ? "🥈" : "🥉";
      return `
        <div style="display:flex;align-items:center;gap:8px;padding:6px ${isMe?'8px':'0'};border-radius:7px;${isMe?'background:rgba(49,44,81,0.12);':''}border-bottom:0.5px solid rgba(49,44,81,0.1);">
          <div style="font-size:14px;width:22px;text-align:center;">${medal}</div>
          <div style="width:24px;height:24px;border-radius:50%;background:rgba(49,44,81,0.15);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;color:#312C51;">${getInitials(e.display_name)}</div>
          <div style="flex:1;font-size:13px;color:#312C51;${isMe?'font-weight:700;':'opacity:0.7;'}">${e.display_name}${isMe?'<span style="font-size:9px;background:rgba(49,44,81,0.15);color:#312C51;padding:1px 6px;border-radius:3px;margin-left:5px;font-weight:600;">vos</span>':''}</div>
          <div style="font-size:13px;font-weight:700;color:#312C51;${!isMe?'opacity:0.6;':''}">${e.total_pts} pts</div>
        </div>`;
    }).join("");
    const myPos = me && me.position > 3
      ? `<div style="margin-top:8px;font-size:11px;color:#312C51;opacity:0.5;text-align:center;">Vos: #${me.position} · ${me.total_pts} pts</div>` : "";
    grid.innerHTML += `
      <div class="widget w-ranking" data-nav="ranking">
        <i class="ti ti-chevron-right w-arrow" style="color:#312C51;"></i>
        <div class="w-label" style="color:#312C51;justify-content:space-between;"><span>Mi ranking</span><span style="font-size:10px;opacity:0.5;">${selectedGroup ? selectedGroup.name : ''}</span></div>
        ${rankRows}${myPos}
      </div>`;
  } else if (!selectedGroup) {
    grid.innerHTML += `
      <div class="widget w-empty-teal" data-nav="grupos">
        <i class="ti ti-chevron-right w-arrow"></i>
        <span class="w-empty-icon">🏆</span>
        <div class="w-empty-title">¡Sumate a un grupo!</div>
        <div class="w-empty-msg">Competí con tus amigos. Creá tu propio grupo o pedile el link mágico a alguien.</div>
        <span class="w-empty-btn">Ir a grupos →</span>
      </div>`;
  } else {
    grid.innerHTML += `
      <div class="widget w-empty-teal" data-nav="ranking">
        <i class="ti ti-chevron-right w-arrow"></i>
        <span class="w-empty-icon">📊</span>
        <div class="w-empty-title">Ranking en construcción</div>
        <div class="w-empty-msg">Todavía no hay puntos en el grupo. ¡Cargá tus predicciones y empezá a competir!</div>
        <span class="w-empty-btn">Ver ranking →</span>
      </div>`;
  }

  // ── FILA 2: Sin predecir | Próximo partido ────────────────────────────

  // Sin predecir
  const unpredicted = selectedGroup
    ? openMatches.filter(m => !myPreds.find(p => p.match_id === m.id))
    : openMatches;

  if (!selectedGroup) {
    grid.innerHTML += `
      <div class="widget w-empty-indigo" data-nav="grupos">
        <i class="ti ti-chevron-right w-arrow"></i>
        <span class="w-empty-icon">🎯</span>
        <div class="w-empty-title">¿Listo para predecir?</div>
        <div class="w-empty-msg">Primero necesitás estar en un grupo. Creá uno o pedile el link a un amigo.</div>
        <span class="w-empty-btn">Crear grupo →</span>
      </div>`;
  } else {
    grid.innerHTML += `
      <div class="widget w-sinpred" data-nav="predicciones">
        <i class="ti ti-chevron-right w-arrow"></i>
        <div class="w-label">Sin predecir</div>
        <div style="font-size:36px;font-weight:700;line-height:1;margin-bottom:5px;color:#F0C38E;">${unpredicted.length}</div>
        <div style="font-size:12px;opacity:0.35;margin-bottom:12px;">partidos abiertos</div>
        <div style="font-size:12px;opacity:0.5;line-height:1.9;">
          ${unpredicted.slice(0, 3).map(m => `<div>· ${m.home_team} vs ${m.away_team}</div>`).join("")}
          ${unpredicted.length > 3 ? `<div style="opacity:0.3;">· y ${unpredicted.length - 3} más...</div>` : ""}
          ${unpredicted.length === 0 ? '<div style="color:#F0C38E;opacity:0.8;">✓ ¡Todas predichas!</div>' : ""}
        </div>
      </div>`;
  }

  // Próximo partido
  if (nextOpen) {
    const hPred = nextPred ? nextPred.predicted_home_goals : null;
    const aPred = nextPred ? nextPred.predicted_away_goals : null;
    const predSection = hPred !== null
      ? `<div style="display:flex;align-items:center;gap:6px;">
           <div style="width:32px;height:28px;background:rgba(49,44,81,0.15);border:0.5px solid rgba(49,44,81,0.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#312C51;">${hPred}</div>
           <span style="color:#312C51;opacity:0.4;">—</span>
           <div style="width:32px;height:28px;background:rgba(49,44,81,0.15);border:0.5px solid rgba(49,44,81,0.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#312C51;">${aPred}</div>
           <span style="font-size:12px;color:#312C51;opacity:0.55;margin-left:4px;">✓ guardado</span>
         </div>`
      : `<div style="font-size:12px;background:rgba(49,44,81,0.12);border:0.5px solid rgba(49,44,81,0.2);padding:8px 12px;border-radius:8px;text-align:center;color:#312C51;font-weight:600;">Predecir ahora →</div>`;
    grid.innerHTML += `
      <div class="widget w-proximo" data-nav="predicciones">
        <i class="ti ti-chevron-right w-arrow" style="color:#312C51;"></i>
        <div class="w-label" style="color:#312C51;">Próximo partido</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
          <div style="flex:1;font-size:14px;font-weight:700;color:#312C51;">${nextOpen.home_team}</div>
          <div style="font-size:11px;color:#312C51;opacity:0.35;">vs</div>
          <div style="flex:1;font-size:14px;font-weight:700;color:#312C51;text-align:right;">${nextOpen.away_team}</div>
        </div>
        <div style="font-size:11px;color:#312C51;opacity:0.55;margin-bottom:12px;">${nextOpen.match_datetime_str}</div>
        <div style="font-size:9px;color:#312C51;opacity:0.4;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:7px;">Tu pronóstico</div>
        ${predSection}
      </div>`;
  } else {
    grid.innerHTML += `
      <div class="widget w-empty-green" data-nav="partidos">
        <i class="ti ti-chevron-right w-arrow"></i>
        <span class="w-empty-icon">🏁</span>
        <div class="w-empty-title">¡Fase de grupos terminada!</div>
        <div class="w-empty-msg">Ya no hay partidos abiertos para predecir. Esperá la siguiente fase.</div>
        <span class="w-empty-btn">Ver partidos →</span>
      </div>`;
  }

  // ── FILA 3: Mis stats | Sistema de puntos ─────────────────────────────

  // Mis stats
  grid.innerHTML += `
    <div class="widget w-stats" data-nav="predicciones">
      <i class="ti ti-chevron-right w-arrow"></i>
      <div class="w-label">Mis stats</div>
      <div style="display:flex;gap:16px;align-items:flex-end;margin-bottom:14px;">
        <div><div style="font-size:36px;font-weight:700;line-height:1;color:#F0C38E;">${totalPts}</div><div style="font-size:10px;opacity:0.4;margin-top:3px;text-transform:uppercase;letter-spacing:0.5px;">puntos</div></div>
        <div><div style="font-size:22px;font-weight:600;color:#F1AA9B;">${scored.length}</div><div style="font-size:10px;opacity:0.4;margin-top:3px;text-transform:uppercase;letter-spacing:0.5px;">pred.</div></div>
        <div><div style="font-size:22px;font-weight:600;opacity:0.5;">${exactos}</div><div style="font-size:10px;opacity:0.4;margin-top:3px;text-transform:uppercase;letter-spacing:0.5px;">exactos</div></div>
      </div>
      ${scored.length === 0
        ? `<div style="font-size:12px;opacity:0.35;">Tus stats aparecerán cuando empiecen a puntuarse partidos.</div>`
        : `<div style="font-size:9px;opacity:0.35;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:7px;">Últimos partidos</div>
           <div style="display:flex;gap:5px;">
             ${lastScored.map(p => {
               const pts = p.points_earned || 0;
               const bg = pts >= 6 ? '#F0C38E20' : pts > 0 ? '#F1AA9B18' : 'rgba(255,255,255,0.05)';
               const color = pts >= 6 ? '#F0C38E' : pts > 0 ? '#F1AA9B' : 'rgba(255,255,255,0.15)';
               return `<div class="streak-dot" style="background:${bg};color:${color};">${pts}</div>`;
             }).join("")}
           </div>`
      }
    </div>`;

  // Sistema de puntos
  grid.innerHTML += `
    <div class="widget w-puntos no-cursor">
      <div class="w-label" style="color:#312C51;">Sistema de puntos</div>
      <div>
        <div class="pts-rule"><div style="font-size:13px;color:#312C51;opacity:0.75;">Ganador o empate</div><div style="font-size:13px;font-weight:700;color:#312C51;">2 pts</div></div>
        <div class="pts-rule"><div style="font-size:13px;color:#312C51;opacity:0.75;">Goles del ganador</div><div style="font-size:13px;font-weight:700;color:#312C51;">2 pts</div></div>
        <div class="pts-rule"><div style="font-size:13px;color:#312C51;opacity:0.75;">Goles del perdedor</div><div style="font-size:13px;font-weight:700;color:#312C51;">2 pts</div></div>
        <div class="pts-rule"><div style="font-size:13px;color:#312C51;opacity:0.75;">Marcador exacto empate</div><div style="font-size:13px;font-weight:700;color:#312C51;">4 pts extra</div></div>
      </div>
      <div style="margin-top:10px;padding-top:8px;border-top:0.5px solid rgba(49,44,81,0.15);font-size:11px;color:#312C51;opacity:0.45;">
        Máx. 6 pts por partido · Empate exacto: 8 pts
      </div>
    </div>`;

  // ── Click handlers ────────────────────────────────────────────────────
  document.querySelectorAll(".widget[data-nav]").forEach(w => {
    w.addEventListener("click", () => navigate(w.dataset.nav));
  });
  document.querySelectorAll(".w-empty-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const page = btn.closest(".widget").dataset.nav;
      if (page) navigate(page);
    });
  });
}
