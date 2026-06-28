/* ── PREDICCIONES — 16vos de Final solamente ──────────────────────────── */

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

  el.innerHTML = `<div class="fl-page">
    <div style="position:absolute;top:-100px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,255,63,0.06),transparent 60%);pointer-events:none;"></div>
    ${flPageTitle('PREDICCIONES','MUNDIAL 2026')}
    <div id="pred-body"></div>
  </div>`;

  loadPredicciones(groups);
}

async function loadPredicciones(groups) {
  const body = document.getElementById("pred-body");
  if (body) body.innerHTML = flLoading('CARGANDO...');

  try {
    const [matches, allPreds] = await Promise.all([
      api.matches.list(),
      (async () => {
        const preds = [];
        for (const g of groups) {
          const gPreds = await api.predictions.list(g.id);
          preds.push(...gPreds);
        }
        return preds;
      })()
    ]);

    // Solo mostrar 16vos de final (Octavos), ordenados por fecha
    const octavosMatches = matches
      .filter(m => m.stage === "Octavos")
      .sort((a, b) => a.match_datetime.localeCompare(b.match_datetime));

    const predsByMatch = {};
    allPreds.forEach(p => { predsByMatch[p.match_id] = p; });

    if (!octavosMatches.length) {
      body.innerHTML = `<div style="text-align:center;padding:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.3);">No hay 16vos de final.</div>`;
      return;
    }

    // Construir filas de partidos
    const matchRows = octavosMatches.map(m => {
      const ex = predsByMatch[m.id];
      const hVal = ex != null ? ex.predicted_home_goals : "";
      const aVal = ex != null ? ex.predicted_away_goals : "";
      const savedBadge = ex != null
        ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#D4FF3F;letter-spacing:0.04em;">✓ ${ex.predicted_home_goals}—${ex.predicted_away_goals}</span>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.3);">sin predecir</span>`;
      const homeTeam = teamName(m.home_team);
      const awayTeam = teamName(m.away_team);

      return `
        <div class="match-pred-row" data-match-id="${m.id}" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:10px;border-radius:8px;">
          <!-- Columna izquierda: Fecha, Hora, País -->
          <div style="display:flex;flex-direction:column;gap:6px;">
            <!-- Fecha y Hora -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-family:'JetBrains Mono',monospace;font-size:8px;color:rgba(244,245,255,0.4);line-height:1.3;">
              <div>
                <div style="color:rgba(244,245,255,0.25);margin-bottom:1px;">Fecha</div>
                <div>${(m.match_datetime_str||'').split('—')[0].trim()}</div>
              </div>
              <div>
                <div style="color:rgba(244,245,255,0.25);margin-bottom:1px;">Hora</div>
                <div>${(m.match_datetime_str||'').split('—')[1]?.trim() || ''}</div>
              </div>
            </div>
            <!-- Países -->
            <div style="display:flex;align-items:center;gap:6px;">
              ${chipByName(homeTeam,18,2)}
              <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:10px;color:#F4F5FF;text-transform:uppercase;">${escHtml(homeTeam)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              ${chipByName(awayTeam,18,2)}
              <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:10px;color:#F4F5FF;text-transform:uppercase;">${escHtml(awayTeam)}</span>
            </div>
          </div>

          <!-- Columna derecha: Inputs -->
          <div style="display:flex;flex-direction:column;gap:6px;justify-content:space-between;">
            <!-- Inputs -->
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;">
              <input type="number" min="0" max="20" value="${String(hVal)}" id="ph-${m.id}"
                style="width:100%;height:36px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;-moz-appearance:textfield;outline:none;padding:0;"
                oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
              <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(244,245,255,0.25);text-align:center;">—</span>
              <input type="number" min="0" max="20" value="${String(aVal)}" id="pa-${m.id}"
                style="width:100%;height:36px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;-moz-appearance:textfield;outline:none;padding:0;"
                oninput="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.5)':'rgba(255,255,255,0.15)'" onfocus="this.style.borderColor='rgba(212,255,63,0.5)'" onblur="this.style.borderColor=this.value!==''?'rgba(212,255,63,0.35)':'rgba(255,255,255,0.15)'">
            </div>
            <!-- Status -->
            <div style="text-align:center;font-size:8px;color:rgba(244,245,255,0.2);">${savedBadge}</div>
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <div style="margin-bottom:20px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.4);letter-spacing:0.08em;margin-bottom:14px;">16VOS DE FINAL — ${octavosMatches.length} PARTIDOS</div>
        <div style="background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:8px;overflow:hidden;">
          ${matchRows}
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:28px;padding:0 16px 40px 16px;position:sticky;bottom:0;background:linear-gradient(to bottom,transparent,#0A0B1E 30%);z-index:10;">
        <button id="save-all-btn" style="flex:1;padding:14px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;transition:all 0.2s;box-shadow:0 -4px 12px rgba(0,0,0,0.3);">
          Guardar todas las predicciones
        </button>
      </div>
    `;

    body.innerHTML = html;

    // Botón de guardar
    const saveBtn = document.getElementById("save-all-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = "Guardando...";
        try {
          if (!groups || !groups.length) {
            throw new Error("No estás en ningún grupo. Debes unirte a un grupo primero.");
          }

          const groupId = groups[0].id;
          let savedCount = 0;

          for (const match of octavosMatches) {
            const hInput = document.getElementById(`ph-${match.id}`);
            const aInput = document.getElementById(`pa-${match.id}`);

            if (!hInput || !aInput) {
              console.warn(`Inputs no encontrados para match ${match.id}`);
              continue;
            }

            const hVal = parseInt(hInput.value, 10);
            const aVal = parseInt(aInput.value, 10);

            if (!isNaN(hVal) && !isNaN(aVal)) {
              await api.predictions.save({
                match_id: match.id,
                group_id: groupId,
                predicted_home_goals: hVal,
                predicted_away_goals: aVal
              });
              savedCount++;
            }
          }

          if (savedCount === 0) {
            throw new Error("No hay predicciones para guardar. Completa al menos un partido.");
          }

          saveBtn.textContent = `✓ Guardadas ${savedCount} predicciones!`;
          saveBtn.style.background = "rgba(212,255,63,0.3)";
          setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = "Guardar todas las predicciones";
            saveBtn.style.background = "#D4FF3F";
          }, 2000);
        } catch (e) {
          console.error("Error guardando:", e);
          showToast("Error: " + e.message);
          saveBtn.disabled = false;
          saveBtn.textContent = "Guardar todas las predicciones";
        }
      });
    }

  } catch (e) {
    if (body) body.innerHTML = `<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div>`;
  }
}
