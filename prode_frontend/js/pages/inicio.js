/* ── INICIO — Floodlight Design ─────────────────────────────────────────── */

function injectFloodlightStyles() {
  if (!document.getElementById('fl-fonts')) {
    const l = document.createElement('link');
    l.id = 'fl-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap';
    document.head.appendChild(l);
  }
  if (document.getElementById('fl-styles')) return;
  const s = document.createElement('style');
  s.id = 'fl-styles';
  s.textContent = `
    .fl-dashboard {
      margin: -36px -48px;
      background: #0A0B1E;
      color: #F4F5FF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      position: relative;
      overflow: hidden;
    }
    @media (max-width: 768px) {
      .fl-dashboard { margin: -16px -16px -88px; }
    }
    @keyframes flPulse {
      0%   { box-shadow: 0 0 0 0 rgba(255,92,77,0.7); }
      70%  { box-shadow: 0 0 0 8px rgba(255,92,77,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,92,77,0); }
    }
    @keyframes flTicker {
      from { transform: translateX(0); }
      to   { transform: translateX(-33.333%); }
    }
    @keyframes flBump {
      0%   { transform: scale(1.15); color: #D4FF3F; }
      100% { transform: scale(1); color: #F4F5FF; }
    }
    .fl-live-dot {
      display:inline-block; width:8px; height:8px; border-radius:50%;
      background:#FF5C4D; animation:flPulse 1.4s ease-out infinite; flex-shrink:0;
    }
    .fl-score-btn {
      border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.06);
      color:#D4FF3F; cursor:pointer; display:grid; place-items:center;
      font-family:'Big Shoulders Display',system-ui; font-weight:800;
      transition:background 120ms; border-radius:50%; line-height:1;
    }
    .fl-score-btn:hover { background:rgba(212,255,63,0.18); }
    .fl-score-btn:focus-visible { outline:2px solid #D4FF3F; outline-offset:2px; }
    .fl-score-num {
      font-family:'Big Shoulders Display',system-ui; font-weight:900;
      font-variant-numeric:tabular-nums; text-align:center; color:#F4F5FF; line-height:0.85;
    }
    .fl-score-num.bumped { animation:flBump 200ms ease-out; }
    .fl-save-btn {
      width:100%; border-radius:12px; cursor:pointer;
      font-family:'Big Shoulders Display',system-ui; font-weight:800;
      letter-spacing:0.04em; text-transform:uppercase;
      transition:all 200ms; display:flex; align-items:center; justify-content:center;
      border:none;
    }
    .fl-ticker-wrap {
      border-top:1px solid rgba(255,255,255,0.08);
      border-bottom:1px solid rgba(255,255,255,0.08);
      background:rgba(212,255,63,0.03);
      overflow:hidden;
      -webkit-mask-image:linear-gradient(90deg,transparent,#000 40px,#000 calc(100% - 40px),transparent);
      mask-image:linear-gradient(90deg,transparent,#000 40px,#000 calc(100% - 40px),transparent);
    }
    .fl-ticker-inner {
      display:flex; gap:28px; padding:10px 0;
      animation:flTicker linear infinite; width:max-content;
    }
    .fl-match-row { transition:background 150ms; cursor:pointer; }
    .fl-match-row:hover { background:rgba(255,255,255,0.025); }
    .fl-rank-row { transition:background 150ms; }
    .fl-group-row { transition:background 150ms; }
    .fl-group-row:hover { background:rgba(255,255,255,0.025); }

    /* ── Shared page styles ── */
    .fl-page {
      margin:-36px -48px; background:#0A0B1E; color:#F4F5FF;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
      padding:48px 40px 60px; min-height:calc(100vh - 60px); position:relative;
    }
    @media (max-width:768px) {
      .fl-page { margin:-16px -16px -88px; padding:24px 20px 32px; }
    }
    .fl-tab {
      background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:6px;
      padding:6px 14px; font-family:'JetBrains Mono',monospace; font-size:11px;
      font-weight:600; color:rgba(244,245,255,0.62); cursor:pointer;
      letter-spacing:0.08em; transition:all 150ms; white-space:nowrap;
    }
    .fl-tab:hover { border-color:rgba(255,255,255,0.20); color:#F4F5FF; }
    .fl-tab.active { background:rgba(212,255,63,0.10); border-color:rgba(212,255,63,0.35); color:#D4FF3F; }
    .fl-input {
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
      border-radius:8px; color:#F4F5FF; font-family:'Big Shoulders Display',system-ui;
      font-weight:800; font-size:20px; text-align:center; outline:none; transition:border-color 150ms;
    }
    .fl-input:focus { border-color:#D4FF3F; box-shadow:0 0 0 2px rgba(212,255,63,0.15); }
    .fl-input::-webkit-outer-spin-button,.fl-input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
    .fl-input[type=number] { -moz-appearance:textfield; }
    .fl-collapse-body { display:none; }
    .fl-collapse-body.open { display:block; }
    .fl-group-hdr { cursor:pointer; transition:background 150ms; }
    .fl-group-hdr:hover { background:rgba(255,255,255,0.025); }
    .fl-admin-panel { display:none; padding:14px 20px; border-top:1px solid rgba(255,255,255,0.08); align-items:center; gap:10px; flex-wrap:wrap; }
    .fl-admin-panel.visible { display:flex; }
    .fl-hero {
      padding:44px 40px 32px;
      display:grid; grid-template-columns:1fr 480px;
      gap:40px; align-items:end;
      position:relative; z-index:1;
    }
    .fl-main-grid {
      display:grid; grid-template-columns:1fr 440px;
      gap:28px; padding:36px 40px 60px;
      position:relative; z-index:1;
    }
    @media (max-width: 960px) {
      .fl-hero { grid-template-columns:1fr; padding:28px 20px 20px; gap:20px; }
      .fl-hero-h1 { font-size:64px !important; line-height:0.88 !important; }
      .fl-hero-sub { font-size:15px !important; }
      .fl-main-grid { grid-template-columns:1fr; padding:20px 20px 32px; }
      .fl-footer { padding:16px 20px !important; flex-direction:column !important; gap:4px !important; text-align:center !important; }
    }
    @media (max-width: 600px) {
      #fl-predictor-grid { grid-template-columns:1fr !important; padding:0 18px 20px !important; }
      .fl-team-name-lg { font-size:22px !important; }
      .fl-team-chip-lg { width:56px !important; height:56px !important; }
      .fl-chip-code-lg { font-size:20px !important; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Team map (Spanish backend names → ISO 3166-1 alpha-2 for flagcdn.com) ── */
const FL_TEAMS = {
  // CONMEBOL
  'Argentina':      {code:'ARG',iso:'ar',  c1:'#7BB4FF',c2:'#F4F5FF'},
  'Brasil':         {code:'BRA',iso:'br',  c1:'#00C46B',c2:'#FFD23F'},
  'Uruguay':        {code:'URU',iso:'uy',  c1:'#7BB4FF',c2:'#1F2330'},
  'Colombia':       {code:'COL',iso:'co',  c1:'#FFD23F',c2:'#3B5BFF'},
  'Paraguay':       {code:'PAR',iso:'py',  c1:'#FF5C4D',c2:'#3B5BFF'},
  'Chile':          {code:'CHI',iso:'cl',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Ecuador':        {code:'ECU',iso:'ec',  c1:'#FFD23F',c2:'#3B5BFF'},
  'Perú':           {code:'PER',iso:'pe',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Bolivia':        {code:'BOL',iso:'bo',  c1:'#FF5C4D',c2:'#FFD23F'},
  // UEFA
  'Francia':        {code:'FRA',iso:'fr',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'España':         {code:'ESP',iso:'es',  c1:'#FF5C4D',c2:'#FFD23F'},
  'Inglaterra':     {code:'ING',iso:'gb-eng',c1:'#F4F5FF',c2:'#FF5C4D'},
  'Alemania':       {code:'ALE',iso:'de',  c1:'#1F2330',c2:'#FFD23F'},
  'Portugal':       {code:'POR',iso:'pt',  c1:'#00C46B',c2:'#FF5C4D'},
  'Italia':         {code:'ITA',iso:'it',  c1:'#3B5BFF',c2:'#F4F5FF'},
  'Países Bajos':   {code:'NED',iso:'nl',  c1:'#FF7A1A',c2:'#3B5BFF'},
  'Bélgica':        {code:'BEL',iso:'be',  c1:'#1F2330',c2:'#FFD23F'},
  'Croacia':        {code:'CRO',iso:'hr',  c1:'#FF5C4D',c2:'#3B5BFF'},
  'Dinamarca':      {code:'DIN',iso:'dk',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Suiza':          {code:'SUI',iso:'ch',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Austria':        {code:'AUT',iso:'at',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Polonia':        {code:'POL',iso:'pl',  c1:'#F4F5FF',c2:'#FF5C4D'},
  'Turquía':        {code:'TUR',iso:'tr',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Türkiye':        {code:'TUR',iso:'tr',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Ucrania':        {code:'UCR',iso:'ua',  c1:'#3B5BFF',c2:'#FFD23F'},
  'Escocia':        {code:'ESC',iso:'gb-sct',c1:'#3B5BFF',c2:'#F4F5FF'},
  'Noruega':        {code:'NOR',iso:'no',  c1:'#FF5C4D',c2:'#3B5BFF'},
  'Suecia':         {code:'SWE',iso:'se',  c1:'#3B5BFF',c2:'#FFD23F'},
  'Rep. Checa':     {code:'CZE',iso:'cz',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'Chequia':        {code:'CZE',iso:'cz',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'Bosnia y Her.':  {code:'BIH',iso:'ba',  c1:'#3B5BFF',c2:'#FFD23F'},
  'Serbia':         {code:'SRB',iso:'rs',  c1:'#FF5C4D',c2:'#3B5BFF'},
  // CONCACAF
  'EE.UU.':         {code:'USA',iso:'us',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'Estados Unidos': {code:'USA',iso:'us',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'México':         {code:'MEX',iso:'mx',  c1:'#00C46B',c2:'#FF5C4D'},
  'Canadá':         {code:'CAN',iso:'ca',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Haití':          {code:'HAI',iso:'ht',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'Jamaica':        {code:'JAM',iso:'jm',  c1:'#00C46B',c2:'#FFD23F'},
  'Costa Rica':     {code:'CRC',iso:'cr',  c1:'#3B5BFF',c2:'#FF5C4D'},
  'Honduras':       {code:'HON',iso:'hn',  c1:'#3B5BFF',c2:'#F4F5FF'},
  'Panamá':         {code:'PAN',iso:'pa',  c1:'#FF5C4D',c2:'#3B5BFF'},
  'Curazao':        {code:'CUW',iso:'cw',  c1:'#3B5BFF',c2:'#FFD23F'},
  'Cabo Verde':     {code:'CPV',iso:'cv',  c1:'#3B5BFF',c2:'#FF5C4D'},
  // CAF
  'Senegal':        {code:'SEN',iso:'sn',  c1:'#00C46B',c2:'#FFD23F'},
  'Marruecos':      {code:'MAR',iso:'ma',  c1:'#C2185B',c2:'#00C46B'},
  'Egipto':         {code:'EGI',iso:'eg',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Túnez':          {code:'TUN',iso:'tn',  c1:'#FF5C4D',c2:'#F4F5FF'},
  'Costa de Marfil':{code:'CIV',iso:'ci',  c1:'#FF7A1A',c2:'#00C46B'},
  'Nigeria':        {code:'NGA',iso:'ng',  c1:'#00C46B',c2:'#F4F5FF'},
  'Ghana':          {code:'GHA',iso:'gh',  c1:'#FF5C4D',c2:'#FFD23F'},
  'Camerún':        {code:'CMR',iso:'cm',  c1:'#00C46B',c2:'#FF5C4D'},
  'Sudáfrica':      {code:'SAF',iso:'za',  c1:'#00C46B',c2:'#FFD23F'},
  'Argelia':        {code:'ALG',iso:'dz',  c1:'#00C46B',c2:'#F4F5FF'},
  'Mali':           {code:'MLI',iso:'ml',  c1:'#00C46B',c2:'#FFD23F'},
  'Malí':           {code:'MLI',iso:'ml',  c1:'#00C46B',c2:'#FFD23F'},
  'RD Congo':       {code:'COD',iso:'cd',  c1:'#3B5BFF',c2:'#FFD23F'},
  // AFC
  'Japón':          {code:'JPN',iso:'jp',  c1:'#F4F5FF',c2:'#FF5C4D'},
  'Corea del Sur':  {code:'KOR',iso:'kr',  c1:'#F4F5FF',c2:'#3B5BFF'},
  'Australia':      {code:'AUS',iso:'au',  c1:'#FFD23F',c2:'#00C46B'},
  'Irán':           {code:'IRN',iso:'ir',  c1:'#00C46B',c2:'#FF5C4D'},
  'Arabia Saudita': {code:'KSA',iso:'sa',  c1:'#00C46B',c2:'#F4F5FF'},
  'Qatar':          {code:'QAT',iso:'qa',  c1:'#7A1F4A',c2:'#F4F5FF'},
  'Irak':           {code:'IRQ',iso:'iq',  c1:'#FF5C4D',c2:'#1F2330'},
  'Jordania':       {code:'JOR',iso:'jo',  c1:'#1F2330',c2:'#FF5C4D'},
  'Uzbekistán':     {code:'UZB',iso:'uz',  c1:'#3B5BFF',c2:'#00C46B'},
  // OFC
  'Nueva Zelanda':  {code:'NZL',iso:'nz',  c1:'#1F2330',c2:'#FF5C4D'},
};

function flTeam(name) {
  if (FL_TEAMS[name]) return FL_TEAMS[name];
  const code = name.replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase() || '???';
  const palette = ['#3B5BFF','#FF5C4D','#FFD23F','#00C46B','#FF7A1A','#7BB4FF'];
  const h = [...(name||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
  return {code, iso:null, c1:palette[h%palette.length], c2:'#F4F5FF'};
}

function flLight(c) { return c==='#F4F5FF'||c==='#FFD23F'; }

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getInitials(name) {
  const parts = String(name||'').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(name||'').slice(0,2).toUpperCase();
}

/* ── TeamChip HTML ─────────────────────────────────────────────────────── */
function chipHTML(code, iso, size, r) {
  size = size || 24;
  r = r !== undefined ? r : Math.round(size * 0.18);
  if (iso) {
    return `<div style="width:${size}px;height:${size}px;border-radius:${r}px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12);"><img src="https://flagcdn.com/w40/${iso}.png" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="${escHtml(code)}"></div>`;
  }
  return `<div style="width:${size}px;height:${size}px;border-radius:${r}px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:${Math.round(size*0.35)}px;color:rgba(244,245,255,0.3);">?</div>`;
}
function chipByName(name, size, r) {
  const t = flTeam(name);
  return chipHTML(t.code, t.iso, size, r);
}

/* ── Date helpers ──────────────────────────────────────────────────────── */
function parseMatchDate(str) {
  if (!str) return null;
  let m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return null;
}

function getTodayOrUpcoming(matches) {
  try {
    const nowArg = new Date(Date.now() - 3*3600*1000);
    const today = nowArg.toISOString().slice(0,10);
    const todayM = matches.filter(m => !m.is_finished && parseMatchDate(m.match_datetime_str)===today);
    if (todayM.length) return {title:'HOY', list:todayM.slice(0,6)};
  } catch(e){}
  // matches ya viene ordenado por fecha desde renderInicio
  const upcoming = matches.filter(m => m.is_open && !m.home_team.includes('TBD') && !m.away_team.includes('TBD'));
  return {title:'PRÓXIMOS', list:upcoming.slice(0,5)};
}

/* ── Group table calc ──────────────────────────────────────────────────── */
function _buildGroupTable(gId, grpMs) {
  const teams = [...new Set(grpMs.flatMap(m=>[m.home_team,m.away_team]))];
  const st = {};
  teams.forEach(t=>{st[t]={pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0};});
  grpMs.filter(m=>m.is_finished).forEach(m=>{
    const h=st[m.home_team],a=st[m.away_team];
    if(!h||!a) return;
    h.pj++;a.pj++;h.gf+=m.home_goals;h.gc+=m.away_goals;
    a.gf+=m.away_goals;a.gc+=m.home_goals;
    if(m.home_goals>m.away_goals){h.g++;h.pts+=3;a.p++;}
    else if(m.home_goals<m.away_goals){a.g++;a.pts+=3;h.p++;}
    else{h.e++;h.pts++;a.e++;a.pts++;}
  });
  return {
    gId,
    rows: teams.sort((a,b)=>{
      const sa=st[a],sb=st[b];
      if(sb.pts!==sa.pts) return sb.pts-sa.pts;
      const dg = (sb.gf-sb.gc)-(sa.gf-sa.gc);
      if(dg!==0) return dg;
      return sb.gf-sa.gf; // goles a favor como 3er criterio FIFA
    }).map(name=>({name,...st[name]}))
  };
}

function calcGroupTable(nextMatch, allMatches) {
  if (!nextMatch) return null;
  const grp = (nextMatch.stage||'').match(/Grupo\s+([A-L])/i);
  if (!grp) return null;
  const gId = grp[1].toUpperCase();
  const grpMs = allMatches.filter(m=>{
    const g=(m.stage||'').match(/Grupo\s+([A-L])/i);
    return g && g[1].toUpperCase()===gId;
  });
  if (!grpMs.length) return null;
  return _buildGroupTable(gId, grpMs);
}

function calcAllGroupTables(allMatches) {
  const byGroup = {};
  allMatches.forEach(m=>{
    const g=(m.stage||'').match(/Grupo\s+([A-L])/i);
    if (!g) return;
    const gId = g[1].toUpperCase();
    if (!byGroup[gId]) byGroup[gId] = [];
    byGroup[gId].push(m);
  });
  return 'ABCDEFGHIJKL'.split('').filter(l=>byGroup[l]).map(l=>_buildGroupTable(l, byGroup[l]));
}

/* ── Card wrapper ──────────────────────────────────────────────────────── */
function card(content, {glow=false,padded=true,extraStyle=''}={}) {
  const sh = glow?'0 0 0 1px rgba(212,255,63,0.1),0 20px 60px -20px rgba(212,255,63,0.15)':'none';
  const pd = padded?'22px':'0';
  return `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:${pd};position:relative;box-shadow:${sh};${extraStyle}">${content}</div>`;
}

