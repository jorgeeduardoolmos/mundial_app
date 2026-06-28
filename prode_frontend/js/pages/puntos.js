/* ── PUNTOS — Análisis de desempeño por jugador ────────────────────────── */

async function renderPuntos(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  try {
    const [groups, matches] = await Promise.all([
      api.groups.list(),
      api.matches.list(),
    ]);

    if (!groups.length) {
      el.innerHTML = `<div class="fl-page">
        ${flPageTitle('PUNTOS','MUNDIAL 2026')}
        <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:48px;text-align:center;">
          <div style="font-size:32px;margin-bottom:16px;">⚽</div>
          <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">Todavía no estás en ningún grupo</div>
          <div style="font-size:14px;color:rgba(244,245,255,0.62);margin-bottom:24px;">Sumate a un grupo para ver desempeños.</div>
          <button onclick="navigate('grupos')" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;padding:14px 28px;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;">Ir a Grupos →</button>
        </div>
      </div>`;
      return;
    }

    const selectedGroup = groups[0];
    el.innerHTML = `<div class="fl-page">
      <div style="position:absolute;top:-100px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,255,63,0.06),transparent 60%);pointer-events:none;"></div>
      ${flPageTitle('PUNTOS','MUNDIAL 2026')}
      <div style="margin-bottom:24px;">
        <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.5);letter-spacing:0.08em;display:block;margin-bottom:8px;">ELEGIR JUGADOR</label>
        <select id="player-select" style="width:100%;background:#14172E;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:12px;font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:15px;color:#F4F5FF;cursor:pointer;">
          <option value="">Selecciona un jugador...</option>
        </select>
      </div>
      <div id="puntos-body" style="display:none;">
        <div style="margin-bottom:20px;padding:16px;background:rgba(212,255,63,0.06);border:1px solid rgba(212,255,63,0.15);border-radius:10px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.5);letter-spacing:0.08em;margin-bottom:4px;">TOTAL DE PUNTOS</div>
          <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:32px;color:#D4FF3F;" id="total-pts">0</div>
        </div>
        <div id="puntos-table"></div>
      </div>
    </div>`;

    const groupMembers = await api.groups.members(selectedGroup.id);
    const select = document.getElementById('player-select');

    groupMembers.forEach(m => {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = m.display_name;
      select.appendChild(option);
    });

    select.addEventListener('change', async () => {
      if (!select.value) {
        document.getElementById('puntos-body').style.display = 'none';
        return;
      }

      const playerId = parseInt(select.value);
      const playerName = select.options[select.selectedIndex].text;
      await loadPlayerStats(playerId, playerName, selectedGroup.id, matches);
    });

  } catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('PUNTOS','MUNDIAL 2026')}<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div></div>`;
  }
}

async function loadPlayerStats(playerId, playerName, groupId, allMatches) {
  const body = document.getElementById('puntos-body');
  body.style.display = 'block';

  try {
    console.log(`Cargando predicciones para jugador ${playerId} en grupo ${groupId}`);
    // Obtener predicciones del jugador para cada partido
    const playerPreds = {};

    for (const m of allMatches) {
      try {
        const matchPreds = await api.predictions.forMatch(m.id, groupId);
        console.log(`Partido ${m.id}: ${matchPreds?.length || 0} predicciones`);
        const playerPred = matchPreds.find(p => p.user_id === playerId);
        if (playerPred) {
          console.log(`  Encontrada predicción para jugador ${playerId}`);
          playerPreds[m.id] = playerPred;
        }
      } catch (e) {
        console.error(`Error cargando predicciones del partido ${m.id}:`, e.message);
      }
    }

    console.log(`Total de predicciones cargadas: ${Object.keys(playerPreds).length}`);

    // Mostrar TODOS los partidos del mundial
    const matchesWithPreds = allMatches
      .map(m => ({
        match: m,
        pred: playerPreds[m.id]
      }))
      .filter(item => item.pred) // Solo mostrar partidos donde hizo predicción
      .sort((a, b) => new Date(b.match.match_datetime) - new Date(a.match.match_datetime)); // Más nuevo a más viejo

    // Calcular total de puntos (solo de partidos finalizados)
    let totalPts = 0;
    matchesWithPreds.forEach(item => {
      if (item.match.is_finished && item.pred.points_earned !== null) {
        totalPts += item.pred.points_earned;
      }
    });

    document.getElementById('total-pts').textContent = totalPts;

    // Generar tabla o mensaje vacío
    let tableHtml = '';

    if (matchesWithPreds.length === 0) {
      tableHtml = `<div style="padding:48px 20px;text-align:center;color:rgba(244,245,255,0.4);">
        <div style="font-size:32px;margin-bottom:12px;">⚽</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.04em;">
          Sin predicciones en partidos jugados aún
        </div>
      </div>`;
    } else {
      tableHtml = `
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:11px;">
            <thead style="border-bottom:1px solid rgba(255,255,255,0.12);">
              <tr style="color:rgba(244,245,255,0.4);">
                <th style="padding:12px 0;text-align:left;letter-spacing:0.06em;font-weight:600;">PARTIDO</th>
                <th style="padding:12px 0;text-align:center;letter-spacing:0.06em;font-weight:600;">PREDICCIÓN</th>
                <th style="padding:12px 0;text-align:center;letter-spacing:0.06em;font-weight:600;">RESULTADO</th>
                <th style="padding:12px 0;text-align:center;letter-spacing:0.06em;font-weight:600;">PTS</th>
              </tr>
            </thead>
            <tbody>
              ${matchesWithPreds.map(item => {
                const m = item.match;
                const p = item.pred;
                const pts = (m.is_finished && p.points_earned !== null) ? p.points_earned : 0;
                const ptsColor = pts >= 6 ? '#D4FF3F' : pts > 0 ? 'rgba(212,255,63,0.6)' : 'rgba(244,245,255,0.2)';
                const resultDisplay = m.is_finished
                  ? `${m.home_goals}–${m.away_goals}`
                  : '–';
                const ptsDisplay = m.is_finished
                  ? `${pts}`
                  : '–';

                return `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:#F4F5FF;">
                    <td style="padding:12px 0;text-align:left;">
                      <div style="font-weight:700;margin-bottom:2px;">${escHtml(m.home_team)} vs ${escHtml(m.away_team)}</div>
                      <div style="color:rgba(244,245,255,0.4);font-size:9px;">${m.stage}</div>
                    </td>
                    <td style="padding:12px 0;text-align:center;font-weight:700;">${p.predicted_home_goals}–${p.predicted_away_goals}</td>
                    <td style="padding:12px 0;text-align:center;font-weight:700;color:#D4FF3F;">${resultDisplay}</td>
                    <td style="padding:12px 0;text-align:center;font-weight:700;color:${ptsColor};">${ptsDisplay}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    document.getElementById('puntos-table').innerHTML = tableHtml;

  } catch (e) {
    document.getElementById('puntos-body').innerHTML = `<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div>`;
  }
}
