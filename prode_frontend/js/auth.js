/**
 * auth.js — Login, registro y sesión
 */

function saveSession(data) {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("username", data.username);
  localStorage.setItem("display_name", data.display_name);
}

function clearSession() {
  ["token", "user_id", "username", "display_name"].forEach(k => localStorage.removeItem(k));
}

function getSession() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    token,
    user_id: parseInt(localStorage.getItem("user_id")),
    username: localStorage.getItem("username"),
    display_name: localStorage.getItem("display_name"),
  };
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function initAuth() {
  // Login
  document.getElementById("btn-login").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const errEl = document.getElementById("login-error");
    errEl.textContent = "";

    if (!username || !password) {
      errEl.textContent = "Completá los campos.";
      return;
    }

    const btn = document.getElementById("btn-login");
    btn.disabled = true;
    btn.textContent = "...";

    try {
      const data = await api.auth.login(username, password);
      saveSession(data);
      initApp();
    } catch (e) {
      errEl.textContent = e.message;
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  });

  // Enter key en login
  ["login-username", "login-password"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("btn-login").click();
    });
  });

  // Logout
  document.getElementById("btn-logout").addEventListener("click", () => {
    clearSession();
    location.reload();
  });
}
