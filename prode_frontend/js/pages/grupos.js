/* ── GRUPOS — Floodlight ─────────────────────────────────────────────── */

async function renderGrupos(el) {
  injectFloodlightStyles();
  el.innerHTML = `<div class="fl-page">${flLoading()}</div>`;

  try {
    const groups = await api.groups.list();
    const session = getSession();

    el.innerHTML = `<div class="fl-page">
      <div style="position:absolute;top:-100px;right:-200px;width:500px;height:500px;background:radial-gradient(circle,rgba(212,255,63,0.06),transparent 60%);pointer-events:none;"></div>
      ${flPageTitle('GRUPOS','MUNDIAL 2026')}

      <div id="groups-list" style="display:flex;flex-direction:column;gap:16px;margin-bottom:24px;"></div>

      <div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:24px;margin-bottom:16px;">
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;text-transform:uppercase;letter-spacing:0.02em;margin-bottom:6px;">Unirme a un grupo</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.35);letter-spacing:0.06em;margin-bottom:14px;">Pegá el link de invitación que te compartieron</div>
        <div style="display:flex;gap:10px;">
          <input type="text" id="invite-input"
            placeholder="https://.../?invite=..."
            style="flex:1;min-width:0;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#F4F5FF;letter-spacing:0.04em;outline:none;"
            onfocus="this.style.borderColor='rgba(212,255,63,0.4)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'">
          <button id="btn-join"
            style="background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;padding:10px 20px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:14px;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;white-space:nowrap;flex-shrink:0;">
            Unirme
          </button>
        </div>
        <div id="join-msg" style="font-family:'JetBrains Mono',monospace;font-size:11px;margin-top:10px;min-height:14px;letter-spacing:0.04em;"></div>
      </div>

      <div id="create-group-section"></div>
    </div>`;

    const joinBtn = document.getElementById("btn-join");
    joinBtn.addEventListener("click", async () => {
      const val = document.getElementById("invite-input").value.trim();
      const msgEl = document.getElementById("join-msg");
      msgEl.textContent = "";

      let token = val;
      try {
        const url = new URL(val);
        token = url.searchParams.get("invite") || val;
      } catch {}

      if (!token) {
        msgEl.style.color = "#FF5C4D";
        msgEl.textContent = "Pegá un link de invitación válido.";
        return;
      }

      joinBtn.disabled = true;
      try {
        const res = await api.groups.join(token);
        msgEl.style.color = "#D4FF3F";
        msgEl.textContent = `¡Te uniste a "${escHtml(res.group_name)}"!`;
        document.getElementById("invite-input").value = "";
        setTimeout(() => renderGrupos(el), 900);
      } catch (e) {
        msgEl.style.color = "#FF5C4D";
        msgEl.textContent = escHtml(e.message);
        joinBtn.disabled = false;
      }
    });

    document.getElementById("invite-input").addEventListener("keydown", e => {
      if (e.key === "Enter") joinBtn.click();
    });

    const listEl = document.getElementById("groups-list");
    if (groups.length) {
      for (const g of groups) {
        const members = await api.groups.members(g.id);
        listEl.appendChild(buildGroupCard(g, members, session));
      }
    } else {
      listEl.innerHTML = `<div style="background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:40px;text-align:center;">
        <div style="font-size:28px;margin-bottom:12px;">👥</div>
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;text-transform:uppercase;margin-bottom:8px;">Todavía no tenés grupos</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(244,245,255,0.35);letter-spacing:0.06em;">Uníte con un link o creá tu propio grupo.</div>
      </div>`;
    }

    document.getElementById("create-group-section").innerHTML = `
      <div id="create-group-form" style="display:none;background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:24px;margin-bottom:16px;">
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:18px;color:#F4F5FF;text-transform:uppercase;margin-bottom:18px;">Nuevo grupo</div>
        <div style="margin-bottom:12px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.35);letter-spacing:0.1em;margin-bottom:6px;">NOMBRE DEL GRUPO</div>
          <input type="text" id="new-group-name" placeholder="Ej: Los del trabajo"
            style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#F4F5FF;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='rgba(212,255,63,0.4)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'">
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.35);letter-spacing:0.1em;margin-bottom:6px;">DESCRIPCIÓN (OPCIONAL)</div>
          <input type="text" id="new-group-desc" placeholder=""
            style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#F4F5FF;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='rgba(212,255,63,0.4)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'">
        </div>
        <div style="display:flex;gap:10px;">
          <button id="btn-create-confirm"
            style="flex:1;background:#D4FF3F;color:#0A0B1E;border:none;border-radius:10px;padding:12px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;">
            Crear grupo
          </button>
          <button id="btn-create-cancel"
            style="background:rgba(255,255,255,0.05);color:rgba(244,245,255,0.55);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 18px;font-family:'JetBrains Mono',monospace;font-size:12px;cursor:pointer;white-space:nowrap;">
            Cancelar
          </button>
        </div>
        <div id="create-group-error" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#FF5C4D;margin-top:10px;min-height:14px;"></div>
      </div>
      <button id="btn-show-create"
        style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:15px;color:rgba(244,245,255,0.45);text-transform:uppercase;letter-spacing:0.04em;cursor:pointer;transition:background 0.15s;"
        onmouseover="this.style.background='rgba(255,255,255,0.07)'" onmouseout="this.style.background='rgba(255,255,255,0.04)'">
        + Crear nuevo grupo
      </button>
    `;

    document.getElementById("btn-show-create").addEventListener("click", () => {
      document.getElementById("create-group-form").style.display = "block";
      document.getElementById("btn-show-create").style.display = "none";
      document.getElementById("new-group-name").focus();
    });

    document.getElementById("btn-create-cancel").addEventListener("click", () => {
      document.getElementById("create-group-form").style.display = "none";
      document.getElementById("btn-show-create").style.display = "block";
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
        errEl.textContent = escHtml(e.message);
        btn.disabled = false;
      }
    });

  } catch (e) {
    el.innerHTML = `<div class="fl-page">${flPageTitle('GRUPOS','MUNDIAL 2026')}<div style="color:#FF5C4D;font-family:'JetBrains Mono',monospace;font-size:13px;padding:24px;text-align:center;">${escHtml(e.message)}</div></div>`;
  }
}

