/**
 * api.js — Capa de comunicación con el backend
 * =============================================
 * Todos los fetch() están acá. El resto de la app
 * solo llama funciones de este archivo, sin saber
 * nada de URLs ni headers.
 */

const API_URL = "https://mundialapp-prode.up.railway.app";

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

    setResult: (matchId, homeGoals, awayGoals) =>
      apiFetch(`/matches/${matchId}/result`, {
        method: "PUT",
        body: JSON.stringify({ home_goals: homeGoals, away_goals: awayGoals }),
      }),
  },

  /* ── Predicciones ──────────────────────────────────────────────────── */
  predictions: {
    list: (groupId) => apiFetch(`/predictions?group_id=${groupId}`),

    save: (matchId, groupId, homeGoals, awayGoals) =>
      apiFetch("/predictions", {
        method: "POST",
        body: JSON.stringify({
          match_id: matchId,
          group_id: groupId,
          predicted_home_goals: homeGoals,
          predicted_away_goals: awayGoals,
        }),
      }),
  },

  /* ── Ranking ───────────────────────────────────────────────────────── */
  ranking: {
    get: (groupId) => apiFetch(`/ranking?group_id=${groupId}`),
  },
};
