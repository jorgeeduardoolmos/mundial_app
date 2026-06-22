/* ── PREDICCIONES — Floodlight ───────────────────────────────────────── */

const STAGE_ORDER = [
  "Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
  "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L",
  "Octavos","Cuartos de final","4tos de final","Semifinales","Final","Tercer puesto"
];
const GROUP_STAGES = ["Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
                      "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L"];
const KNOCKOUT_STAGES = ["Octavos","Cuartos de final","4tos de final","Semifinales","Final","Tercer puesto"];
const KNOCKOUT_LABELS = {
  "Octavos": "16vos de final",
  "Cuartos de final": "8vos de final",
  "4tos de final": "4tos de Final",
  "Semifinales": "Semifinales",
  "Final": "Final",
  "Tercer puesto": "3er y 4to puesto"
};
const TEAM_NAMES = { "Chequia": "Rep. Checa", "Türkiye": "Turquía" };
function teamName(n) { return TEAM_NAMES[n] || n; }

async function renderPredicciones(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  let groups;
  try { groups = await api.groups.list(); }
  catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('PREDICCIONES','MUNDIAL 2026')}<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:32px;text-align:center;">${escHtml(e.message)}</div></div>`;
    return;
  }

  if (!groups.length) {
    el.innerHTML = `<div class="fl-page">
      ${flPageTitle('PREDICCIONES','MUNDIAL 2026')}
      <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:48px;text-align:center;">
        <div style="font-size:32px;margin-bottom:16px;">⚽</div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">Todavía no estás en ningún grupo</div>
        <div style="font-size:14px;color:rgba(244,245,255,0.62);margin-bottom:24px;">Sumate a un grupo para poder predecir partidos.</div>
        <button onclick="navigate('grupos')" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;padding:14px 28px;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;">Ir a Grupos →</button>
      </div>
    </div>`;
    return;
  }

  const groupSelectHtml = groups.length > 1
    ? `<select id="pred-group-filter" style="background:#14172E;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.75);cursor:pointer;letter-spacing:0.06em;">
        <option value="">Ver Todos</option>
        ${groups.map(g => `<option value="${g.id}">${escHtml(g.name)}</option>`).join('')}
      </select>`
    : '';

  el.innerHTML = `<div class="fl-page">
    <div style="position:absolute;top:-100px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,255,63,0.06),transparent 60%);pointer-events:none;"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;">
      ${flPageTitle('PREDICCIONES','MUNDIAL 2026')}
      ${groupSelectHtml}
    </div>
    <div id="pred-sub" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;margin-bottom:16px;margin-top:-16px;"></div>
    <div id="stage-tabs" style="display:flex;gap:6px;align-items:center;flex-wrap:nowrap;overflow-x:auto;margin-bottom:24px;padding-bottom:4px;scrollbar-width:none;-webkit-overflow-scrolling:touch;"></div>
    <div id="pred-body"></div>
  </div>`;

  const select = document.getElementById("pred-group-filter");
  if (select) {
    select.addEventListener("change", () => {
      _currentStageFilter = "all";
      loadPredicciones(select.value || null);
    });
  }

  loadPredicciones(null);
}

let _currentStageFilter = "all";
let _currentGroupId = null;

