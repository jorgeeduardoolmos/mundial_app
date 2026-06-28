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
      <div id="matches-body"></div>
    </div>`;

    window._allMatches = finishedMatches;
    window._allMyPreds = allMyPreds;
    window._groupMembers = groupMembers;
    window._selectedGroup = selectedGroup;
    window._allMatchesData = matches;

    renderComparisonTable(matches, groupMembers, selectedGroup);

  } catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('PARTIDOS','MUNDIAL 2026')}<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div></div>`;
  }
}


/* ── Tabla de comparación de predicciones ──────────────────────────────── */
async function renderComparisonTable(matches, groupMembers, selectedGroup) {
  const body = document.getElementById("matches-body");
  if (!selectedGroup || !groupMembers.length) {
    body.innerHTML = `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay grupo seleccionado.</div>`;
    return;
  }

  const group = selectedGroup;
  const members = groupMembers;

  // Obtener todos los partidos finalizados
  let filteredMatches = matches.filter(m => m.is_finished).slice().sort((a, b) => a.match_datetime.localeCompare(b.match_datetime));

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
    `<th style="padding:12px 16px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.4);letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);min-width:200px;">PARTIDO</th>`,
    `<th style="padding:12px 16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.4);letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);width:80px;">RESULTADO</th>`,
  ];

  // Agregar una columna por cada miembro
  members.forEach(m => {
    headerCells.push(`<th style="padding:12px 16px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#D4FF3F;letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.12);min-width:90px;">${escHtml(m.display_name.split(' ')[0].toUpperCase())}</th>`);
  });

  // Construir filas de partidos
  const rows = filteredMatches.map(m => {
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
    <div style="padding:40px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#D4FF3F;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
        <span>Comparación de predicciones — ${group.name}</span>
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

  body.innerHTML = table;
}
