/* ── PARTIDOS — Floodlight ───────────────────────────────────────────── */

const ADMIN_USER = "jorgeeduardoolmos";

async function renderPartidos(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  try {
    const [stages, matches] = await Promise.all([
      api.matches.stages(),
      api.matches.list(),
    ]);

    const session = getSession();
    const isAdmin = session.username === ADMIN_USER;

    const tabsHtml = ["Todas", ...stages].map((s, i) =>
      `<button class="fl-tab ${i===0?'active':''}" data-stage="${escHtml(s)}" style="white-space:nowrap;">${escHtml(s)}</button>`
    ).join("");

    el.innerHTML = `<div class="fl-page">
      <div style="position:absolute;top:-100px;left:-200px;width:500px;height:500px;background:radial-gradient(circle,rgba(59,91,255,0.07),transparent 60%);pointer-events:none;"></div>
      ${flPageTitle('PARTIDOS','MUNDIAL 2026')}
      <div id="stage-tabs-p" style="display:flex;gap:6px;align-items:center;flex-wrap:nowrap;overflow-x:auto;margin-bottom:28px;padding-bottom:4px;scrollbar-width:none;-webkit-overflow-scrolling:touch;">
        ${tabsHtml}
      </div>
      <div id="matches-body"></div>
    </div>`;

    window._allMatches = matches;
    window._isAdmin = isAdmin;

    document.getElementById("stage-tabs-p").querySelectorAll(".fl-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("stage-tabs-p").querySelectorAll(".fl-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMatchList(btn.dataset.stage);
      });
    });

    renderMatchList("Todas");

  } catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('PARTIDOS','MUNDIAL 2026')}<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div></div>`;
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
    html += `
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:rgba(244,245,255,0.38);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
        <span style="flex-shrink:0;">${escHtml(date)}</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.06);"></div>
      </div>
      <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;margin-bottom:20px;">
        ${group.map((m, i) => matchRow(m, window._isAdmin, i < group.length - 1)).join("")}
      </div>`;
  }

  if (!html) html = `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay partidos en esta fase.</div>`;
  body.innerHTML = html;

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
          const updated = await api.matches.list();
          window._allMatches = updated;
          const activeTab = document.querySelector("#stage-tabs-p .fl-tab.active");
          renderMatchList(activeTab ? activeTab.dataset.stage : "Todas");
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
  panel.classList.toggle("visible");
}

function matchRow(m, isAdmin, hasBorder) {
  const time = m.match_datetime_str.split("—")[1]?.trim() || "";
  const home = typeof teamName === "function" ? teamName(m.home_team) : m.home_team;
  const away = typeof teamName === "function" ? teamName(m.away_team) : m.away_team;

  const centerEl = m.is_finished
    ? `<div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:22px;color:#F4F5FF;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:4px 14px;white-space:nowrap;">${m.home_goals} — ${m.away_goals}</div>`
    : `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);letter-spacing:0.08em;">${escHtml(time) || 'vs'}</div>`;

  const badge = m.is_finished
    ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,0.04);color:rgba(244,245,255,0.28);letter-spacing:0.06em;">FT</span>`
    : m.is_open
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(212,255,63,0.1);color:#D4FF3F;border:1px solid rgba(212,255,63,0.25);letter-spacing:0.06em;">ABIERTO</span>`
      : `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,0.04);color:rgba(244,245,255,0.28);letter-spacing:0.06em;">CERRADO</span>`;

  const editBtn = (isAdmin && m.is_finished)
    ? `<button class="btn-set-result" data-match-id="${m.id}" style="background:transparent;border:none;color:rgba(244,245,255,0.22);cursor:pointer;font-size:12px;padding:2px 4px;line-height:1;" title="Editar resultado">✏️</button>`
    : "";

  let adminPanel = "";
  if (isAdmin) {
    const hVal = m.is_finished ? m.home_goals : 0;
    const aVal = m.is_finished ? m.away_goals : 0;
    adminPanel = `
      <div class="fl-admin-panel${m.is_finished ? '' : ' visible'}" id="admin-panel-${m.id}"
        style="flex-direction:row;align-items:center;gap:10px;padding:10px 18px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(212,255,63,0.03);">
        <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(212,255,63,0.5);letter-spacing:0.1em;flex-shrink:0;">ADMIN</span>
        <input id="hg-${m.id}" type="number" min="0" max="20" value="${hVal}"
          style="width:38px;height:30px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;color:#F4F5FF;-moz-appearance:textfield;outline:none;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.25);">—</span>
        <input id="ag-${m.id}" type="number" min="0" max="20" value="${aVal}"
          style="width:38px;height:30px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;color:#F4F5FF;-moz-appearance:textfield;outline:none;">
        <button class="btn-confirm-result" data-match-id="${m.id}"
          style="background:#D4FF3F;color:#0A0B1E;border:none;border-radius:8px;padding:6px 14px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;flex-shrink:0;">
          ${m.is_finished ? "ACTUALIZAR" : "GUARDAR"}
        </button>
        ${m.is_finished ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.22);letter-spacing:0.04em;">se recalculan puntajes</span>` : ""}
      </div>`;
  }

  return `
    <div>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:14px 18px;${hasBorder?'border-bottom:1px solid rgba(255,255,255,0.05);':''}">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;">
          ${chipByName(home,22,4)}
          <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:15px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(home)}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;">
          ${centerEl}
          <div style="display:flex;align-items:center;gap:5px;">${badge}${editBtn}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;min-width:0;">
          <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:15px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(away)}</span>
          ${chipByName(away,22,4)}
        </div>
      </div>
      ${adminPanel}
    </div>`;
}
