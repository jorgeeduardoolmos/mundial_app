/* ── PREDICCIONES ────────────────────────────────────────────────────── */

const STAGE_ORDER = [
  "Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
  "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L",
  "Octavos","Cuartos de final","Semifinales","Tercer puesto","Final"
];
const GROUP_STAGES = ["Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
                      "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L"];
const KNOCKOUT_STAGES = ["Octavos","Cuartos de final","Semifinales","Tercer puesto","Final"];
const KNOCKOUT_LABELS = {
  "Octavos": "16vos de final",
  "Cuartos de final": "8vos de final",
  "Semifinales": "Semifinales",
  "Tercer puesto": "Tercer y cuarto puesto",
  "Final": "Final"
};
const TEAM_NAMES = { "Chequia": "Rep. Checa", "Türkiye": "Turquía" };
function teamName(n) { return TEAM_NAMES[n] || n; }

async function renderPredicciones(el) {
  el.innerHTML = `<div class="loading">Cargando...</div>`;

  let groups;
  try { groups = await api.groups.list(); }
  catch (e) { el.innerHTML = `<div class="empty"><p>${e.message}</p></div>`; return; }

  if (!groups.length) {
    el.innerHTML = `
      <div class="page-title">Mis predicciones</div>
      <div class="empty" style="margin-top:16px;"><p>Necesitás pertenecer a un grupo para predecir.</p></div>`;
    return;
  }

  const groupOptions = groups.map(g => `<option value="${g.id}">${g.name}</option>`).join("");

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
      <div class="page-title">Mis predicciones</div>
      <select class="select-field" id="pred-group-select" style="width:auto;min-width:140px;">${groupOptions}</select>
    </div>
    <div class="page-sub" id="pred-sub"></div>
    <div id="stage-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;"></div>
    <div id="pred-body"></div>
  `;

  if (!document.getElementById("pred-style")) {
    const style = document.createElement("style");
    style.id = "pred-style";
    style.textContent = `
      .pred-input::-webkit-outer-spin-button,
      .pred-input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
      .pred-input[type=number] { -moz-appearance:textfield; }
      .stage-tab {
        background:transparent; border:0.5px solid var(--border2); border-radius:6px;
        padding:5px 12px; font-size:12px; color:var(--text-dim); cursor:pointer;
        transition:all 0.15s;
      }
      .stage-tab:hover { color:var(--text-muted); border-color:var(--border2); }
      .stage-tab.active { background:var(--accent-bg); border-color:var(--accent-dim); color:var(--accent); }

      /* Fila de partido — layout mejorado */
      .match-pred-row {
        display: grid;
        grid-template-columns: 1fr auto auto auto 1fr;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-bottom: 0.5px solid rgba(255,255,255,0.04);
      }
      .match-pred-row:last-child { border-bottom: none; }
      .mp-home { font-size: 13px; font-weight: 500; color: var(--text); }
      .mp-away { font-size: 13px; font-weight: 500; color: var(--text); text-align: right; }
      .mp-center { display:flex; flex-direction:column; align-items:center; gap:4px; }
      .mp-pred { display:flex; flex-direction:column; align-items:center; gap:4px; }
      .mp-pts { display:flex; flex-direction:column; align-items:center; gap:2px; min-width:52px; }
      .mp-label { font-size:9px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.6px; }

      /* Partido finalizado — nombre visible */
      .mp-home.finished { color: var(--text-muted); }
      .mp-away.finished { color: var(--text-muted); }
      .mp-home.no-pred { color: var(--text-dim); }
      .mp-away.no-pred { color: var(--text-dim); }

      /* Score box en resultado */
      .result-score {
        background: var(--accent-bg);
        border: 0.5px solid var(--accent-dim);
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 14px;
        font-weight: 700;
        color: var(--accent);
        white-space: nowrap;
      }
      .result-score.no-pred {
        background: rgba(255,255,255,0.04);
        border-color: rgba(255,255,255,0.08);
        color: var(--text-dim);
      }

      /* Cajas pronóstico deshabilitadas */
      .pred-box-dis {
        width: 34px; height: 30px;
        background: rgba(255,255,255,0.04);
        border: 0.5px solid rgba(255,255,255,0.08);
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 600;
      }
      .pred-box-dis.hit { background: var(--accent-bg); border-color: var(--accent-dim); color: var(--accent); }
      .pred-box-dis.miss { color: var(--text-dim); }

      /* Badge abierto/cerrado/finalizado */
      .status-badge { font-size:9px; padding:2px 7px; border-radius:4px; font-weight:500; white-space:nowrap; }
      .status-open { background:var(--accent2-bg); color:var(--accent2); border:0.5px solid var(--accent2-dim); }
      .status-done { background:rgba(255,255,255,0.04); color:var(--text-dim); }
      .status-closed { background:rgba(255,255,255,0.03); color:var(--text-dim); }

      /* Pts badge */
      .pts-max { font-size:13px;font-weight:700;color:var(--accent); }
      .pts-mid { font-size:13px;font-weight:700;color:var(--accent2); }
      .pts-zero { font-size:13px;font-weight:700;color:var(--text-dim); }
      .pts-none { font-size:11px;color:var(--text-dim);opacity:0.4; }
    `;
    document.head.appendChild(style);
  }

  const select = document.getElementById("pred-group-select");
  select.addEventListener("change", () => {
    _currentStageFilter = "all";
    loadPredicciones(parseInt(select.value));
  });
  loadPredicciones(groups[0].id);
}

let _currentStageFilter = "all";

async function loadPredicciones(groupId) {
  const body = document.getElementById("pred-body");
  body.innerHTML = `<div class="loading">Cargando...</div>`;

  try {
    const [matches, myPreds] = await Promise.all([
      api.matches.list(),
      api.predictions.list(groupId),
    ]);

    const predsByMatch = {};
    myPreds.forEach(p => { predsByMatch[p.match_id] = p; });

    const openMatches = matches.filter(m => m.is_open);
    const scoredPreds = myPreds.filter(p => p.points_earned !== null);
    const totalPts = scoredPreds.reduce((sum, p) => sum + (p.points_earned || 0), 0);

    document.getElementById("pred-sub").textContent =
      `${openMatches.length} partidos abiertos · ${myPreds.length} predicciones · ${totalPts} pts`;

    const stageMap = {};
    matches.forEach(m => {
      if (!stageMap[m.stage]) stageMap[m.stage] = [];
      stageMap[m.stage].push(m);
    });
    const stages = STAGE_ORDER.filter(s => stageMap[s]);

    // Tabs
    const tabsEl = document.getElementById("stage-tabs");
    const groupTabsHtml = GROUP_STAGES.filter(s => stageMap[s])
      .map(s => `<button class="stage-tab ${_currentStageFilter===s?'active':''}" data-stage="${s}">${s}</button>`).join("");
    const knockoutTabsHtml = KNOCKOUT_STAGES.filter(s => stageMap[s])
      .map(s => `<button class="stage-tab ${_currentStageFilter===s?'active':''}" data-stage="${s}">${KNOCKOUT_LABELS[s]}</button>`).join("");

    tabsEl.innerHTML = `
      <button class="stage-tab ${_currentStageFilter==='all'?'active':''}" data-stage="all">Todos</button>
      <div style="width:0.5px;background:var(--border);margin:0 2px;"></div>
      ${groupTabsHtml}
      <div style="width:0.5px;background:var(--border);margin:0 2px;"></div>
      ${knockoutTabsHtml}`;

    tabsEl.querySelectorAll(".stage-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        _currentStageFilter = btn.dataset.stage;
        tabsEl.querySelectorAll(".stage-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderPredBody(body, stages, stageMap, predsByMatch, groupId);
      });
    });

    renderPredBody(body, stages, stageMap, predsByMatch, groupId);

  } catch (e) {
    body.innerHTML = `<div class="empty"><p>${e.message}</p></div>`;
  }
}

function renderPredBody(body, stages, stageMap, predsByMatch, groupId) {
  const filter = _currentStageFilter;
  const isAll = filter === "all";

  if (isAll) {
    const groupStages = stages.filter(s => GROUP_STAGES.includes(s));
    const knockoutStages = stages.filter(s => KNOCKOUT_STAGES.includes(s));
    let html = "";
    if (groupStages.length) {
      html += `<div class="groups-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">`;
      groupStages.forEach(stage => {
        html += `<div>${buildStageBlock(stage, stageMap[stage], predsByMatch, groupId)}</div>`;
      });
      html += `</div>`;
    }
    if (knockoutStages.length) {
      html += `<div style="display:flex;align-items:center;gap:10px;margin:24px 0 16px;">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;white-space:nowrap;">Fase eliminatoria</div>
        <div style="flex:1;height:0.5px;background:linear-gradient(to right,var(--border),transparent);"></div>
      </div>`;
      knockoutStages.forEach(stage => { html += buildStageBlock(stage, stageMap[stage], predsByMatch, groupId); });
    }
    if (!html) html = `<div class="empty"><p>No hay partidos para mostrar todavía.</p></div>`;
    body.innerHTML = html;
  } else {
    let html = "";
    stages.filter(s => s === filter).forEach(stage => { html += buildStageBlock(stage, stageMap[stage], predsByMatch, groupId); });
    if (!html) html = `<div class="empty"><p>No hay partidos en esta fase todavía.</p></div>`;
    body.innerHTML = html;
  }

  attachSaveListeners(body, groupId);
}

function buildStageBlock(stage, matches, predsByMatch, groupId) {
  const open = matches.filter(m => m.is_open);
  const finished = matches.filter(m => m.is_finished);
  const closed = matches.filter(m => !m.is_open && !m.is_finished);
  const hasPredictions = matches.some(m => predsByMatch[m.id]);
  const stageKey = stage.replace(/[\s]/g, '_');
  const label = KNOCKOUT_LABELS[stage] || stage;

  let html = `
    <div style="text-align:center;margin-bottom:10px;">
      <div style="font-size:13px;font-weight:600;color:var(--accent);letter-spacing:1px;text-transform:uppercase;">${label}</div>
      ${open.length ? `<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${open.length} abierto${open.length>1?'s':''}</div>` : ""}
    </div>`;

  // ── Partidos abiertos ─────────────────────────────────────────────────
  if (open.length) {
    html += `<div class="card" style="margin-bottom:8px;" id="card-open-${stageKey}">`;
    open.forEach(m => {
      const ex = predsByMatch[m.id];
      const hVal = ex != null ? ex.predicted_home_goals : "";
      const aVal = ex != null ? ex.predicted_away_goals : "";
      const savedBadge = ex != null
        ? `<span style="font-size:10px;color:var(--accent);white-space:nowrap;">✓ ${ex.predicted_home_goals}—${ex.predicted_away_goals}</span>`
        : `<span style="font-size:10px;color:var(--text-dim);opacity:0.4;">—</span>`;

      html += `
        <div class="match-pred-row" data-match-id="${m.id}">
          <div class="mp-home">${teamName(m.home_team)}</div>
          <div class="mp-center">
            <div class="mp-label">pronóstico</div>
            <div style="display:flex;align-items:center;gap:5px;">
              <input type="number" min="0" max="20" value="${hVal}" class="pred-input" id="ph-${m.id}" placeholder="—">
              <span style="color:var(--text-dim);font-size:12px;">—</span>
              <input type="number" min="0" max="20" value="${aVal}" class="pred-input" id="pa-${m.id}" placeholder="—">
            </div>
            ${savedBadge}
          </div>
          <div class="mp-away">${teamName(m.away_team)}</div>
        </div>`;
    });
    html += `
      <div style="padding:12px 18px;border-top:0.5px solid rgba(255,255,255,0.05);">
        <button class="btn-primary btn-save-stage" data-stage-key="${stageKey}" data-group-id="${groupId}"
          style="width:100%;padding:10px;font-size:11px;letter-spacing:1.5px;">GUARDAR</button>
        <div id="msg-${stageKey}" style="font-size:12px;text-align:center;margin-top:7px;min-height:16px;color:var(--accent);"></div>
      </div>
    </div>`;
  }

  // ── Partidos cerrados con predicción ──────────────────────────────────
  const closedWithPred = closed.filter(m => predsByMatch[m.id]);
  if (closedWithPred.length) {
    html += `<div class="card" style="margin-bottom:8px;">`;
    closedWithPred.forEach(m => {
      const p = predsByMatch[m.id];
      html += `
        <div class="match-pred-row">
          <div class="mp-home finished">${teamName(m.home_team)}</div>
          <div class="mp-center">
            <div class="mp-label">pronóstico</div>
            <div style="display:flex;align-items:center;gap:5px;">
              <div class="pred-box-dis miss">${p.predicted_home_goals}</div>
              <span style="color:var(--text-dim);font-size:12px;">—</span>
              <div class="pred-box-dis miss">${p.predicted_away_goals}</div>
            </div>
            <span class="status-badge status-closed">cerrado</span>
          </div>
          <div class="mp-away finished">${teamName(m.away_team)}</div>
        </div>`;
    });
    html += `</div>`;
  }

  // ── Partidos finalizados ──────────────────────────────────────────────
  if (finished.length) {
    html += `<div class="card" style="margin-bottom:8px;">`;
    finished.forEach(m => {
      const p = predsByMatch[m.id];
      const pts = p ? (p.points_earned || 0) : null;
      const hasPred = p != null;

      // Determinar si cada gol fue acertado
      const hHit = p && p.predicted_home_goals === m.home_goals;
      const aHit = p && p.predicted_away_goals === m.away_goals;

      const ptsBadge = pts === null
        ? `<span class="pts-none">—</span>`
        : pts >= 6 ? `<span class="pts-max">${pts} pts</span>`
        : pts > 0  ? `<span class="pts-mid">${pts} pts</span>`
        : `<span class="pts-zero">0 pts</span>`;

      const predBoxes = hasPred
        ? `<div style="display:flex;align-items:center;gap:5px;">
             <div class="pred-box-dis ${hHit?'hit':'miss'}">${p.predicted_home_goals}</div>
             <span style="color:var(--text-dim);font-size:12px;">—</span>
             <div class="pred-box-dis ${aHit?'hit':'miss'}">${p.predicted_away_goals}</div>
           </div>`
        : `<div style="display:flex;align-items:center;gap:5px;">
             <div class="pred-box-dis miss">—</div>
             <span style="color:var(--text-dim);font-size:12px;">—</span>
             <div class="pred-box-dis miss">—</div>
           </div>`;

      html += `
        <div class="match-pred-row">
          <div class="mp-home ${hasPred?'finished':'no-pred'}">${teamName(m.home_team)}</div>
          <div class="mp-center">
            <div class="mp-label">resultado</div>
            <div class="result-score ${hasPred?'':'no-pred'}">${m.home_goals}—${m.away_goals}</div>
          </div>
          <div class="mp-pred">
            <div class="mp-label">pronóstico</div>
            ${predBoxes}
          </div>
          <div class="mp-pts">
            <div class="mp-label">puntos</div>
            ${ptsBadge}
          </div>
          <div class="mp-away ${hasPred?'finished':'no-pred'}">${teamName(m.away_team)}</div>
        </div>`;
    });
    html += `</div>`;
  }

  return html;
}

function attachSaveListeners(body, groupId) {
  body.querySelectorAll(".btn-save-stage").forEach(btn => {
    btn.addEventListener("click", async () => {
      const stageKey = btn.dataset.stageKey;
      const gId = parseInt(btn.dataset.groupId);
      const msgEl = document.getElementById(`msg-${stageKey}`);

      const toSave = [];
      body.querySelectorAll(`.match-pred-row[data-match-id]`).forEach(row => {
        const matchId = parseInt(row.dataset.matchId);
        const hInput = document.getElementById(`ph-${matchId}`);
        const aInput = document.getElementById(`pa-${matchId}`);
        if (!hInput || !aInput || hInput.value === "" || aInput.value === "") return;
        toSave.push({ matchId, hg: parseInt(hInput.value), ag: parseInt(aInput.value) });
      });

      if (!toSave.length) {
        msgEl.style.color = "var(--accent2)";
        msgEl.textContent = "Ingresá al menos un resultado.";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Guardando...";
      msgEl.textContent = "";

      try {
        await Promise.all(toSave.map(p => api.predictions.save(p.matchId, gId, p.hg, p.ag)));
        msgEl.style.color = "var(--accent)";
        msgEl.textContent = `${toSave.length} predicción${toSave.length>1?"es":""} guardada${toSave.length>1?"s":""}`;
        setTimeout(() => loadPredicciones(gId), 800);
      } catch (e) {
        msgEl.style.color = "var(--accent2)";
        msgEl.textContent = "Error: " + e.message;
        btn.disabled = false;
        btn.textContent = "GUARDAR";
      }
    });
  });
}