function cardHead(eyebrow, title, right='') {
  return `<div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:16px;">
    <div>
      ${eyebrow?`<div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;">${escHtml(eyebrow)}</div>`:''}
      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:26px;color:#F4F5FF;letter-spacing:0.01em;text-transform:uppercase;line-height:0.95;">${escHtml(title)}</div>
    </div>
    ${right?`<div>${right}</div>`:''}
  </div>`;
}

/* ── Hero band ─────────────────────────────────────────────────────────── */
function heroHTML(s, pos, total, pts, ptsToLeader, ptsToNext, exactos, hasGroup) {
  const name = escHtml(s.display_name||s.username||'');
  let sub;
  if (!hasGroup) sub = `Creá o unite a un grupo para empezar a competir.`;
  else if (pos===1) sub = `<b style="color:#D4FF3F;">¡Líder de tu grupo!</b> Seguí prediciendo para mantener la ventaja.`;
  else if (ptsToNext>0) sub = `Estás a <b style="color:#D4FF3F;">${ptsToNext} pts</b> de subir al puesto ${pos-1}.`;
  else sub = `Muy parejo arriba — un partido puede cambiar todo.`;

  const tile = `<div style="position:relative;background:linear-gradient(160deg,rgba(212,255,63,0.10),rgba(59,91,255,0.05));border:1px solid rgba(255,255,255,0.16);border-radius:22px;padding:26px 30px;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#D4FF3F,transparent);"></div>
    <div style="display:flex;align-items:flex-end;gap:24px;">
      <div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.14em;margin-bottom:6px;">TU POSICIÓN</div>
        <div style="display:flex;align-items:baseline;gap:4px;">
          <span data-countup="${hasGroup?pos:0}" style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:96px;line-height:0.85;color:#F4F5FF;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;">${hasGroup?pos:'—'}</span>
          <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:32px;color:rgba(244,245,255,0.38);line-height:0.85;">/${hasGroup?total:'—'}</span>
        </div>
      </div>
      <div style="flex:1;border-left:1px solid rgba(255,255,255,0.08);padding-left:24px;padding-bottom:8px;display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.12em;">PUNTOS</span>
          <span data-countup="${pts}" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:28px;color:#D4FF3F;line-height:1;font-variant-numeric:tabular-nums;">${pts}</span>
        </div>
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.12em;">EXACTOS</span>
          <span data-countup="${exactos}" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:28px;color:#F4F5FF;line-height:1;font-variant-numeric:tabular-nums;">${exactos}</span>
        </div>
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.12em;">A LÍDER</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:600;font-size:18px;color:#F4F5FF;line-height:1;">-${ptsToLeader}</span>
        </div>
      </div>
    </div>
  </div>`;

  return `<div class="fl-hero">
    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:#D4FF3F;letter-spacing:0.16em;margin-bottom:14px;display:flex;align-items:center;gap:10px;">
        <span style="display:inline-block;width:28px;height:1px;background:#D4FF3F;flex-shrink:0;"></span>
        MUNDIAL 2026 · PRODE
      </div>
      <h1 class="fl-hero-h1" style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:112px;line-height:0.86;letter-spacing:-0.005em;margin:0;color:#F4F5FF;text-transform:uppercase;">
        Hola,&nbsp;<span style="background:linear-gradient(120deg,#D4FF3F,#FFD23F);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${name}.</span>
      </h1>
      <p class="fl-hero-sub" style="font-size:18px;font-weight:400;color:rgba(244,245,255,0.62);margin-top:18px;max-width:600px;line-height:1.5;">${sub}</p>
    </div>
    ${tile}
  </div>`;
}

/* ── Ticker ────────────────────────────────────────────────────────────── */
function tickerHTML(items) {
  if (!items.length) return '';
  const itemW = 248;
  const dur = (items.length*itemW)/50;
  const loop = [...items,...items,...items];
  const cells = loop.map(m=>{
    const h=flTeam(m.home_team),a=flTeam(m.away_team);
    return `<div style="display:flex;align-items:center;gap:10px;padding-right:28px;border-right:1px solid rgba(255,255,255,0.08);min-width:${itemW}px;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.38);letter-spacing:0.04em;">FT</span>
      ${chipHTML(h.code,h.iso,20,4)}
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:#F4F5FF;">${escHtml(h.code)}</span>
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#D4FF3F;font-variant-numeric:tabular-nums;">${m.home_goals}–${m.away_goals}</span>
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:#F4F5FF;">${escHtml(a.code)}</span>
      ${chipHTML(a.code,a.iso,20,4)}
    </div>`;
  }).join('');
  return `<div class="fl-ticker-wrap">
    <div class="fl-ticker-inner" style="animation-duration:${dur}s;">${cells}</div>
  </div>`;
}

/* ── Live Match card ───────────────────────────────────────────────────── */
function liveMatchHTML(m, matchPreds) {
  const h = flTeam(m.home_team), a = flTeam(m.away_team);
  const colors = ['#D4FF3F','#3B5BFF','#FF5C4D','#FFD23F','#FF7A1A','#7BB4FF'];

  const memberRows = (matchPreds||[]).map((p,i) => {
    const hasPred = p.predicted_home_goals !== null && p.predicted_away_goals !== null;
    const av = escHtml(getInitials(p.display_name||''));
    const avBg = colors[i % colors.length];
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;${i>0?'border-top:1px solid rgba(255,255,255,0.05)':''}">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:26px;height:26px;border-radius:50%;background:${avBg};display:grid;place-items:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:10px;color:#0A0B1E;flex-shrink:0;">${av}</div>
        <span style="font-size:13px;font-weight:500;color:#F4F5FF;">${escHtml(p.display_name||'')}</span>
      </div>
      ${hasPred
        ? `<span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#D4FF3F;font-variant-numeric:tabular-nums;letter-spacing:0.02em;">${p.predicted_home_goals} — ${p.predicted_away_goals}</span>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.25);letter-spacing:0.08em;">sin predecir</span>`
      }
    </div>`;
  }).join('');

  const groupPredsSection = matchPreds?.length
    ? `<div style="padding:0 26px 26px;">
        <div style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:rgba(244,245,255,0.35);letter-spacing:0.14em;margin-bottom:10px;">PRONÓSTICOS DEL GRUPO</div>
          ${memberRows}
        </div>
      </div>` : '';

  const flagDiv = (team, flip) => {
    const t = flTeam(team);
    const inner = t.iso
      ? `<img src="https://flagcdn.com/w160/${t.iso}.png" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="${escHtml(t.code)}">`
      : `<span style="font-size:22px;color:rgba(244,245,255,0.3);">?</span>`;
    return `<div style="width:72px;height:72px;border-radius:12px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;">${inner}</div>`;
  };

  const content = `
    <div style="padding:18px 26px;border-bottom:1px solid rgba(255,92,77,0.15);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <span class="fl-live-dot"></span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#FF5C4D;letter-spacing:0.14em;padding:4px 9px;border-radius:5px;background:rgba(255,92,77,0.10);border:1px solid rgba(255,92,77,0.25);">EN VIVO</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.55);letter-spacing:0.06em;">${escHtml(m.stage||'')}</span>
    </div>

    <div style="padding:28px 36px 24px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;position:relative;">
      <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(255,92,77,0.07),transparent 70%);"></div>

      <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:0;">
        ${flagDiv(m.home_team)}
        <div class="fl-team-name-lg" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:28px;line-height:0.95;color:#F4F5FF;text-transform:uppercase;">${escHtml(m.home_team)}</div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;z-index:1;padding:0 8px;">
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:48px;color:#F4F5FF;font-variant-numeric:tabular-nums;letter-spacing:0.04em;line-height:1;">—&thinsp;:&thinsp;—</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#FF5C4D;letter-spacing:0.12em;opacity:0.85;">EN CURSO</div>
      </div>

      <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:0;flex-direction:row-reverse;">
        ${flagDiv(m.away_team)}
        <div style="text-align:right;flex:1;min-width:0;">
          <div class="fl-team-name-lg" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:28px;line-height:0.95;color:#F4F5FF;text-transform:uppercase;">${escHtml(m.away_team)}</div>
        </div>
      </div>
    </div>
    ${groupPredsSection}`;

  return card(content, {padded:false, extraStyle:'overflow:hidden;border-color:rgba(255,92,77,0.25);box-shadow:0 0 0 1px rgba(255,92,77,0.08),0 16px 48px -16px rgba(255,92,77,0.18);'});
}

/* ── Upcoming Matches (next 3) ─────────────────────────────────────────── */
function upcomingMatchCardHTML(m, memberPreds, predState, hasGroup, showForm) {
  const h = flTeam(m.home_team), a = flTeam(m.away_team);
  const colors = ['#D4FF3F','#3B5BFF','#FF5C4D','#FFD23F','#FF7A1A','#7BB4FF'];

  const memberRows = (memberPreds||[]).map((p, i) => {
    const hasPred = p.predicted_home_goals !== null && p.predicted_away_goals !== null;
    const av = escHtml(getInitials(p.display_name||''));
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;${i>0?'border-top:1px solid rgba(255,255,255,0.05)':''}">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:24px;height:24px;border-radius:50%;background:${colors[i%colors.length]};display:grid;place-items:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:9px;color:#0A0B1E;flex-shrink:0;">${av}</div>
        <span style="font-size:12px;font-weight:500;color:rgba(244,245,255,0.75);">${escHtml(p.display_name||'')}</span>
      </div>
      ${hasPred
        ? `<span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:16px;color:#D4FF3F;font-variant-numeric:tabular-nums;">${p.predicted_home_goals} — ${p.predicted_away_goals}</span>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.22);letter-spacing:0.08em;">sin predecir</span>`
      }
    </div>`;
  }).join('');

  const predsSection = hasGroup && memberPreds?.length
    ? `<div style="margin-top:12px;padding:12px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:rgba(244,245,255,0.30);letter-spacing:0.14em;margin-bottom:8px;">PRONÓSTICOS</div>
        ${memberRows}
      </div>` : '';

  let formSection = '';
  if (showForm) {
    if (m.is_open) {
      const btnSaved = predState.saved;
      const btnBg = btnSaved ? 'rgba(212,255,63,0.15)' : '#D4FF3F';
      const btnColor = btnSaved ? '#D4FF3F' : '#0A0B1E';
      const btnBorder = btnSaved ? 'border:1px solid #D4FF3F;' : '';
      const btnText = btnSaved ? '✓ ACTUALIZAR' : 'Guardar →';
      formSection = `
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.14em;margin-bottom:10px;">TU PRONÓSTICO</div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border-radius:14px;padding:8px 10px;border:1px solid rgba(255,255,255,0.08);">
              <button class="fl-score-btn" id="fl-dec-h" style="width:32px;height:32px;font-size:18px;">−</button>
              <div id="fl-num-h" class="fl-score-num" style="font-size:52px;min-width:40px;">${predState.hg}</div>
              <button class="fl-score-btn" id="fl-inc-h" style="width:32px;height:32px;font-size:18px;">+</button>
            </div>
            <span style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:32px;color:rgba(244,245,255,0.28);">—</span>
            <div style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border-radius:14px;padding:8px 10px;border:1px solid rgba(255,255,255,0.08);">
              <button class="fl-score-btn" id="fl-dec-a" style="width:32px;height:32px;font-size:18px;">−</button>
              <div id="fl-num-a" class="fl-score-num" style="font-size:52px;min-width:40px;">${predState.ag}</div>
              <button class="fl-score-btn" id="fl-inc-a" style="width:32px;height:32px;font-size:18px;">+</button>
            </div>
            <button id="fl-save-btn" class="fl-save-btn" style="flex:1;min-width:100px;padding:12px 16px;font-size:14px;background:${btnBg};color:${btnColor};${btnBorder}${!hasGroup?'opacity:0.4;cursor:not-allowed;':''}"
              ${!hasGroup?'disabled':''}>${btnText}</button>
          </div>
        </div>`;
    } else {
      formSection = `<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.22);letter-spacing:0.08em;">PREDICCIONES CERRADAS</div>`;
    }
  }

  const flagEl = (iso, code, flip) => iso
    ? `<div style="width:56px;height:56px;border-radius:10px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12);"><img src="https://flagcdn.com/w80/${iso}.png" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="${escHtml(code)}"></div>`
    : `<div style="width:56px;height:56px;border-radius:10px;flex-shrink:0;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:18px;color:rgba(244,245,255,0.2);">?</div>`;

  const content = `
    <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#D4FF3F;letter-spacing:0.14em;padding:3px 8px;border-radius:4px;background:rgba(212,255,63,0.10);border:1px solid rgba(212,255,63,0.20);">PRÓXIMO PARTIDO</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.45);letter-spacing:0.05em;">${escHtml(m.match_datetime_str||'')} · ${escHtml(m.stage||'')}</span>
    </div>
    <div style="padding:20px 20px 0;">
      <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:14px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          ${flagEl(h.iso, h.code)}
          <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:20px;line-height:1;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;">${escHtml(m.home_team)}</div>
        </div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:28px;color:rgba(244,245,255,0.25);padding:0 4px;">VS</div>
        <div style="display:flex;align-items:center;gap:10px;min-width:0;flex-direction:row-reverse;">
          ${flagEl(a.iso, a.code)}
          <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:20px;line-height:1;color:#F4F5FF;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;text-align:right;">${escHtml(m.away_team)}</div>
        </div>
      </div>
      ${predsSection}
      ${formSection}
    </div>
    <div style="height:20px;"></div>`;

  return card(content, {padded:false, glow: showForm && m.is_open, extraStyle:'overflow:hidden;'});
}

