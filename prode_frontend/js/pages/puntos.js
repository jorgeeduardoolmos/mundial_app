/* ── PUNTOS — Tabla de Zonas de Grupos ────────────────────────────────────── */

async function renderPuntos(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  try {
    const result = await api.puntos.zonasGrupos();
    if (!result.success) {
      throw new Error(result.error || "Error cargando datos");
    }

    const data = result.data || [];
    if (!data.length) {
      el.innerHTML = `<div class="fl-page">
        ${flPageTitle('PUNTOS','MUNDIAL 2026')}
        <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:48px;text-align:center;">
          <div style="font-size:32px;margin-bottom:16px;">📊</div>
          <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">Sin datos</div>
          <div style="font-size:14px;color:rgba(244,245,255,0.62);">No hay información disponible en la solapa de puntos.</div>
        </div>
      </div>`;
      return;
    }

    const html = buildPuntosTable(data);
    el.innerHTML = `<div class="fl-page">${html}</div>`;
  } catch (e) {
    console.error("Error renderPuntos:", e);
    el.innerHTML = `<div class="fl-page">
      ${flPageTitle('PUNTOS','MUNDIAL 2026')}
      <div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:32px;text-align:center;">
        ${escHtml(e.message)}
      </div>
    </div>`;
  }
}

function buildPuntosTable(data) {
  // Extraer headers de la primera fila
  const headerRow = data[0] || {};
  const headers = Object.keys(headerRow);

  if (!headers.length) {
    return flPageTitle('PUNTOS','MUNDIAL 2026') + '<div style="color:#FF5C4D;padding:32px;text-align:center;">No se pudo leer la tabla.</div>';
  }

  // Generar header HTML
  const headerHtml = headers.map(h =>
    `<th style="padding:12px 16px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.55);letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(212,255,63,0.2);background:rgba(212,255,63,0.05);">
      ${escHtml(h)}
    </th>`
  ).join('');

  // Generar filas
  const bodyHtml = data.map((row, idx) => {
    const cells = headers.map(h => {
      const val = row[h] || '';
      return `<td style="padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#F4F5FF;border-bottom:1px solid rgba(255,255,255,0.05);${idx % 2 === 1 ? 'background:rgba(255,255,255,0.01);' : ''}">
        ${escHtml(String(val))}
      </td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    ${flPageTitle('PUNTOS','MUNDIAL 2026')}
    <div style="position:absolute;top:-100px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,255,63,0.06),transparent 60%);pointer-events:none;"></div>
    <div style="background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.05);border-radius:8px;overflow:hidden;margin-bottom:32px;overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>${headerHtml}</thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
    <div style="padding:0 16px 40px;color:rgba(244,245,255,0.3);font-family:'JetBrains Mono',monospace;font-size:10px;text-align:center;">
      Datos actualizados automáticamente
    </div>
  `;
}
