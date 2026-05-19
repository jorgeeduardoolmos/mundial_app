/* ── RANKING ─────────────────────────────────────────────────────────── */
async function renderRanking(el) {
  el.innerHTML = `<div class="loading">Cargando ranking...</div>`;

  let groups;
  try {
    groups = await api.groups.list();
  } catch (e) {
    el.innerHTML = `<div class="empty"><p>Error: ${e.message}</p></div>`;
    return;
  }

  if (!groups.length) {
    el.innerHTML = `
      <div class="page-title">Ranking</div>
      <div class="empty" style="margin-top:16px;">
        <p>Todavía no pertenecés a ningún grupo.</p>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="page-title" style="margin-bottom:3px;">Ranking</div>
    <div class="page-sub">Mundial 2026</div>
    <div id="ranking-groups"></div>
  `;

  // CSS para expand/collapse
  if (!document.getElementById("ranking-style")) {
    const style = document.createElement("style");
    style.id = "ranking-style";
    style.textContent = `
      .ranking-group-card {
        background: #3a3560;
        border: 0.5px solid #4a4578;
        border-radius: 9px;
        overflow: hidden;
        margin-bottom: 12px;
        transition: border-color 0.15s;
      }
      .ranking-group-card.expanded { border-color: #F0C38E33; }
      .ranking-group-header {
        display: flex;
        align-items: center;
        padding: 14px 16px;
        cursor: pointer;
        gap: 12px;
        border-bottom: 0.5px solid transparent;
        transition: border-color 0.15s;
      }
      .ranking-group-card.expanded .ranking-group-header { border-bottom-color: #2a2548; }
      .ranking-group-header:hover .rg-name { color: #F0C38E; }
      .rg-name { font-size: 13px; font-weight: 500; color: #f5f0ff; flex: 1; transition: color 0.15s; }
      .rg-meta { font-size: 10px; color: #5a5488; }
      .rg-chevron { font-size: 14px; color: #5a5488; transition: transform 0.2s; }
      .ranking-group-card.expanded .rg-chevron { transform: rotate(180deg); color: #F0C38E; }
      .ranking-preview { padding: 0; }
      .ranking-full { display: none; }
      .ranking-group-card.expanded .ranking-preview { display: none; }
      .ranking-group-card.expanded .ranking-full { display: block; }
    `;
    document.head.appendChild(style);
  }

  const container = document.getElementById("ranking-groups");

  // Cargar todos los rankings en paralelo
  const rankingData = await Promise.allSettled(
    groups.map(g => api.ranking.get(g.id).then(data => ({ group: g, data })))
  );

  rankingData.forEach((result, idx) => {
    if (result.status === "rejected") return;
    const { group, data } = result.value;
    const session = getSession();
    const me = data.entries.find(e => e.user_id === session.user_id);
    const myPos = me ? me.position : null;
    const myPts = me ? me.total_pts : 0;

    const card = document.createElement("div");
    card.className = "ranking-group-card";
    card.dataset.groupId = group.id;

    // Preview: top 5
    const previewRows = data.entries.slice(0, 5).map(e => rankRow(e, session.user_id, true)).join("");
    // Full: todos
    const fullRows = data.entries.map(e => rankRow(e, session.user_id, false)).join("");

    const myPosBadge = myPos
      ? `<span style="font-size:10px;color:#F0C38E;background:#F0C38E10;padding:2px 8px;border-radius:3px;border:0.5px solid #F0C38E22;">${myPos === 1 ? "🥇" : myPos === 2 ? "🥈" : myPos === 3 ? "🥉" : "#"+myPos} · ${myPts} pts</span>`
      : "";

    card.innerHTML = `
      <div class="ranking-group-header">
        <div class="rg-name">${group.name}</div>
        ${myPosBadge}
        <span class="rg-meta">${data.entries.length} jugadores</span>
        <i class="ti ti-chevron-down rg-chevron" aria-hidden="true"></i>
      </div>
      <div class="ranking-preview">
        <div class="card" style="margin:0;border:none;border-radius:0;">
          ${previewRows}
          ${data.entries.length > 5 ? `<div style="padding:8px 16px;font-size:10px;color:#5a5488;text-align:center;">+ ${data.entries.length - 5} más — hacé click para ver todos</div>` : ""}
        </div>
      </div>
      <div class="ranking-full">
        <div class="card" style="margin:0;border:none;border-radius:0;">
          <div style="padding:10px 16px;border-bottom:0.5px solid #2a2548;display:flex;gap:16px;">
            <span style="font-size:10px;color:#5a5488;">⚽ ${data.matches_finished} partidos jugados</span>
            <span style="font-size:10px;color:#5a5488;">🎯 ${data.total_predictions} predicciones</span>
          </div>
          ${fullRows}
        </div>
      </div>
    `;

    // Toggle expand
    card.querySelector(".ranking-group-header").addEventListener("click", () => {
      const isExpanded = card.classList.contains("expanded");
      // Colapsar todos
      container.querySelectorAll(".ranking-group-card").forEach(c => c.classList.remove("expanded"));
      if (!isExpanded) card.classList.add("expanded");
    });

    container.appendChild(card);
  });
}

function rankRow(e, myId, compact) {
  const isMe = e.user_id === myId;
  const medal = e.position === 1 ? "🥇" : e.position === 2 ? "🥈" : e.position === 3 ? "🥉" : null;
  const pos = medal
    ? `<div style="font-size:${compact ? "14px" : "16px"};width:24px;text-align:center;flex-shrink:0;">${medal}</div>`
    : `<div style="font-size:11px;color:#5a5488;width:24px;text-align:center;flex-shrink:0;">#${e.position}</div>`;

  const initials = getInitials(e.display_name);
  const avatarStyle = isMe
    ? "background:#F0C38E15;color:#F0C38E;"
    : e.position > 3 ? "background:#2a2548;color:#544f80;" : "background:#4a4578;color:#4d6d82;";

  const nameColor = isMe ? "#f5f0ff" : e.position > 3 ? "#333" : "#888";
  const ptsColor = isMe ? "#F0C38E" : e.position > 3 ? "#5a5488" : "#555";

  const detail = compact
    ? ""
    : `<div style="font-size:10px;color:#5a5488;margin-top:1px;">${e.played} pred · ${e.exact_scores} exactos · ${e.pending} pend.</div>`;

  return `
    <div style="display:flex;align-items:center;padding:${compact ? "9px" : "11px"} 16px;border-bottom:0.5px solid #2a2548;gap:10px;${isMe ? "background:#F0C38E07;" : ""}">
      &nbsp;&nbsp;${pos}
      <div style="width:${compact ? "26px" : "28px"};height:${compact ? "26px" : "28px"};border-radius:50%;${avatarStyle}display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500;flex-shrink:0;">${initials}</div>
      <div style="flex:1;">
        <div style="font-size:${compact ? "12px" : "13px"};font-weight:500;color:${nameColor};">
          ${e.display_name}${isMe ? '<span style="font-size:9px;background:#F0C38E15;color:#F0C38E;padding:1px 6px;border-radius:3px;margin-left:5px;">vos</span>' : ""}
        </div>
        ${detail}
      </div>
      <div style="font-size:${compact ? "13px" : "14px"};font-weight:500;color:${ptsColor};">${e.total_pts} <span style="font-size:9px;color:#5a5488;font-weight:400;">pts</span></div>
    </div>`;
}
