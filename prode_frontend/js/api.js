/**
 * api.js — Capa de comunicación con el backend
 * =============================================
 * Todos los fetch() están acá. El resto de la app
 * solo llama funciones de este archivo, sin saber
 * nada de URLs ni headers.
 */

const API_URL = "https://mundial-app-backend-f48s.onrender.com";

/* ── Caché en memoria ────────────────────────────────────────────────── */
// Los GETs se cachean 45 segundos. Cualquier mutación (POST/PUT) limpia
// el caché para que el próximo render traiga datos frescos.
const _cache = new Map();
const _CACHE_TTL = 45_000;

function _cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > _CACHE_TTL) { _cache.delete(key); return null; }
  return entry.data;
}
function _cacheSet(key, data) { _cache.set(key, { data, ts: Date.now() }); }
function _cacheClear() { _cache.clear(); }

/* ── apiFetch ────────────────────────────────────────────────────────── */
async function apiFetch(path, options = {}, _attempt = 0) {
  const token = localStorage.getItem("token");
  const isGet = !options.method || options.method === "GET";

  if (isGet) {
    const hit = _cacheGet(path);
    if (hit !== null) return hit;
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });
  } catch (networkErr) {
    // Railway dormido o error de red transitorio — reintentamos hasta 3 veces
    if (_attempt < 3) {
      await new Promise(r => setTimeout(r, 1200 * (_attempt + 1)));
      return apiFetch(path, options, _attempt + 1);
    }
    throw new Error("Sin conexión con el servidor. Reintentá en unos segundos.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error de red" }));
    const msg = Array.isArray(err.detail) ? err.detail.join(" · ") : err.detail;
    throw new Error(msg || "Error desconocido");
  }

  const data = await res.json();

  if (isGet) {
    _cacheSet(path, data);
  } else {
    _cacheClear();
  }

  return data;
}

/* ── Auth ────────────────────────────────────────────────────────────── */
const api = {
  auth: {
    login: (username, password) =>
      apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),

    register: (username, email, password, display_name) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, display_name }),
      }),

    me: () => apiFetch("/auth/me"),
  },

  /* ── Grupos ────────────────────────────────────────────────────────── */
  groups: {
    list: () => apiFetch("/groups"),

    create: (name, description) =>
      apiFetch("/groups", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      }),

    members: (groupId) => apiFetch(`/groups/${groupId}/members`),

    join: (inviteToken) =>
      apiFetch(`/groups/join/${inviteToken}`, { method: "POST" }),

    regenerate: (groupId) =>
      apiFetch(`/groups/${groupId}/regenerate`, { method: "POST" }),
  },

  /* ── Partidos ──────────────────────────────────────────────────────── */
  matches: {
    list: (stage = null) =>
      apiFetch(`/matches${stage ? `?stage=${encodeURIComponent(stage)}` : ""}`),

    stages: () => apiFetch("/matches/stages"),

    upcoming: (limit = 10) => apiFetch(`/matches/upcoming?limit=${limit}`),

    live: () => apiFetch('/matches/live'),

    setResult: (matchId, homeGoals, awayGoals) =>
      apiFetch(`/matches/${matchId}/result`, {
        method: "PUT",
        body: JSON.stringify({ home_goals: homeGoals, away_goals: awayGoals }),
      }),
  },

  /* ── Predicciones ──────────────────────────────────────────────────── */
  predictions: {
    list: (groupId, stage = null) => apiFetch(`/predictions?group_id=${groupId}${stage ? `&stage=${encodeURIComponent(stage)}` : ""}`),

    forMatch: (matchId, groupId) => apiFetch(`/predictions/match/${matchId}?group_id=${groupId}`),

    save: (data) =>
      apiFetch("/predictions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  /* ── Ranking ───────────────────────────────────────────────────────── */
  ranking: {
    get: (groupId) => apiFetch(`/ranking?group_id=${groupId}`),
  },

  /* ── Puntos ───────────────────────────────────────────────────────── */
  puntos: {
    zonasGrupos: () => apiFetch("/puntos"),
  },
};

/* ── injectFloodlightStyles ──────────────────────────────────────────── */
/* Cargado aquí para que esté disponible en todas las páginas */
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
      .fl-team-name-lg { font-size:18px !important; line-height:1.1 !important; }
      .fl-team-chip-lg { width:48px !important; height:48px !important; }
      .fl-chip-code-lg { font-size:16px !important; }
      .fl-hero { padding:20px 16px !important; }
      .fl-hero-h1 { font-size:48px !important; }
    }
  `;
  document.head.appendChild(s);
}