async function loadPredicciones(groupId) {
  _currentGroupId = groupId;
  const body = document.getElementById("pred-body");
  if (body) body.innerHTML = flLoading('CARGANDO...');

  try {
    const groups = await api.groups.list();
    const allPreds = [];

    if (groupId) {
      // Mostrar solo predicciones de este grupo
      const preds = await api.predictions.list(groupId);
      allPreds.push(...preds);
    } else {
      // Mostrar todas las predicciones de todos los grupos
      for (const g of groups) {
        const preds = await api.predictions.list(g.id);
        allPreds.push(...preds);
      }
    }

    const [matches] = await Promise.all([
      api.matches.list(),
    ]);

    const predsByMatch = {};
    allPreds.forEach(p => { predsByMatch[p.match_id] = p; });

    const openMatches = matches.filter(m => m.is_open);
    const scoredPreds = allPreds.filter(p => p.points_earned !== null);
    const totalPts = scoredPreds.reduce((sum, p) => sum + (p.points_earned || 0), 0);

    const subEl = document.getElementById("pred-sub");
    if (subEl) subEl.textContent = `${openMatches.length} PARTIDOS ABIERTOS · ${allPreds.length} PREDICCIONES · ${totalPts} PTS`;

    const stageMap = {};
    matches.forEach(m => {
      if (!stageMap[m.stage]) stageMap[m.stage] = [];
      stageMap[m.stage].push(m);
    });
    const stages = STAGE_ORDER.filter(s => stageMap[s]);

    const tabsEl = document.getElementById("stage-tabs");
    const groupTabsHtml = GROUP_STAGES.filter(s => stageMap[s])
      .map(s => `<button class="fl-tab ${_currentStageFilter===s?'active':''}" data-stage="${s}" style="white-space:nowrap;">${escHtml(s)}</button>`).join("");
    const knockoutTabsHtml = KNOCKOUT_STAGES.filter(s => stageMap[s])
      .map(s => `<button class="fl-tab ${_currentStageFilter===s?'active':''}" data-stage="${s}" style="white-space:nowrap;">${escHtml(KNOCKOUT_LABELS[s])}</button>`).join("");

    tabsEl.innerHTML = `
      <button class="fl-tab ${_currentStageFilter==='all'?'active':''}" data-stage="all" style="white-space:nowrap;">Todos</button>
      <span style="width:1px;background:rgba(255,255,255,0.08);flex-shrink:0;align-self:stretch;margin:0 2px;"></span>
      ${groupTabsHtml}
      ${knockoutTabsHtml ? `<span style="width:1px;background:rgba(255,255,255,0.08);flex-shrink:0;align-self:stretch;margin:0 2px;"></span>${knockoutTabsHtml}` : ''}`;

    tabsEl.querySelectorAll(".fl-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        _currentStageFilter = btn.dataset.stage;
        tabsEl.querySelectorAll(".fl-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderPredBody(body, stages, stageMap, predsByMatch, groupId, matches);
      });
    });

    renderPredBody(body, stages, stageMap, predsByMatch, groupId, matches);

  } catch (e) {
    if (body) body.innerHTML = `<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div>`;
  }
}

function renderPredBody(body, stages, stageMap, predsByMatch, groupId, allMatches) {
  const filter = _currentStageFilter;
  const isAll = filter === "all";

  if (isAll) {
    // Mostrar solo partidos abiertos, ordenados cronológicamente
    const openMatches = allMatches.filter(m => m.is_open);
    const sorted = [...openMatches].sort((a, b) => a.match_datetime.localeCompare(b.match_datetime));
    const html = sorted.map(m => buildMatchRow(m, predsByMatch, groupId)).join('');
    body.innerHTML = html || `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay partidos abiertos para predecir.</div>`;
  } else {
    let html = "";
    stages.filter(s => s === filter).forEach(stage => { html += buildStageBlock(stage, stageMap[stage], predsByMatch, groupId); });
    if (!html) html = `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay partidos en esta fase todavía.</div>`;
    body.innerHTML = html;
  }

  attachSaveListeners(body, groupId);
}

function buildMatchRow(match, predsByMatch, groupId) {
  const ex = predsByMatch[match.id];
  const hVal = ex != null ? ex.predicted_home_goals : "";
  const aVal = ex != null ? ex.predicted_away_goals : "";
  const savedBadge = ex != null
    ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D4FF3F;letter-spacing:0.04em;">✓ ${ex.predicted_home_goals}—${ex.predicted_away_goals}</span>`
    : `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.2);">sin predecir</span>`;
  const homeTeam = teamName(match.home_team);
  const awayTeam = teamName(match.away_team);

  return `
    <div class="match-pred-row" data-match-id="${match.id}" style="display:grid;grid-template-columns:80px 1fr auto 1fr 100px;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);background:#14172E;margin-bottom:4px;border-radius:8px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.38);">${match.match_datetime_str||''}</div>
      <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;min-width:0;">
        <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:12px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(homeTeam)}</span>
        ${chipByName(homeTeam,18,4)}
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="display:flex;align-items:center;gap:4px;">
          <input type="number" min="0" max="20" value="${String(hVal)}" id="ph-${match.id}"
            style="width:32px;height:28px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;color:#F4F5FF;-moz-appearance:textfield;outline:none;"
            oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.25);">—</span>
          <input type="number" min="0" max="20" value="${String(aVal)}" id="pa-${match.id}"
            style="width:32px;height:28px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;color:#F4F5FF;-moz-appearance:textfield;outline:none;"
            oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
        </div>
        ${savedBadge}
      </div>
      <div style="display:flex;align-items:center;gap:6px;min-width:0;">
        ${chipByName(awayTeam,18,4)}
        <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:12px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(awayTeam)}</span>
      </div>
      <button class="btn-save-match" data-match-id="${match.id}" data-group-id="${groupId}"
        style="width:90px;padding:8px 12px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:8px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:opacity 0.15s;">
        GUARDAR
      </button>
    </div>`;
}

