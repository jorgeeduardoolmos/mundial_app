/* ── PARTIDOS ────────────────────────────────────────────────────────── */

const ADMIN_USER = "jorgeeduardoolmos";

async function renderPartidos(el) {
  el.innerHTML = `<div class="loading">Cargando partidos...</div>`;

  try {
    const [stages, matches] = await Promise.all([
      api.matches.stages(),
      api.matches.list(),
    ]);

    const session = getSession();
    const isAdmin = session.username === ADMIN_USER;

    const stageOptions = ["Todas", ...stages].map(s =>
      `<option value="${s}">${s}</option>`
    ).join("");

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
        <div class="page-title">Partidos</div>
        <select class="select-field" id="stage-filter" style="width:auto;min-width:140px;">${stageOptions}</select>
      </div>
      <div class="page-sub">Mundial 2026</div>
      <div id="matches-body"></div>
    `;

    window._allMatches = matches;
    window._isAdmin = isAdmin;

    document.getElementById("stage-filter").addEventListener("change", e => {
      renderMatchList(e.target.value);
    });
    renderMatchList("Todas");

  } catch (e) {
    el.innerHTML = `<div class="empty"><p>Error: ${e.message}</p></div>`;
  }
}

function renderMatchList(stageFilter) {
  const body = document.getElementById("matches-body");
  const matches = stageFilter === "Todas"
    ? window._allMatches
    : window._allMatches.filter(m => m.stage === stageFilter);

  const byDate = {};
  matches.forEach(m => {
    const d = m.match_datetime_str.split("—")[0].trim();
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(m);
  });

  let html = "";
  for (const [date, group] of Object.entries(byDate)) {
    html += `<div class="section-head">${date}</div>
    <div class="card">
      ${group.map(m => matchRow(m, window._isAdmin)).join("")}
    </div>`;
  }

  body.innerHTML = html || `<div class="empty"><p>No hay partidos en esta fase.</p></div>`;

  if (window._isAdmin) {
    body.querySelectorAll(".btn-set-result").forEach(btn => {
      btn.addEventListener("click", () => toggleAdminPanel(parseInt(btn.dataset.matchId)));
    });

    body.querySelectorAll(".btn-confirm-result").forEach(btn => {
      btn.addEventListener("click", async () => {
        const matchId = parseInt(btn.dataset.matchId);
        const hg = parseInt(document.getElementById(`hg-${matchId}`).value);
        const ag = parseInt(document.getElementById(`ag-${matchId}`).value);
        btn.disabled = true;
        try {
          await api.matches.setResult(matchId, hg, ag);
          showToast("Resultado guardado");
          const matches = await api.matches.list();
          window._allMatches = matches;
          renderMatchList(document.getElementById("stage-filter").value);
        } catch (e) {
          showToast("Error: " + e.message);
          btn.disabled = false;
        }
      });
    });
  }
}

function toggleAdminPanel(matchId) {
  const panel = document.getElementById(`admin-panel-${matchId}`);
  if (!panel) return;
  const isHidden = panel.style.display === "none";
  panel.style.display = isHidden ? "flex" : "none";
}

function matchRow(m, isAdmin) {
  const time = m.match_datetime_str.split("—")[1]?.trim() || "";

  let centerEl;
  if (m.is_finished) {
    centerEl = `<div class="match-score">${m.home_goals} — ${m.away_goals}</div>`;
  } else {
    centerEl = `<div class="match-vs">vs</div>`;
  }

  const badge = m.is_finished
    ? `<span class="badge badge-done">finalizado</span>`
    : m.is_open
      ? `<span class="badge badge-open">abierto</span>`
      : `<span class="badge badge-closed">cerrado</span>`;

  // Panel admin: siempre visible para partidos abiertos, oculto por defecto para finalizados
  let adminPanel = "";
  if (isAdmin) {
    const isFinished = m.is_finished;
    const hVal = isFinished ? m.home_goals : 0;
    const aVal = isFinished ? m.away_goals : 0;
    const btnLabel = isFinished ? "✏️ Editar resultado" : "Cargar resultado";
    const panelDisplay = isFinished ? "none" : "flex";

    adminPanel = `
      <div style="border-top:0.5px solid #2a2548;padding:10px 16px;gap:10px;align-items:center;display:flex;" id="admin-panel-${m.id}">
        <span style="font-size:10px;color:#5a5488;">Admin:</span>
        <input id="hg-${m.id}" type="number" min="0" max="20" value="${hVal}" class="pred-input" style="width:38px;">
        <span class="pred-dash">—</span>
        <input id="ag-${m.id}" type="number" min="0" max="20" value="${aVal}" class="pred-input" style="width:38px;">
        <button class="btn-gold-outline btn-confirm-result" data-match-id="${m.id}" style="font-size:10px;padding:5px 12px;">
          ${isFinished ? "Actualizar" : "Guardar"}
        </button>
        ${isFinished ? `<span style="font-size:10px;color:#5a5488;">Puntuaciones se recalcularán</span>` : ""}
      </div>`;

    // Para finalizados, panel oculto por defecto
    if (isFinished) {
      adminPanel = adminPanel.replace('style="border-top:0.5px solid #2a2548;padding:10px 16px;gap:10px;align-items:center;display:flex;"', 'style="border-top:0.5px solid #2a2548;padding:10px 16px;gap:10px;align-items:center;display:none;"');
    }
  }

  const editBtn = (isAdmin && m.is_finished)
    ? `<button class="btn-set-result" data-match-id="${m.id}" style="background:transparent;border:none;color:#5a5488;cursor:pointer;font-size:11px;padding:2px 6px;" title="Editar resultado">✏️</button>`
    : "";

  return `
    <div>
      <div class="card-row">
        <div class="match-team">${m.home_team}</div>
        ${centerEl}
        <div class="match-team right">${m.away_team}</div>
        ${badge}
        ${editBtn}
        <span style="font-size:10px;color:#544f80;margin-left:2px;">${time}</span>
      </div>
      ${adminPanel}
    </div>
  `;
}
