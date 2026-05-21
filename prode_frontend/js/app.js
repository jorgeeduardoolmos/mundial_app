/**
 * app.js — Routing y navegación principal
 */

const ADMIN_USERNAME = "jorgeeduardoolmos";

function showToast(msg, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), duration);
}

function getInitials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function navigate(page) {
  // Top nav activo
  document.querySelectorAll(".top-nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });
  // Bottom nav activo
  document.querySelectorAll(".bn-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });

  const main = document.getElementById("main-content");
  main.scrollTop = 0;

  switch (page) {
    case "inicio":       renderInicio(main); break;
    case "ranking":      renderRanking(main); break;
    case "predicciones": renderPredicciones(main); break;
    case "partidos":     renderPartidos(main); break;
    case "grupos":       renderGrupos(main); break;
    default:             renderInicio(main);
  }

  sessionStorage.setItem("currentPage", page);
}

function initApp() {
  const session = getSession();
  if (!session) return;

  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  // Llenar datos — top nav
  document.getElementById("sb-display-name").textContent = session.display_name;
  document.getElementById("sb-username").textContent = "@" + session.username;
  document.getElementById("sb-avatar").textContent = getInitials(session.display_name);

  // Llenar datos — mobile header
  document.getElementById("mobile-display-name").textContent = session.display_name;
  document.getElementById("mobile-avatar").textContent = getInitials(session.display_name);

  // Top nav — clicks en items
  document.querySelectorAll(".top-nav-item").forEach(el => {
    el.addEventListener("click", () => navigate(el.dataset.page));
  });

  // Top nav — dropdown usuario (toggle)
  const userBtn = document.getElementById("top-nav-user");
  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userBtn.classList.toggle("open");
  });
  // Cerrar dropdown al hacer click fuera
  document.addEventListener("click", () => {
    userBtn.classList.remove("open");
  });

  // Logout — desktop dropdown
  document.getElementById("btn-logout").addEventListener("click", (e) => {
    e.stopPropagation();
    clearSession();
    location.reload();
  });

  // Logout — mobile header
  document.getElementById("btn-logout-mobile").addEventListener("click", () => {
    clearSession();
    location.reload();
  });

  // Bottom nav — clicks
  document.querySelectorAll(".bn-item").forEach(el => {
    el.addEventListener("click", () => navigate(el.dataset.page));
  });

  // Magic link
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite");
  if (inviteToken) {
    api.groups.join(inviteToken)
      .then(res => {
        showToast(`¡Te uniste a ${res.group_name}!`);
        history.replaceState({}, "", "/");
        navigate("grupos");
      })
      .catch(e => {
        if (e.message.includes("Ya sos miembro")) {
          history.replaceState({}, "", "/");
          navigate("grupos");
        } else {
          showToast("Link de invitación inválido.");
          navigate("inicio");
        }
      });
    return;
  }

  const savedPage = sessionStorage.getItem("currentPage") || "inicio";
  // Si hay un error cargando inicio, no quedar atascado en otra página
  navigate(savedPage === "inicio" ? "inicio" : savedPage);
}

document.addEventListener("DOMContentLoaded", () => {
  // Ping silencioso para despertar Railway antes de que el usuario haga algo
  fetch(`${API_URL}/`).catch(() => {});

  initAuth();

  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite");
  if (inviteToken) sessionStorage.setItem("pendingInvite", inviteToken);

  if (isLoggedIn()) {
    const pending = sessionStorage.getItem("pendingInvite");
    if (pending) {
      sessionStorage.removeItem("pendingInvite");
      history.replaceState({}, "", "/");
      api.groups.join(pending)
        .then(res => showToast(`¡Te uniste a ${res.group_name}!`))
        .catch(() => {});
    }
    initApp();
  } else {
    document.getElementById("auth-screen").classList.remove("hidden");
  }
});
