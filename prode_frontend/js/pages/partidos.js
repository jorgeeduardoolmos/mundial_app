/* ── PARTIDOS — Floodlight ───────────────────────────────────────────── */

async function renderPartidos(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  try {
    const [stages, matches, groups] = await Promise.all([
      api.matches.stages(),
      api.matches.list(),
      api.groups.list(),
    ]);

    // Solo mostrar partidos finalizados
    const finishedMatches = matches.filter(m => m.is_finished);

    // Obtener todas mis predicciones de todos los grupos
    const allMyPreds = {};
    for (const group of groups) {
      const preds = await api.predictions.list(group.id);
      preds.forEach(p => {
        if (!allMyPreds[p.match_id]) {
          allMyPreds[p.match_id] = p;
        }
      });
    }

    const tabsHtml = ["Todas", ...stages].map((s, i) =>
      `<button class="fl-tab ${i===0?'active':''}" data-stage="${escHtml(s)}" style="white-space:nowrap;">${escHtml(s)}</button>`
    ).join("");

    // Obtener miembros del primer grupo para la tabla de comparación
    let groupMembers = [];
    let selectedGroup = null;
    if (groups.length > 0) {
      selectedGroup = groups[0];
      groupMembers = await api.groups.members(selectedGroup.id);
    }

    el.innerHTML = `<div class="fl-page">
      <div style="position:absolute;top:-100px;left:-200px;width:500px;height:500px;background:radial-gradient(circle,rgba(59,91,255,0.07),transparent 60%);pointer-events:none;"></div>
      ${flPageTitle('PARTIDOS','MUNDIAL 2026')}
      <div id="stage-tabs-p" style="display:flex;gap:6px;align-items:center;flex-wrap:nowrap;overflow-x:auto;margin-bottom:28px;padding-bottom:4px;scrollbar-width:none;-webkit-overflow-scrolling:touch;">
        ${tabsHtml}
      </div>
      <div id="matches-body"></div>
    </div>`;

    window._allMatches = finishedMatches;
    window._allMyPreds = allMyPreds;
    window._groupMembers = groupMembers;
    window._selectedGroup = selectedGroup;
    window._allMatchesData = matches;

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
  let matches = stageFilter === "Todas"
    ? window._allMatches
    : window._allMatches.filter(m => m.stage === stageFilter);

  // Ordenar cronológicamente
  matches = matches.slice().sort((a, b) => a.match_datetime.localeCompare(b.match_datetime));

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
        ${group.map((m, i) => matchRow(m, i < group.length - 1)).join("")}
      </div>`;
  }

  if (!html) html = `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay partidos en esta fase.</div>`;

  // Agregar tabla de comparación
  const tableHtml = renderComparisonTable(matches, stageFilter);

  body.innerHTML = html + (tableHtml || '');
}

function matchRow(m, hasBorder) {
  const home = typeof teamName === "function" ? teamName(m.home_team) : m.home_team;
  const away = typeof teamName === "function" ? teamName(m.away_team) : m.away_team;
  const pred = window._allMyPreds[m.id];

  // Calcular puntos
  let pts = 0;
  if (pred && m.home_goals !== null && m.away_goals !== null) {
    if (pred.predicted_home_goals === m.home_goals) pts += 2;
    if (pred.predicted_away_goals === m.away_goals) pts += 2;
    const predResult = pred.predicted_home_goals > pred.predicted_away_goals ? "home"
                     : pred.predicted_away_goals > pred.predicted_home_goals ? "away" : "draw";
    const realResult = m.home_goals > m.away_goals ? "home"
                     : m.away_goals > m.home_goals ? "away" : "draw";
    if (predResult === realResult) pts += 4;
  }

  // Mostrar pronóstico vs resultado
  const predDisplay = pred
    ? `<div style="text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.4);letter-spacing:0.06em;margin-bottom:2px;">mi pronóstico</div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:14px;color:rgba(212,255,63,0.9);">${pred.predicted_home_goals}—${pred.predicted_away_goals}</div>
      </div>`
    : `<div style="text-align:center;font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.2);">sin predecir</div>`;

  const resultDisplay = `<div style="text-align:center;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.4);letter-spacing:0.06em;margin-bottom:2px;">resultado</div>
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:16px;color:#F4F5FF;">${m.home_goals}—${m.away_goals}</div>
  </div>`;

  const pointsDisplay = `<div style="text-align:center;background:rgba(212,255,63,0.08);border:1px solid rgba(212,255,63,0.25);border-radius:8px;padding:6px 12px;min-width:50px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:8px;color:rgba(212,255,63,0.6);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:2px;">pts</div>
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:18px;color:#D4FF3F;">${pts}</div>
  </div>`;

  return `
    <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;${hasBorder?'border-bottom:1px solid rgba(255,255,255,0.05);':''}">
      <div style="flex:1;display:flex;align-items:center;gap:8px;min-width:0;">
        ${chipByName(home,20,4)}
        <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:14px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(home)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
        ${predDisplay}
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.2);">vs</div>
        ${resultDisplay}
        <div style="width:1px;height:40px;background:rgba(255,255,255,0.08);"></div>
        ${pointsDisplay}
      </div>
      <div style="flex:1;display:flex;align-items:center;gap:8px;justify-content:flex-end;min-width:0;">
        <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:14px;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(away)}</span>
        ${chipByName(away,20,4)}
      </div>
    </div>`;
}

/* ── Tabla de comparación de predicciones ──────────────────────────────── */
async function renderComparisonTable(matches, stageFilter) {
  if (!window._selectedGroup) return '';

  const group = window._selectedGroup;
  const members = window._groupMembers || [];
  if (!members.length) return '';

  // Filtrar partidos según etapa
  let filteredMatches = matches.filter(m => m.is_finished);
  if (stageFilter !== "Todas") {
    filteredMatches = filteredMatches.filter(m => m.stage === stageFilter);
  }

  // Obtener predicciones de todos los jugadores para todos los partidos
  const allPredsByMatch = {};
  for (const match of filteredMatches) {
    try {
      const preds = await api.predictions.forMatch(match.id, group.id);
      allPredsByMatch[match.id] = preds;
    } catch (e) {
      allPredsByMatch[match.id] = [];
    }
  }

  // Construir tabla
  const headerCells = [
    `<th style="padding:12px 16px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.4);letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);min-width:180px;">PARTIDO</th>`,
    `<th style="padding:12px 16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.4);letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);width:70px;">RESULTADO</th>`,
  ];

  // Agregar una columna por cada miembro
  members.forEach(m => {
    headerCells.push(`<th style="padding:12px 16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#D4FF3F;letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);min-width:80px;">${escHtml(m.display_name.split(' ')[0].toUpperCase())}</th>`);
  });

  // Construir filas de partidos
  const rows = filteredMatches.slice().sort((a, b) => a.match_datetime.localeCompare(b.match_datetime)).map(m => {
    const preds = allPredsByMatch[m.id] || [];
    const resultCell = `<td style="padding:10px 16px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;color:#D4FF3F;border-bottom:1px solid rgba(255,255,255,0.05);">${m.home_goals}—${m.away_goals}</td>`;

    const matchCell = `<td style="padding:10px 16px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.7);border-bottom:1px solid rgba(255,255,255,0.05);">
      <div style="font-weight:600;margin-bottom:3px;">${escHtml(m.home_team)} vs ${escHtml(m.away_team)}</div>
      <div style="font-size:8px;color:rgba(244,245,255,0.4);">${m.stage}</div>
    </td>`;

    let memberCells = '';
    members.forEach(member => {
      const pred = preds.find(p => p.user_id === member.user_id);
      let cellContent = '—';
      let cellColor = 'rgba(244,245,255,0.3)';

      if (pred && pred.predicted_home_goals !== null) {
        let pts = 0;
        if (m.home_goals !== null && m.away_goals !== null) {
          if (pred.predicted_home_goals === m.home_goals) pts += 2;
          if (pred.predicted_away_goals === m.away_goals) pts += 2;
          const predResult = pred.predicted_home_goals > pred.predicted_away_goals ? "home" : pred.predicted_away_goals > pred.predicted_home_goals ? "away" : "draw";
          const realResult = m.home_goals > m.away_goals ? "home" : m.away_goals > m.home_goals ? "away" : "draw";
          if (predResult === realResult) pts += 4;
        }
        cellColor = pts >= 6 ? '#D4FF3F' : pts > 0 ? 'rgba(212,255,63,0.6)' : 'rgba(244,245,255,0.4)';
        cellContent = `<div style="font-weight:600;color:#F4F5FF;">${pred.predicted_home_goals}—${pred.predicted_away_goals}</div><div style="font-size:8px;color:${cellColor};font-weight:700;">${pts} pts</div>`;
      }

      memberCells += `<td style="padding:10px 16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;border-bottom:1px solid rgba(255,255,255,0.05);">${cellContent}</td>`;
    });

    return `<tr style="hover:{background:rgba(255,255,255,0.01);}">${matchCell}${resultCell}${memberCells}</tr>`;
  }).join('');

  const table = `
    <div style="margin-top:48px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#D4FF3F;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px;">
        <span>Tabla de comparación — ${group.name}</span>
        <div style="flex:1;height:1px;background:rgba(212,255,63,0.2);"></div>
      </div>
      <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr>${headerCells.join('')}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return table;
}
