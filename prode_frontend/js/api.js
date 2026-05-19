/**
 * api.js — Capa de comunicación con el backend
 * =============================================
 * Todos los fetch() están acá. El resto de la app
 * solo llama funciones de este archivo, sin saber
 * nada de URLs ni headers.
 */

const API_URL = "https://mundialapp-prode.up.railway.app";

/** Hace un request al backend y devuelve los datos o lanza un error. */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error de red" }));
    const msg = Array.isArray(err.detail) ? err.detail.join(" · ") : err.detail;
    throw new Error(msg || "Error desconocido");
  }

  return res.json();
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
