/* ── GRUPOS ──────────────────────────────────────────────────────────── */
async function renderGrupos(el) {
  el.innerHTML = `<div class="loading">Cargando grupos...</div>`;

  try {
    const groups = await api.groups.list();
    const session = getSession();

    el.innerHTML = `
      <div class="page-title">Mis grupos</div>
      <div class="page-sub">Mundial 2026</div>
      <div id="groups-list"></div>

      <!-- Unirse con link -->
      <div class="group-card" style="margin-bottom:12px;">
        <div style="font-size:12px;font-weight:500;color:#f5f0ff;margin-bottom:8px;">Unirme a un grupo</div>
        <div style="font-size:11px;color:#5a5488;margin-bottom:10px;">Pegá el link de invitación que te compartieron</div>
        <div style="display:flex;gap:8px;">
          <input type="text" class="input-field" id="invite-input"
            placeholder="https://mundial-app-prode-frontend.vercel.app/?invite=..."
            style="flex:1;font-size:12px;padding:9px 12px;">
          <button class="btn-primary" id="btn-join" style="padding:9px 16px;font-size:11px;letter-spacing:1px;white-space:nowrap;">
            Unirme
          </button>
        </div>
        <div id="join-msg" style="font-size:11px;margin-top:8px;min-height:14px;"></div>
      </div>

      <div id="create-group-section"></div>
    `;

    // Listener unirse
    document.getElementById("btn-join").addEventListener("click", async () => {
      const val = document.getElementById("invite-input").value.trim();
      const msgEl = document.getElementById("join-msg");
      msgEl.textContent = "";

      // Extraer token del link o usar directo
      let token = val;
      try {
        const url = new URL(val);
        token = url.searchParams.get("invite") || val;
      } catch {}

      if (!token) {
        msgEl.style.color = "#c04040";
        msgEl.textContent = "Pegá un link de invitación válido.";
        return;
      }

      const btn = document.getElementById("btn-join");
      btn.disabled = true;
      try {
        const res = await api.groups.join(token);
        msgEl.style.color = "#F0C38E";
        msgEl.textContent = `¡Te uniste a "${res.group_name}"!`;
        document.getElementById("invite-input").value = "";
        setTimeout(() => renderGrupos(el), 900);
      } catch (e) {
        msgEl.style.color = "#c04040";
        msgEl.textContent = e.message;
        btn.disabled = false;
      }
    });

    // Enter en el input
    document.getElementById("invite-input").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("btn-join").click();
    });

    // Lista de grupos
    const listEl = document.getElementById("groups-list");
    if (groups.length) {
      for (const g of groups) {
        const members = await api.groups.members(g.id);
        listEl.appendChild(buildGroupCard(g, members, session));
      }
    } else {
      listEl.innerHTML = `<div class="empty" style="margin-bottom:16px;"><p>Todavía no pertenecés a ningún grupo.</p></div>`;
    }

    // Crear grupo
    document.getElementById("create-group-section").innerHTML = `
      <div id="create-group-form" class="hidden" style="margin-bottom:12px;">
        <div class="group-card">
          <div class="input-group">
            <div class="input-label">Nombre del grupo</div>
            <input type="text" class="input-field" id="new-group-name" placeholder="Ej: Los del trabajo">
          </div>
          <div class="input-group">
            <div class="input-label">Descripción (opcional)</div>
            <input type="text" class="input-field" id="new-group-desc" placeholder="">
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <button class="btn-primary" id="btn-create-confirm" style="flex:1;padding:10px;">Crear grupo</button>
            <button class="btn-ghost" id="btn-create-cancel">Cancelar</button>
          </div>
          <div id="create-group-error" style="font-size:11px;color:#c04040;margin-top:8px;"></div>
        </div>
      </div>
      <button class="btn-ghost w-full" id="btn-show-create" style="padding:10px;">+ Crear nuevo grupo</button>
    `;

    document.getElementById("btn-show-create").addEventListener("click", () => {
      document.getElementById("create-group-form").classList.remove("hidden");
      document.getElementById("btn-show-create").classList.add("hidden");
      document.getElementById("new-group-name").focus();
    });

    document.getElementById("btn-create-cancel").addEventListener("click", () => {
      document.getElementById("create-group-form").classList.add("hidden");
      document.getElementById("btn-show-create").classList.remove("hidden");
    });

    document.getElementById("btn-create-confirm").addEventListener("click", async () => {
      const name = document.getElementById("new-group-name").value.trim();
      const desc = document.getElementById("new-group-desc").value.trim();
      const errEl = document.getElementById("create-group-error");
      errEl.textContent = "";
      if (!name) { errEl.textContent = "El nombre es requerido."; return; }
      const btn = document.getElementById("btn-create-confirm");
      btn.disabled = true;
      try {
        await api.groups.create(name, desc);
        showToast(`Grupo "${name}" creado`);
        renderGrupos(el);
      } catch (e) {
        errEl.textContent = e.message;
        btn.disabled = false;
      }
    });

  } catch (e) {
    el.innerHTML = `<div class="empty"><p>${e.message}</p></div>`;
  }
}

function buildGroupCard(group, members, session) {
  const isOwner = group.owner_id === session.user_id;
  const card = document.createElement("div");
  card.className = "group-card";

  const visibleMembers = members.slice(0, 4);
  const extra = members.length - visibleMembers.length;

  const chipsHtml = visibleMembers.map(m => {
    const isMe = m.id === session.user_id;
    const bg = isMe ? "background:#F0C38E15;color:#F0C38E;" : "background:#4a4578;color:#4d6d82;";
    return `
      <div class="member-chip">
        <div class="member-chip-av" style="${bg}">${getInitials(m.display_name)}</div>
        <div class="member-chip-name">${m.display_name.split(" ")[0]}</div>
      </div>`;
  }).join("") + (extra > 0 ? `
    <div class="member-chip">
      <div class="member-chip-av" style="background:#2a2548;color:#4a4578;">+${extra}</div>
    </div>` : "");

  const ownerBadge = isOwner ? ' <span style="font-size:9px;color:#F0C38E;">creado por vos</span>' : "";

  card.innerHTML = `
    <div class="group-name">${group.name}</div>
    <div class="group-meta">${members.length} miembro${members.length !== 1 ? "s" : ""}${ownerBadge}</div>
    <div class="members-row">${chipsHtml}</div>
    <div class="divider-fade"></div>
    <div class="section-head">Link de invitación</div>
    <div class="invite-box">
      <span class="invite-url" id="invite-url-${group.id}">${group.invite_url}</span>
      <span class="invite-copy" id="copy-btn-${group.id}">
        <i class="ti ti-copy" aria-hidden="true"></i> copiar
      </span>
    </div>
    ${isOwner ? `
    <button class="btn-ghost" id="regen-btn-${group.id}" style="margin-top:8px;font-size:10px;padding:5px 10px;">
      <i class="ti ti-refresh" aria-hidden="true"></i> Regenerar link
    </button>` : ""}
  `;

  card.querySelector(`#copy-btn-${group.id}`).addEventListener("click", () => {
    navigator.clipboard.writeText(group.invite_url)
      .then(() => showToast("Link copiado"))
      .catch(() => showToast("No se pudo copiar"));
  });

  if (isOwner) {
    card.querySelector(`#regen-btn-${group.id}`).addEventListener("click", async () => {
      try {
        const res = await api.groups.regenerate(group.id);
        document.getElementById(`invite-url-${group.id}`).textContent = res.invite_url;
        group.invite_url = res.invite_url;
        showToast("Link regenerado");
      } catch (e) {
        showToast("Error: " + e.message);
      }
    });
  }

  return card;
}