function buildStageBlock(stage, matches, predsByMatch, groupId) {
  const open = matches.filter(m => m.is_open);
  const finished = matches.filter(m => m.is_finished);
  const closed = matches.filter(m => !m.is_open && !m.is_finished);
  const stageKey = stage.replace(/[\s]/g, '_');
  const label = KNOCKOUT_LABELS[stage] || stage;

  let html = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:#D4FF3F;letter-spacing:0.14em;text-transform:uppercase;">${escHtml(label)}</div>
      ${open.length ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(212,255,63,0.7);background:rgba(212,255,63,0.08);border:1px solid rgba(212,255,63,0.2);border-radius:4px;padding:2px 7px;letter-spacing:0.06em;">${open.length} ABIERTO${open.length>1?'S':''}</span>` : ''}
    </div>`;

  if (open.length) {
    html += `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:10px;" id="card-open-${stageKey}">`;
    open.forEach((m, i) => {
      const ex = predsByMatch[m.id];
      const hVal = ex != null ? ex.predicted_home_goals : "";
      const aVal = ex != null ? ex.predicted_away_goals : "";
      const savedBadge = ex != null
        ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D4FF3F;letter-spacing:0.04em;">✓ ${ex.predicted_home_goals}—${ex.predicted_away_goals}</span>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.2);">sin predecir</span>`;
      const homeTeam = teamName(m.home_team);
      const awayTeam = teamName(m.away_team);
      html += `
        <div class="match-pred-row" data-match-id="${m.id}" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;padding:12px 16px;${i < open.length-1?'border-bottom:1px solid rgba(255,255,255,0.04);':''}">
          <div style="display:flex;align-items:center;gap:7px;">
            ${chipByName(homeTeam,20,4)}
            <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(homeTeam)}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
            <div style="display:flex;align-items:center;gap:5px;">
              <input type="number" min="0" max="20" value="${String(hVal)}" id="ph-${m.id}"
                style="width:36px;height:32px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;color:#F4F5FF;-moz-appearance:textfield;outline:none;"
                oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
              <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.25);">—</span>
              <input type="number" min="0" max="20" value="${String(aVal)}" id="pa-${m.id}"
                style="width:36px;height:32px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;color:#F4F5FF;-moz-appearance:textfield;outline:none;"
                oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
            </div>
            ${savedBadge}
          </div>
          <div style="display:flex;align-items:center;gap:7px;justify-content:flex-end;">
            <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(awayTeam)}</span>
            ${chipByName(awayTeam,20,4)}
          </div>
        </div>`;
    });
    html += `
      <div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.06);">
        <button class="btn-save-stage" data-stage-key="${stageKey}" data-group-id="${groupId}"
          style="width:100%;padding:12px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:opacity 0.15s;">
          GUARDAR
        </button>
        <div id="msg-${stageKey}" style="font-family:'JetBrains Mono',monospace;font-size:11px;text-align:center;margin-top:8px;min-height:14px;color:#D4FF3F;letter-spacing:0.06em;"></div>
      </div>
    </div>`;
  }

  const closedWithPred = closed.filter(m => predsByMatch[m.id]);
  if (closedWithPred.length) {
    html += `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:10px;">`;
    closedWithPred.forEach((m, i) => {
      const p = predsByMatch[m.id];
      const homeTeam = teamName(m.home_team);
      const awayTeam = teamName(m.away_team);
      html += `
        <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;padding:12px 16px;${i < closedWithPred.length-1?'border-bottom:1px solid rgba(255,255,255,0.04);':''}">
          <div style="display:flex;align-items:center;gap:7px;opacity:0.55;">
            ${chipByName(homeTeam,20,4)}
            <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(homeTeam)}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="display:flex;align-items:center;gap:4px;">
              <div style="width:32px;height:28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:rgba(244,245,255,0.35);">${p.predicted_home_goals}</div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.2);">—</span>
              <div style="width:32px;height:28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:rgba(244,245,255,0.35);">${p.predicted_away_goals}</div>
            </div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.22);background:rgba(255,255,255,0.04);padding:2px 7px;border-radius:4px;letter-spacing:0.08em;">CERRADO</span>
          </div>
          <div style="display:flex;align-items:center;gap:7px;justify-content:flex-end;opacity:0.55;">
            <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(awayTeam)}</span>
            ${chipByName(awayTeam,20,4)}
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  if (finished.length) {
    html += `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:10px;">`;
    finished.forEach((m, i) => {
      const p = predsByMatch[m.id];
      const pts = p ? (p.points_earned || 0) : null;
      const hasPred = p != null;
      const hHit = p && p.predicted_home_goals === m.home_goals;
      const aHit = p && p.predicted_away_goals === m.away_goals;
      const homeTeam = teamName(m.home_team);
      const awayTeam = teamName(m.away_team);

      const ptsBadge = pts === null
        ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.2);">—</span>`
        : pts >= 6
          ? `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#D4FF3F;background:rgba(212,255,63,0.1);border:1px solid rgba(212,255,63,0.25);padding:2px 8px;border-radius:5px;">${pts} PTS</span>`
          : pts > 0
            ? `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#FFD23F;background:rgba(255,210,63,0.1);border:1px solid rgba(255,210,63,0.2);padding:2px 8px;border-radius:5px;">${pts} PTS</span>`
            : `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.25);">0 PTS</span>`;

      const predBoxes = hasPred
        ? `<div style="display:flex;align-items:center;gap:4px;">
            <div style="width:26px;height:24px;background:${hHit?'rgba(212,255,63,0.12)':'rgba(255,255,255,0.04)'};border:1px solid ${hHit?'rgba(212,255,63,0.3)':'rgba(255,255,255,0.08)'};border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;color:${hHit?'#D4FF3F':'rgba(244,245,255,0.32)'};">${p.predicted_home_goals}</div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.2);">—</span>
            <div style="width:26px;height:24px;background:${aHit?'rgba(212,255,63,0.12)':'rgba(255,255,255,0.04)'};border:1px solid ${aHit?'rgba(212,255,63,0.3)':'rgba(255,255,255,0.08)'};border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;color:${aHit?'#D4FF3F':'rgba(244,245,255,0.32)'};">${p.predicted_away_goals}</div>
           </div>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.2);letter-spacing:0.06em;">SIN PRED.</span>`;

      html += `
        <div style="padding:10px 16px;${i < finished.length-1?'border-bottom:1px solid rgba(255,255,255,0.04);':''}">
          <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:6px;opacity:${hasPred?'1':'0.5'};">
              ${chipByName(homeTeam,18,3)}
              <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(homeTeam)}</span>
            </div>
            <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:18px;color:#F4F5FF;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:4px 12px;white-space:nowrap;">${m.home_goals} — ${m.away_goals}</div>
            <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;opacity:${hasPred?'1':'0.5'};">
              <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:13px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(awayTeam)}</span>
              ${chipByName(awayTeam,18,3)}
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.25);letter-spacing:0.08em;">PRONÓSTICO</span>
              ${predBoxes}
            </div>
            ${ptsBadge}
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  return html;
}

function attachSaveListeners(body, groupId) {
  body.querySelectorAll(".btn-save-match").forEach(btn => {
    btn.addEventListener("click", async () => {
      const matchId = parseInt(btn.dataset.matchId);
      let gId = parseInt(btn.dataset.groupId);

      // Si es modo "Ver Todos", usar el primer grupo del usuario
      if (!gId || gId === "null") {
        const groups = await api.groups.list();
        if (!groups.length) return;
        gId = groups[0].id;
      }

      const hInput = document.getElementById(`ph-${matchId}`);
      const aInput = document.getElementById(`pa-${matchId}`);
      if (!hInput || !aInput || hInput.value === "" || aInput.value === "") return;

      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.textContent = "...";
      const originalText = "GUARDAR";

      try {
        await api.predictions.save(matchId, gId, parseInt(hInput.value), parseInt(aInput.value));
        btn.textContent = "✓";
        btn.style.background = "rgba(212,255,63,0.5)";
        setTimeout(() => {
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.textContent = originalText;
          btn.style.background = "#D4FF3F";
          loadPredicciones(_currentGroupId);
        }, 800);
      } catch (e) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.textContent = "Error";
        btn.style.background = "#FF5C4D";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "#D4FF3F";
        }, 2000);
      }
    });
  });
}