function upcomingMatchesHTML(next3Maps, predState, hasGroup) {
  if (!next3Maps?.length) return card(`<div style="text-align:center;padding:40px 0;">
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:20px;color:rgba(244,245,255,0.38);text-transform:uppercase;">Sin partidos próximos</div>
  </div>`);
  return next3Maps.map(({match, preds}, i) =>
    upcomingMatchCardHTML(match, preds, predState, hasGroup, i === 0)
  ).join('');
}

/* ── Next Match card ───────────────────────────────────────────────────── */
function nextMatchHTML(m, predState, hasGroup, matchPreds) {
  if (!m) return card(`<div style="text-align:center;padding:40px 0;">
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:20px;color:rgba(244,245,255,0.38);text-transform:uppercase;letter-spacing:0.04em;">Sin partidos abiertos</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.25);margin-top:8px;letter-spacing:0.08em;">Los próximos abrirán antes de cada partido</div>
  </div>`, {glow:false});

  const h=flTeam(m.home_team), a=flTeam(m.away_team);
  const btnSaved = predState.saved;
  const btnBg = btnSaved ? 'rgba(212,255,63,0.15)' : '#D4FF3F';
  const btnColor = btnSaved ? '#D4FF3F' : '#0A0B1E';
  const btnBorder = btnSaved ? 'border:1px solid #D4FF3F;' : '';
  const btnText = btnSaved ? '✓ ACTUALIZAR PRONÓSTICO' : 'Guardar pronóstico →';

  // Pronósticos del grupo para este partido
  const colors = ['#D4FF3F','#3B5BFF','#FF5C4D','#FFD23F','#FF7A1A','#7BB4FF'];
  const memberRows = (matchPreds||[]).map((p,i) => {
    const hasPred = p.predicted_home_goals !== null && p.predicted_away_goals !== null;
    const av = escHtml(getInitials(p.display_name||''));
    const avBg = colors[i % colors.length];
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;${i>0?'border-top:1px solid rgba(255,255,255,0.05)':''}">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:26px;height:26px;border-radius:50%;background:${avBg};display:grid;place-items:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:10px;color:#0A0B1E;flex-shrink:0;">${av}</div>
        <span style="font-size:13px;font-weight:500;color:#F4F5FF;">${escHtml(p.display_name||'')}</span>
      </div>
      ${hasPred
        ? `<span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#D4FF3F;font-variant-numeric:tabular-nums;letter-spacing:0.02em;">${p.predicted_home_goals} — ${p.predicted_away_goals}</span>`
        : `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.25);letter-spacing:0.08em;">sin predecir</span>`
      }
    </div>`;
  }).join('');

  const groupPredsSection = hasGroup && matchPreds?.length
    ? `<div style="margin-top:14px;padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:rgba(244,245,255,0.35);letter-spacing:0.14em;margin-bottom:10px;">PRONÓSTICOS DEL GRUPO</div>
        ${memberRows}
      </div>`
    : '';

  const content = `
    <div style="padding:20px 26px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#D4FF3F;letter-spacing:0.14em;padding:5px 9px;border-radius:5px;background:rgba(212,255,63,0.10);border:1px solid rgba(212,255,63,0.25);">PRÓXIMO PARTIDO</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.62);letter-spacing:0.06em;">${escHtml(m.match_datetime_str||'')} · ${escHtml(m.stage||'')}</span>
      </div>
      ${!hasGroup?`<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.06em;">Unite a un grupo para predecir</span>`:''}
    </div>

    <div style="padding:40px 36px 32px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:28px;position:relative;">
      <div style="position:absolute;inset:0;opacity:0.5;pointer-events:none;background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(212,255,63,0.06),transparent 70%),repeating-linear-gradient(90deg,transparent 0 80px,rgba(255,255,255,0.02) 80px 81px);"></div>

      <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;">
        ${h.iso
          ? `<div class="fl-team-chip-lg" style="width:88px;height:88px;border-radius:14px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.14);"><img src="https://flagcdn.com/w160/${h.iso}.png" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="${escHtml(h.code)}"></div>`
          : `<div class="fl-team-chip-lg" style="width:88px;height:88px;border-radius:14px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:30px;color:rgba(244,245,255,0.3);">?</div>`
        }
        <div>
          <div class="fl-team-name-lg" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:34px;line-height:0.95;color:#F4F5FF;text-transform:uppercase;letter-spacing:0.005em;">${escHtml(m.home_team)}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;margin-top:5px;text-transform:uppercase;">${escHtml(m.stage||'')}</div>
        </div>
      </div>

      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:44px;color:rgba(244,245,255,0.38);letter-spacing:0.06em;padding:0 8px;position:relative;z-index:1;">VS</div>

      <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;flex-direction:row-reverse;">
        ${a.iso
          ? `<div class="fl-team-chip-lg" style="width:88px;height:88px;border-radius:14px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.14);"><img src="https://flagcdn.com/w160/${a.iso}.png" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="${escHtml(a.code)}"></div>`
          : `<div class="fl-team-chip-lg" style="width:88px;height:88px;border-radius:14px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:30px;color:rgba(244,245,255,0.3);">?</div>`
        }
        <div style="text-align:right;">
          <div class="fl-team-name-lg" style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:34px;line-height:0.95;color:#F4F5FF;text-transform:uppercase;letter-spacing:0.005em;">${escHtml(m.away_team)}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;margin-top:5px;text-transform:uppercase;">${escHtml(m.stage||'')}</div>
        </div>
      </div>
    </div>

    <div id="fl-predictor-grid" style="padding:0 36px 36px;display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start;">
      <div>
        ${m.is_open ? `
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.14em;margin-bottom:14px;">TU PRONÓSTICO</div>
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border-radius:18px;padding:10px 14px;border:1px solid rgba(255,255,255,0.08);">
            <button class="fl-score-btn" id="fl-dec-h" style="width:38px;height:38px;font-size:21px;" aria-label="Menos">−</button>
            <div id="fl-num-h" class="fl-score-num" style="font-size:72px;min-width:55px;">${predState.hg}</div>
            <button class="fl-score-btn" id="fl-inc-h" style="width:38px;height:38px;font-size:21px;" aria-label="Más">+</button>
          </div>
          <span style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:48px;color:rgba(244,245,255,0.38);">—</span>
          <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border-radius:18px;padding:10px 14px;border:1px solid rgba(255,255,255,0.08);">
            <button class="fl-score-btn" id="fl-dec-a" style="width:38px;height:38px;font-size:21px;" aria-label="Menos">−</button>
            <div id="fl-num-a" class="fl-score-num" style="font-size:72px;min-width:55px;">${predState.ag}</div>
            <button class="fl-score-btn" id="fl-inc-a" style="width:38px;height:38px;font-size:21px;" aria-label="Más">+</button>
          </div>
        </div>
        <button id="fl-save-btn" class="fl-save-btn" style="margin-top:16px;padding:16px 24px;font-size:17px;background:${btnBg};color:${btnColor};${btnBorder}${!hasGroup?'opacity:0.4;cursor:not-allowed;':''}"
          ${!hasGroup?'disabled':''}>
          ${btnText}
        </button>
        ` : `
        <div style="padding:20px 0;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.14em;margin-bottom:8px;">TU PRONÓSTICO</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.30);letter-spacing:0.06em;">Predicciones cerradas</div>
        </div>
        `}
      </div>
      <div>
        ${groupPredsSection}
      </div>
    </div>`;

  return card(content, {glow:true, padded:false, extraStyle:'overflow:hidden;'});
}

/* ── Today / Próximos card ─────────────────────────────────────────────── */
function matchRowHTML(m, pred) {
  const h=flTeam(m.home_team), a=flTeam(m.away_team);
  const ft=m.is_finished;
  const sc=ft?'#D4FF3F':'#F4F5FF';
  const sbg=ft?'rgba(212,255,63,0.06)':'rgba(255,255,255,0.04)';
  const badge=pred
    ?`<span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:#D4FF3F;border:1px solid rgba(212,255,63,0.2);padding:4px 8px;border-radius:6px;">${pred.predicted_home_goals}–${pred.predicted_away_goals}</span>`
    :`<span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:rgba(244,245,255,0.62);letter-spacing:0.08em;">PREDECIR →</span>`;
  return `<div class="fl-match-row" data-nav="predicciones" style="display:grid;grid-template-columns:58px 1fr auto 1fr 86px;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08);">
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.38);letter-spacing:0.05em;">${ft?'FINAL':escHtml(m.match_datetime_str||'')}</div>
    <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;min-width:0;">
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:17px;color:#F4F5FF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(m.home_team)}</span>
      ${chipHTML(h.code,h.iso,24,5)}
    </div>
    <div style="display:flex;align-items:center;gap:5px;padding:4px 10px;background:${sbg};border:1px solid rgba(255,255,255,0.08);border-radius:8px;">
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:20px;color:${sc};font-variant-numeric:tabular-nums;line-height:1;">${ft?m.home_goals:'—'}</span>
      <span style="color:rgba(244,245,255,0.38);font-size:12px;">·</span>
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:20px;color:${sc};font-variant-numeric:tabular-nums;line-height:1;">${ft?m.away_goals:'—'}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;min-width:0;">
      ${chipHTML(a.code,a.iso,24,5)}
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:700;font-size:17px;color:#F4F5FF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(m.away_team)}</span>
    </div>
    <div style="text-align:right;">${badge}</div>
  </div>`;
}

function todayCard(title, matches, myPreds) {
  if (!matches.length) return '';
  const rows = matches.map(m=>matchRowHTML(m, myPreds.find(p=>p.match_id===m.id))).join('');
  const rightBtn = `<button style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.62);letter-spacing:0.08em;background:transparent;border:0;cursor:pointer;" data-nav="partidos">VER FIXTURE →</button>`;
  return card(`<div style="padding:22px 26px 18px;">${cardHead(`${matches.length} partidos`,title,rightBtn)}</div><div>${rows}</div>`, {padded:false});
}

/* ── Group table card ──────────────────────────────────────────────────── */
function _groupTableInner(gt) {
  const hdr = `<div style="display:grid;grid-template-columns:22px 1fr repeat(5,28px) 40px;gap:6px;padding:0 4px 8px;font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;border-bottom:1px solid rgba(255,255,255,0.08);">
    <span></span><span>EQUIPO</span>
    <span style="text-align:right">PJ</span><span style="text-align:right">G</span><span style="text-align:right">E</span><span style="text-align:right">P</span><span style="text-align:right">±</span><span style="text-align:right">PTS</span>
  </div>`;
  const sc = 'font-family:\'JetBrains Mono\',monospace;font-size:11px;color:rgba(244,245,255,0.62);text-align:right;font-variant-numeric:tabular-nums;';
  const rows = gt.rows.map((r,i)=>{
    const t=flTeam(r.name);
    const q=i<2;
    const diff=r.gf-r.gc;
    return `<div class="fl-group-row" style="display:grid;grid-template-columns:22px 1fr repeat(5,28px) 40px;gap:6px;padding:8px 4px;align-items:center;border-bottom:${i<gt.rows.length-1?'1px solid rgba(255,255,255,0.08)':'none'};margin-left:${q?'-4px':'0'};padding-left:${q?'8px':'4px'};border-left:${q?'2px solid #D4FF3F':'2px solid transparent'};">
      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;color:${q?'#D4FF3F':'rgba(244,245,255,0.62)'};text-align:center;">${i+1}</div>
      <div style="display:flex;align-items:center;gap:6px;min-width:0;">
        ${chipHTML(t.code,t.iso,18,4)}
        <span style="font-size:12px;font-weight:600;color:#F4F5FF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(r.name)}</span>
      </div>
      <span style="${sc}">${r.pj}</span><span style="${sc}">${r.g}</span><span style="${sc}">${r.e}</span><span style="${sc}">${r.p}</span>
      <span style="${sc}">${diff>0?'+'+diff:diff}</span>
      <span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:${q?'#D4FF3F':'#F4F5FF'};text-align:right;font-variant-numeric:tabular-nums;">${r.pts}</span>
    </div>`;
  }).join('');
  return `${hdr}${rows}`;
}

function groupTableHTML(gt) {
  if (!gt) return '';
  return card(`${cardHead('Tabla del grupo',`GRUPO ${gt.gId}`)}${_groupTableInner(gt)}`);
}

function allGroupsHTML(tables) {
  if (!tables || !tables.length) return '';
  const cards = tables.map(gt=>`
    <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;">Tabla del grupo</div>
      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;letter-spacing:0.01em;text-transform:uppercase;margin-bottom:14px;">GRUPO ${escHtml(gt.gId)}</div>
      ${_groupTableInner(gt)}
    </div>`).join('');
  return `<div class="fl-all-groups-wrap" style="padding:0 40px 60px;position:relative;z-index:1;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:rgba(244,245,255,0.38);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
      <span style="display:inline-block;width:28px;height:1px;background:rgba(244,245,255,0.2);flex-shrink:0;"></span>
      TABLAS DE POSICIONES
    </div>
    <div id="fl-all-groups-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
      ${cards}
    </div>
  </div>
  <style>
    @media(max-width:1100px){#fl-all-groups-grid{grid-template-columns:repeat(3,1fr)!important;}}
    @media(max-width:768px){#fl-all-groups-grid{grid-template-columns:repeat(2,1fr)!important;}}
    @media(max-width:480px){#fl-all-groups-grid{grid-template-columns:1fr!important;}}
    @media(max-width:768px){.fl-all-groups-wrap{padding:0 20px 40px!important;}}
  </style>`;
}

/* ── Ranking card ──────────────────────────────────────────────────────── */
function rankRowHTML(e, idx, isYou) {
  const medal = idx<3?['#FFD23F','#D7DDE6','#C7935C'][idx]:null;
  const colors=['#D4FF3F','#3B5BFF','#FF5C4D','#FFD23F','#FF7A1A','#7BB4FF','#00C46B','#C2185B'];
  const avBg = colors[((e.user_id||0)+idx)%colors.length];
  const posColor = medal||(isYou?'#D4FF3F':'rgba(244,245,255,0.62)');
  const rowStyle = isYou?'background:rgba(212,255,63,0.10);border:1px solid rgba(212,255,63,0.35);border-radius:12px;':'';
  const initials = escHtml(getInitials(e.display_name||''));
  return `<div class="fl-rank-row" style="display:flex;align-items:center;gap:12px;padding:12px 14px;${rowStyle}">
    <div style="width:28px;text-align:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:${posColor};line-height:1;font-variant-numeric:tabular-nums;">${String(idx+1).padStart(2,'0')}</div>
    <div style="width:32px;height:32px;border-radius:50%;background:${avBg};display:grid;place-items:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;color:#0A0B1E;flex-shrink:0;">${initials}</div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#F4F5FF;">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(e.display_name||'')}</span>
        ${isYou?`<span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:#0A0B1E;background:#D4FF3F;padding:2px 6px;border-radius:4px;flex-shrink:0;">VOS</span>`:''}
      </div>
    </div>
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:26px;color:#F4F5FF;font-variant-numeric:tabular-nums;line-height:1;min-width:48px;text-align:right;">
      ${e.total_pts}<span style="font-size:10px;color:rgba(244,245,255,0.38);margin-left:3px;letter-spacing:0.06em;">PTS</span>
    </div>
  </div>`;
}

function rankingCard(rankingData, userId, hasGroup, groupName) {
  if (!hasGroup) return card(`<div style="text-align:center;padding:24px 0;">
    <div style="font-size:28px;margin-bottom:12px;">🏆</div>
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">¡Sumate a un grupo!</div>
    <div style="font-size:13px;color:rgba(244,245,255,0.62);line-height:1.5;margin-bottom:16px;">Competí con tus amigos. Pedile el link de invitación a alguien.</div>
    <button style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#D4FF3F;background:transparent;border:1px solid rgba(212,255,63,0.25);border-radius:8px;padding:8px 16px;cursor:pointer;letter-spacing:0.08em;" data-nav="grupos">IR A GRUPOS →</button>
  </div>`);

  const title = groupName ? escHtml(groupName.toUpperCase()) : 'RANKING';
  const eyebrow = rankingData?.entries?.length ? `${rankingData.entries.length} JUGADORES` : 'LIGA';

  if (!rankingData?.entries?.length) return card(`${cardHead(eyebrow, title)}<div style="text-align:center;padding:20px 0;font-size:13px;color:rgba(244,245,255,0.38);">Todavía no hay puntos en el grupo.</div>`);

  const viewAll = `<button style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.62);letter-spacing:0.08em;background:transparent;border:0;cursor:pointer;" data-nav="ranking">VER TODO →</button>`;
  const rows = rankingData.entries.map((e,i)=>rankRowHTML(e,i,e.user_id===userId)).join('');
  return card(`<div style="padding:22px 26px 12px;">${cardHead(eyebrow, title, viewAll)}</div><div style="padding:0 14px 16px;">${rows}</div>`, {padded:false});
}

