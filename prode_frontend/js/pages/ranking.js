/* ── RANKING — Floodlight ───────────────────────────────────────────────── */

function flLoading(msg) {
  return `<div style="display:flex;align-items:center;justify-content:center;min-height:40vh;font-family:'JetBrains Mono',monospace;color:rgba(244,245,255,0.3);font-size:12px;letter-spacing:0.14em;">${msg||'CARGANDO...'}</div>`;
}

function flPageTitle(title, eyebrow) {
  return `<div style="margin-bottom:36px;">
    ${eyebrow?`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:rgba(244,245,255,0.38);letter-spacing:0.16em;margin-bottom:12px;display:flex;align-items:center;gap:10px;"><span style="display:inline-block;width:20px;height:1px;background:rgba(244,245,255,0.38);flex-shrink:0;"></span>${eyebrow}</div>`:''}
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:72px;line-height:0.86;color:#F4F5FF;text-transform:uppercase;letter-spacing:-0.005em;">${title}</div>
  </div>`;
}

async function renderRanking(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  let groups;
  try {
    groups = await api.groups.list();
  } catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('RANKING','MUNDIAL 2026')}<div style="padding:32px;text-align:center;color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;">${escHtml(e.message)}</div></div>`;
    return;
  }

  if (!groups.length) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('RANKING','MUNDIAL 2026')}
      <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:48px;text-align:center;">
        <div style="font-size:32px;margin-bottom:16px;">🏆</div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">Todavía no estás en ningún grupo</div>
        <div style="font-size:14px;color:rgba(244,245,255,0.62);margin-bottom:24px;">Sumate a un grupo para ver el ranking.</div>
        <button onclick="navigate('grupos')" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;padding:14px 28px;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;">Ir a Grupos →</button>
      </div>
    </div>`;
    return;
  }

  const session = getSession();
  const rankingResults = await Promise.allSettled(
    groups.map(g => api.ranking.get(g.id).then(data => ({ group: g, data })))
  );

  let groupsHTML = '';
  rankingResults.forEach((res, idx) => {
    if (res.status === 'rejected') return;
    const { group, data } = res.value;
    const me = data.entries.find(e => e.user_id === session.user_id);
    groupsHTML += flRankGroupCard(group, data, me, idx);
  });

  el.innerHTML = `<div class="fl-page">
    <div style="position:absolute;top:-100px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,255,63,0.08),transparent 60%);pointer-events:none;"></div>
    ${flPageTitle('RANKING','MUNDIAL 2026')}
    <div id="fl-ranking-list" style="display:flex;flex-direction:column;gap:16px;">${groupsHTML}</div>
  </div>`;

  document.querySelectorAll('.fl-group-hdr').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const body = hdr.nextElementSibling;
      const chevron = hdr.querySelector('.fl-chevron');
      const isOpen = body.classList.contains('open');
      // Collapse all
      document.querySelectorAll('.fl-collapse-body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.fl-chevron').forEach(c => { c.style.transform=''; c.style.color='rgba(244,245,255,0.38)'; });
      if (!isOpen) {
        body.classList.add('open');
        chevron.style.transform = 'rotate(180deg)';
        chevron.style.color = '#D4FF3F';
      }
    });
  });
}

function flRankGroupCard(group, data, me, idx) {
  const n = data.entries.length;
  const myPos = me?.position ?? null;
  const myPts = me?.total_pts ?? 0;

  const posBadge = myPos
    ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D4FF3F;background:rgba(212,255,63,0.10);padding:3px 9px;border-radius:5px;border:1px solid rgba(212,255,63,0.25);letter-spacing:0.08em;">${myPos===1?'🥇 ':''}#${myPos} · ${myPts} PTS</span>`
    : '';

  // auto-open first group
  const autoOpen = idx === 0;

  const previewRows = data.entries.slice(0,5).map((e,i)=>rankRowHTML(e,i,e.user_id===getSession().user_id)).join('');
  const fullStats = `<div style="padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;gap:20px;flex-wrap:wrap;">
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;">⚽ ${data.matches_finished} partidos jugados</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;">🎯 ${data.total_predictions} predicciones</span>
  </div>`;
  const fullRows = data.entries.map((e,i)=>rankRowHTML(e,i,e.user_id===getSession().user_id)).join('');
  const moreHint = n > 5 && !autoOpen
    ? `<div style="padding:10px 20px;font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);text-align:center;letter-spacing:0.08em;">+ ${n-5} jugadores más — click para ver todos</div>`
    : '';

  return `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;">
    <div class="fl-group-hdr" style="display:flex;align-items:center;padding:18px 22px;gap:14px;">
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;letter-spacing:0.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(group.name)}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.10em;margin-top:3px;">${n} JUGADORES</div>
      </div>
      ${posBadge}
      <svg class="fl-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(244,245,255,0.38)" stroke-width="2" stroke-linecap="round" style="flex-shrink:0;transition:transform 0.2s,stroke 0.2s;"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="fl-collapse-body${autoOpen?' open':''}">
      ${autoOpen ? fullStats+fullRows : `<div class="preview-rows">${previewRows}${moreHint}</div>`}
    </div>
  </div>`;
}