function buildGroupCard(group, members, session) {
  const isOwner = group.owner_id === session.user_id;
  const card = document.createElement("div");
  card.style.cssText = "background:#14172E;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;";

  const shown = members.slice(0, 6);
  const extra = members.length - shown.length;

  const memberChips = shown.map(m => {
    const isMe = m.id === session.user_id;
    const initials = getInitials(m.display_name);
    const firstName = m.display_name.split(" ")[0];
    const palette = ['#7BB4FF','#3B5BFF','#FF5C4D','#FFD23F','#00C46B','#FF7A1A','#C2185B'];
    let h = 0; for (const c of firstName) h = (h*31+c.charCodeAt(0))&0x7fffffff;
    const bg = isMe ? '#D4FF3F' : palette[h % palette.length];
    const fg = isMe ? '#0A0B1E' : (bg === '#FFD23F' || bg === '#F4F5FF' ? '#0A0B1E' : '#F4F5FF');
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
      <div style="width:36px;height:36px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:900;font-size:13px;color:${fg};flex-shrink:0;${isMe?'box-shadow:0 0 0 2px #0A0B1E,0 0 0 4px #D4FF3F;':''}">
        ${escHtml(initials)}
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:${isMe?'#D4FF3F':'rgba(244,245,255,0.45)'};letter-spacing:0.04em;max-width:42px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;">${escHtml(firstName)}</div>
    </div>`;
  }).join("");

  const extraChip = extra > 0
    ? `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:12px;color:rgba(244,245,255,0.35);">+${extra}</div>
       </div>`
    : "";

  const ownerBadge = isOwner
    ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#D4FF3F;background:rgba(212,255,63,0.1);border:1px solid rgba(212,255,63,0.2);padding:2px 8px;border-radius:4px;letter-spacing:0.06em;flex-shrink:0;">TU GRUPO</span>`
    : "";

  card.innerHTML = `
    <div style="padding:20px 22px 18px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px;">
        <div style="font-family:'Big Shoulders Display',system-ui;font-weight:800;font-size:22px;color:#F4F5FF;text-transform:uppercase;letter-spacing:0.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(group.name)}</div>
        ${ownerBadge}
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.32);letter-spacing:0.1em;margin-bottom:18px;">${members.length} MIEMBRO${members.length !== 1 ? 'S' : ''}</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">${memberChips}${extraChip}</div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.06);padding:16px 22px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.32);letter-spacing:0.1em;margin-bottom:8px;">LINK DE INVITACIÓN</div>
      <div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 14px;">
        <span id="invite-url-${group.id}" style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(244,245,255,0.45);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;">${escHtml(group.invite_url)}</span>
        <button id="copy-btn-${group.id}"
          style="background:#D4FF3F;color:#0A0B1E;border:none;border-radius:7px;padding:5px 12px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;letter-spacing:0.04em;">
          COPIAR
        </button>
      </div>
      ${isOwner ? `<button id="regen-btn-${group.id}"
        style="margin-top:8px;background:transparent;border:none;color:rgba(244,245,255,0.22);font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;padding:4px 0;letter-spacing:0.06em;">
        ↺ Regenerar link
      </button>` : ""}
    </div>
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
        document.getElementById(`invite-url-${group.id}`).textContent = escHtml(res.invite_url);
        group.invite_url = res.invite_url;
        showToast("Link regenerado");
      } catch (e) {
        showToast("Error: " + e.message);
      }
    });
  }

  return card;
}