/* ── Points card ───────────────────────────────────────────────────────── */
function pointsCard() {
  const rules=[
    {l:'Ganador o empate',v:'4 pts'},
    {l:'Goles del ganador',v:'2 pts'},
    {l:'Goles del perdedor',v:'2 pts'},
  ];
  const rows = rules.map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);">
    <span style="font-size:13px;font-weight:500;color:#F4F5FF;">${r.l}</span>
    <span style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#D4FF3F;letter-spacing:0.02em;">${r.v}</span>
  </div>`).join('');
  return card(`${cardHead('CÓMO SE CALCULA','PUNTOS')}<div style="display:flex;flex-direction:column;gap:10px;">${rows}</div>
    <div style="margin-top:14px;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.62);text-align:center;letter-spacing:0.04em;">
      Máx <b style="color:#F4F5FF;">8 PTS</b> por partido con ganador · <b style="color:#F4F5FF;">4 PTS</b> por empate
    </div>
    <div style="margin-top:10px;padding:14px 16px;background:rgba(212,255,63,0.04);border:1px solid rgba(212,255,63,0.12);border-radius:10px;display:flex;align-items:flex-start;gap:10px;">
      <span style="font-size:16px;flex-shrink:0;margin-top:1px;">⏱</span>
      <div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:13px;color:#D4FF3F;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Ventana de predicción</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.50);letter-spacing:0.04em;line-height:1.6;">Las predicciones cierran <b style="color:rgba(244,245,255,0.75);">15 minutos antes</b> del pitazo inicial. Pasado ese límite, el pronóstico queda sellado.</div>
      </div>
    </div>`);
}

/* ── Sin predecir card ─────────────────────────────────────────────────── */
function sinPredecirCard(count, hasGroup) {
  const cStyle='background:linear-gradient(135deg,rgba(255,92,77,0.12),rgba(255,92,77,0.04));border-color:rgba(255,92,77,0.30);';
  if (!hasGroup) return card(`<div style="display:flex;align-items:center;gap:16px;">
    <div style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:72px;color:#FF5C4D;line-height:0.8;letter-spacing:-0.02em;">—</div>
    <div>
      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;text-transform:uppercase;line-height:1;">Sin grupo</div>
      <div style="font-size:12px;color:rgba(244,245,255,0.62);margin-top:6px;line-height:1.45;">Unite para empezar a predecir.</div>
    </div>
  </div>
  <button style="margin-top:16px;width:100%;padding:12px;border-radius:10px;background:transparent;border:1px solid rgba(255,92,77,0.3);color:#FF5C4D;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;" data-nav="grupos">Ir a grupos →</button>`,
  {extraStyle:cStyle});

  return card(`<div style="display:flex;align-items:center;gap:18px;">
    <div data-countup="${count}" style="font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:80px;color:#FF5C4D;line-height:0.8;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;">${count}</div>
    <div style="flex:1;">
      <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:20px;color:#F4F5FF;text-transform:uppercase;line-height:1;letter-spacing:0.01em;">Sin predecir</div>
      <div style="font-size:12px;color:rgba(244,245,255,0.62);margin-top:6px;line-height:1.45;">Cargá tus pronósticos antes del<br>cierre de cada partido.</div>
    </div>
  </div>
  <button style="margin-top:16px;width:100%;padding:12px;border-radius:10px;background:transparent;border:1px solid #FF5C4D;color:#FF5C4D;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;" data-nav="predicciones">Predecir ahora →</button>`,
  {extraStyle:cStyle});
}

/* ── Full dashboard ────────────────────────────────────────────────────── */
function buildDashboard(d) {
  const {s,selectedGroup,allRankings,myPreds,nextOpen,tickerItems,today,
         pos,total,pts,ptsToLeader,ptsToNext,exactos,unpredicted,predState,gt,allGroupTables,next3Maps,liveMaps} = d;
  const hasGroup = !!selectedGroup;

  const liveCards = (liveMaps||[]).map(({match,preds}) => liveMatchHTML(match, preds)).join('');

  const leftCol = `<div style="display:flex;flex-direction:column;gap:28px;">
    ${liveCards}
    ${upcomingMatchesHTML(next3Maps, predState, hasGroup)}
    ${groupTableHTML(gt)}
  </div>`;

  const rankingCards = hasGroup
    ? (allRankings||[]).map(({group, data}) => rankingCard(data, s.user_id, true, group.name)).join('')
    : rankingCard(null, s.user_id, false);

  const rightCol = `<div style="display:flex;flex-direction:column;gap:28px;">
    ${rankingCards}
    ${pointsCard()}
    ${sinPredecirCard(unpredicted, hasGroup)}
  </div>`;

  return `<div class="fl-dashboard">
    <div style="position:absolute;top:-200px;right:-200px;width:700px;height:700px;background:radial-gradient(circle,rgba(212,255,63,0.10),transparent 60%);pointer-events:none;z-index:0;"></div>
    <div style="position:absolute;top:500px;left:-300px;width:800px;height:800px;background:radial-gradient(circle,rgba(59,91,255,0.10),transparent 60%);pointer-events:none;z-index:0;"></div>
    ${heroHTML(s,pos,total,pts,ptsToLeader,ptsToNext,exactos,hasGroup)}
    ${tickerHTML(tickerItems)}
    <div class="fl-main-grid">${leftCol}${rightCol}</div>
    <div style="height:1px;background:rgba(255,255,255,0.06);margin:0 40px;position:relative;z-index:1;"></div>
    ${allGroupsHTML(allGroupTables)}
    <div class="fl-footer" style="border-top:1px solid rgba(255,255,255,0.08);padding:18px 40px;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.38);letter-spacing:0.08em;position:relative;z-index:1;">
      <span>PRODE · MUNDIAL 2026</span>
      <span>104 PARTIDOS · 12 GRUPOS</span>
      <span>⚽</span>
    </div>
  </div>`;
}

/* ── Interactions ──────────────────────────────────────────────────────── */
function wirePredictorInteractions(match, predState, groupId) {
  if (!match || !match.is_open) return;
  const numH = document.getElementById('fl-num-h');
  const numA = document.getElementById('fl-num-a');
  const saveBtn = document.getElementById('fl-save-btn');
  if (!numH || !saveBtn) return;

  function bump(el, val) {
    el.textContent = val;
    el.classList.remove('bumped');
    void el.offsetWidth;
    el.classList.add('bumped');
  }

  document.getElementById('fl-dec-h').addEventListener('click', () => { predState.hg=Math.max(0,predState.hg-1); bump(numH,predState.hg); });
  document.getElementById('fl-inc-h').addEventListener('click', () => { predState.hg=Math.min(9,predState.hg+1); bump(numH,predState.hg); });
  document.getElementById('fl-dec-a').addEventListener('click', () => { predState.ag=Math.max(0,predState.ag-1); bump(numA,predState.ag); });
  document.getElementById('fl-inc-a').addEventListener('click', () => { predState.ag=Math.min(9,predState.ag+1); bump(numA,predState.ag); });

  if (!groupId) return;

  saveBtn.addEventListener('click', async () => {
    if (predState.saving) return;
    predState.saving = true;
    saveBtn.textContent = 'Guardando...';
    saveBtn.style.opacity = '0.7';
    try {
      await api.predictions.save(match.id, groupId, predState.hg, predState.ag);
      predState.saved = true;
      predState.saving = false;
      saveBtn.textContent = '✓ GUARDADO';
      saveBtn.style.cssText += 'background:rgba(212,255,63,0.15);color:#D4FF3F;border:1px solid #D4FF3F;opacity:1;';
      setTimeout(() => { saveBtn.textContent = '✓ ACTUALIZAR PRONÓSTICO'; }, 1600);
      showToast('Pronóstico guardado ✓');
    } catch (e) {
      predState.saving = false;
      saveBtn.textContent = 'Error — reintentá';
      saveBtn.style.cssText += 'background:rgba(255,92,77,0.15);color:#FF5C4D;border:1px solid #FF5C4D;opacity:1;';
      setTimeout(() => {
        saveBtn.textContent = predState.saved ? '✓ ACTUALIZAR PRONÓSTICO' : 'Guardar pronóstico →';
        saveBtn.style.background = predState.saved ? 'rgba(212,255,63,0.15)' : '#D4FF3F';
        saveBtn.style.color = predState.saved ? '#D4FF3F' : '#0A0B1E';
        saveBtn.style.border = predState.saved ? '1px solid #D4FF3F' : 'none';
      }, 2200);
    }
  });
}

function wireNavClicks() {
  document.querySelectorAll('.fl-dashboard [data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      const page = e.currentTarget.dataset.nav;
      if (page) navigate(page);
    });
  });
}

function animateCountUps() {
  document.querySelectorAll('[data-countup]').forEach(el => {
    const target = parseInt(el.dataset.countup, 10);
    if (isNaN(target) || target <= 0) return;
    el.textContent = '0';
    let start;
    const dur = 900;
    (function step(t) {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round((1 - Math.pow(1-p,3)) * target);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  });
}

/* ── Main ──────────────────────────────────────────────────────────────── */
async function renderInicio(el) {
  const s = getSession();
  injectFloodlightStyles();
  el.innerHTML = `<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;background:#0A0B1E;margin:-36px -48px;font-family:'JetBrains Mono',monospace;color:rgba(244,245,255,0.3);font-size:12px;letter-spacing:0.14em;">CARGANDO...</div>`;

  // Forzar datos frescos en Inicio para que los resultados siempre estén actualizados
  _cacheClear();

  let groups=[], matches=[];
  try {
    [groups, matches] = await Promise.all([api.groups.list(), api.matches.list()]);
  } catch(e) {
    el.innerHTML = `<div style="padding:40px;color:#FF5C4D;font-family:system-ui;font-size:14px;">Error cargando datos: ${escHtml(e.message)}</div>`;
    return;
  }

  const selectedGroup = groups[0] || null;
  let myPreds=[], allRankings=[];
  if (selectedGroup) {
    try {
      const [preds, ...rankingResults] = await Promise.all([
        api.predictions.list(selectedGroup.id),
        ...groups.map(g => api.ranking.get(g.id)),
      ]);
      myPreds = preds;
      allRankings = groups.map((g, i) => ({ group: g, data: rankingResults[i] }));
    } catch { myPreds=[]; allRankings=[]; }
  }
  const rankingData = allRankings[0]?.data || null;

  // Ordenar por fecha para que "próximo" sea el real
  matches.sort((a,b) => a.match_datetime < b.match_datetime ? -1 : 1);

  const openMatches = matches.filter(m=>m.is_open);
  const finishedMatches = matches.filter(m=>m.is_finished);
  // Próximo por horario (no terminado y no TBD), independientemente de si acepta predicciones
  const nextOpen = matches.find(m =>
    !m.is_finished && !m.home_team.includes('TBD') && !m.away_team.includes('TBD')
  ) || openMatches[0] || null;

  const scored = myPreds.filter(p=>p.points_earned!==null);
  const exactos = scored.filter(p=>(p.points_earned||0)>=6).length;

  const me = rankingData?.entries?.find(e=>e.user_id===s.user_id);
  const pos = me?.position ?? 1;
  const total = rankingData?.entries?.length ?? 1;
  const leaderPts = rankingData?.entries?.[0]?.total_pts ?? 0;
  const pts = me?.total_pts ?? scored.reduce((sum,p)=>sum+(p.points_earned||0),0);
  const ptsToLeader = Math.max(0, leaderPts-pts);
  const ptsToNext = (me && pos>1)
    ? Math.max(0, (rankingData.entries[pos-2]?.total_pts??0)-pts)
    : 0;

  // Excluir partidos TBD (eliminatorias sin equipos definidos) del contador
  const predictableOpen = openMatches.filter(m =>
    !m.home_team.includes('TBD') && !m.away_team.includes('TBD')
  );
  const unpredicted = selectedGroup
    ? predictableOpen.filter(m=>!myPreds.find(p=>p.match_id===m.id)).length
    : predictableOpen.length;

  const today = getTodayOrUpcoming(matches);
  const tickerItems = finishedMatches.slice(-10).reverse();

  const existingPred = nextOpen ? myPreds.find(p=>p.match_id===nextOpen.id) : null;
  const predState = {
    hg: existingPred?.predicted_home_goals ?? 1,
    ag: existingPred?.predicted_away_goals ?? 1,
    saved: !!existingPred,
    saving: false,
  };

  // Próximos 3 partidos con predicciones mergeadas de todos los grupos
  const next3 = matches.filter(m =>
    !m.is_finished && !m.home_team.includes('TBD') && !m.away_team.includes('TBD')
  ).slice(0, 3);

  let next3Maps = next3.map(m => ({ match: m, preds: [] }));
  if (groups.length) {
    try {
      const predsMatrix = await Promise.all(
        next3.map(m => Promise.all(
          groups.map(g => api.predictions.forMatch(m.id, g.id).catch(() => []))
        ))
      );
      next3Maps = next3.map((m, i) => {
        const seen = new Set();
        const merged = [];
        for (const groupPreds of predsMatrix[i]) {
          for (const p of groupPreds) {
            if (!seen.has(p.user_id)) { seen.add(p.user_id); merged.push(p); }
          }
        }
        return { match: m, preds: merged };
      });
    } catch { /* mantener next3Maps vacíos */ }
  }

  // Partidos en vivo con predicciones mergeadas de todos los grupos
  let liveMaps = [];
  try {
    const liveList = await api.matches.live();
    if (liveList.length && groups.length) {
      const livePredsMatrix = await Promise.all(
        liveList.map(m => Promise.all(
          groups.map(g => api.predictions.forMatch(m.id, g.id).catch(() => []))
        ))
      );
      liveMaps = liveList.map((m, i) => {
        const seen = new Set();
        const merged = [];
        for (const gp of livePredsMatrix[i]) {
          for (const p of gp) {
            if (!seen.has(p.user_id)) { seen.add(p.user_id); merged.push(p); }
          }
        }
        return { match: m, preds: merged };
      });
    } else {
      liveMaps = liveList?.map(m => ({ match: m, preds: [] })) || [];
    }
  } catch { liveMaps = []; }

  const gt = calcGroupTable(nextOpen, matches);
  const allGroupTables = calcAllGroupTables(matches);

  el.innerHTML = buildDashboard({
    s, selectedGroup, allRankings, myPreds,
    nextOpen, tickerItems, today,
    pos, total, pts, ptsToLeader, ptsToNext, exactos, unpredicted,
    predState, gt, allGroupTables, next3Maps, liveMaps,
  });

  wirePredictorInteractions(nextOpen, predState, selectedGroup?.id);
  wireNavClicks();
  animateCountUps();
}
