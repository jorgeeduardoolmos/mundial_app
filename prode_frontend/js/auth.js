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

  // Registro
  document.getElementById("btn-register").addEventListener("click", async () => {
    const display_name = document.getElementById("reg-display").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const errEl = document.getElementById("register-error");
    errEl.textContent = "";

    if (!display_name || !username || !email || !password) {
      errEl.textContent = "Completá todos los campos.";
      return;
    }
    if (password !== confirm) {
      errEl.textContent = "Las contraseñas no coinciden.";
      return;
    }

    const btn = document.getElementById("btn-register");
    btn.disabled = true;
    btn.textContent = "...";

    try {
      const data = await api.auth.register(username, email, password, display_name);
      saveSession(data);
      initApp();
    } catch (e) {
      errEl.textContent = e.message;
    } finally {
      btn.disabled = false;
      btn.textContent = "Crear Jugador";
    }
  });

  // Switch login ↔ registro
  document.getElementById("goto-register").addEventListener("click", () => {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("register-error").textContent = "";
  });

  document.getElementById("goto-login").addEventListener("click", () => {
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("login-error").textContent = "";
  });

  // Logout
  document.getElementById("btn-logout").addEventListener("click", () => {
    clearSession();
    location.reload();
  });
}
