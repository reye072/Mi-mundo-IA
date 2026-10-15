const MASTER_API_KEY = typeof process !== 'undefined' && process.env && process.env.MASTER_API_KEY 
  ? process.env.MASTER_API_KEY 
  : "";

let turns = parseInt(localStorage.getItem("simulo_turns")) || 50;
let isCreator = localStorage.getItem("simulo_creator") === "true";
let isAdultMode = localStorage.getItem("simulo_adult") === "true";
let activeWorldKey = "jujutsu";
let messageHistory = [];
let userPartidas = JSON.parse(localStorage.getItem("simulo_partidas")) || [];

let userProfile = JSON.parse(localStorage.getItem("simulo_user_profile")) || {
  name: "Jugadora SimulO",
  avatar: "https://picsum.photos/100/100?random=99",
  desc: "Apasionada por los mundos de rol y simulación."
};

const mainWorlds = {
  jujutsu: {
    title: "Jujutsu Kaisen",
    category: "anime",
    desc: "Maldiciones y hechicería. Estás en el Colegio Técnico de Tokio junto a Satoru Gojo, Megumi, Itadori y Nobara.",
    banner: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NjgtMmFkIN00NTg5LThmYTItMmE5Y2ExOWVjODcxXkEyXkFqcGdeQXVyOTA3MTMyOTA@._V1_.jpg",
    chars: [
      { name: "Satoru Gojo", role: "Hechicero del Infinito", img: "https://m.media-amazon.com/images/M/MV5BNTBhNGZkZGEtMWEzMi00MThhLWExMWQtYWY4NmJmOWFlNjk0XkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Yuji Itadori", role: "Recipiente de Sukuna", img: "https://m.media-amazon.com/images/M/MV5BNmVmZWVlODYtYTE2Ni00Y2U4LTg4YjktYmU3YzgwODMwZDRhXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" }
    ],
    intro: `El aire en el Colegio Técnico de Hechicería de Tokio es pesado. Satoru Gojo te observa con una sonrisa y te da una palmada en el hombro.<br><br>— <i>"Muy bien, a partir de hoy formas parte de este equipo"</i>, dice con entusiasmo mientras Itadori y Megumi te miran atentos.<br><br><b>¿Qué haces o dices?</b>`
  },
  zombie: {
    title: "The Walking Dead",
    category: "terror",
    desc: "Sobrevive al apocalipsis zombie junto a Rick Grimes y Glenn Rhee.",
    banner: "https://m.media-amazon.com/images/M/MV5BMTM5MTM5NTM2MF5BMl5BanBnXkFtZTcwODg2OTgyOQ@@._V1_.jpg",
    chars: [
      { name: "Rick Grimes", role: "Líder táctico", img: "https://m.media-amazon.com/images/M/MV5BMjAxMzA5MzMxMF5BMl5BanBnXkFtZTcwNTI5OTM0OQ@@._V1_.jpg" },
      { name: "Glenn Rhee", role: "Explorador", img: "https://m.media-amazon.com/images/M/MV5BMjI3MzgwMTM1OF5BMl5BanBnXkFtZTgwNTM3Mzc5NzE@._V1_.jpg" }
    ],
    intro: `El mundo colapsó. Los caminantes dominan las calles de Atlanta y las provisiones escasean. Al doblar una esquina, te encuentras cara a cara con Glenn Rhee sosteniendo suministros.<br><br>— <i>"Ey, ten cuidado, hay ruidos extraños por aquí"</i>, te advierte con cautela.<br><br><b>¿Qué respondes?</b>`
  }
};

const worldsCatalog = { ...mainWorlds };

function expandCatalogTo200() {
  const animeList = ["Demon Slayer", "My Hero Academia", "Attack on Titan", "One Piece", "Bleach", "Chainsaw Man", "Death Note", "Haikyuu", "Dragon Ball Z", "Weak Hero Class", "Blue Lock", "Solo Leveling", "Bungou Stray Dogs"];
  const terrorList = ["Creepypastas", "El Conjuro", "Viernes 13", "Scream", "Resident Evil", "Silent Hill", "Five Nights at Freddy's", "Saw"];
  const novelasList = ["Oscura Obsesión", "El Amor del CEO", "Matrimonio Forzado", "Enemigos a Amantes", "Peligro en la Mafia", "Colegio Privado Elite"];

  let count = Object.keys(worldsCatalog).length;
  const buildBatch = (list, category) => {
    list.forEach((item) => {
      count++;
      const id = `world_${category}_${count}`;
      worldsCatalog[id] = {
        title: `${item}`,
        category: category,
        desc: `Simulación inmersiva e historia completa en el universo de ${item}.`,
        banner: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NjgtMmFkIN00NTg5LThmYTItMmE5Y2ExOWVjODcxXkEyXkFqcGdeQXVyOTA3MTMyOTA@._V1_.jpg",
        chars: [
          { name: `Protagonista (${item})`, role: "Personaje principal", img: "https://picsum.photos/100/100?random=301" }
        ],
        intro: `Te adentras en el mundo de <b>${item}</b>. Los eventos clave comienzan a desarrollarse a tu alrededor.<br><br><b>¿Qué decides hacer?</b>`
      };
    });
  };

  while (count < 200) {
    buildBatch(animeList, "anime");
    buildBatch(terrorList, "terror");
    buildBatch(novelasList, "novela");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  expandCatalogTo200();
  refreshUserStats();
  updateDotIndicator();
  renderProfileUI();
  renderWorldsGrid('all');

  // Contraseña para amigas (solo turnos infinitos)
  document.getElementById("creadoraBtn")?.addEventListener("click", () => {
    const code = prompt("Introduce tu clave de Creadora:");
    if (code === "Creadora_082012") {
      isCreator = true;
      localStorage.setItem("simulo_creator", "true");
      alert("🪼 ¡Modo Creadora Activado! Turnos ilimitados.");
      refreshUserStats();
    } else {
      alert("Contraseña errónea.");
    }
  });

  document.getElementById("sendBtn")?.addEventListener("click", postPlayerAction);
});

function openTutorialModal() {
  document.getElementById("tutorialModal").style.display = "flex";
}

function closeTutorialModal() {
  document.getElementById("tutorialModal").style.display = "none";
}

// Contraseña exclusiva solo para ti (Modo Adulto)
function toggleAdultMode() {
  const pass = prompt("Introduce tu clave secreta personal:");
  if (pass === "Secreto_Adulto2026") {
    isAdultMode = !isAdultMode;
    localStorage.setItem("simulo_adult", isAdultMode ? "true" : "false");
    updateDotIndicator();
    alert(isAdultMode ? "✨ Modo sin filtros exclusivo activo." : "🔒 Modo normal activo.");
  } else {
    alert("Contraseña incorrecta.");
  }
}

function updateDotIndicator() {
  const dot = document.getElementById("secretDotBtn");
  if (dot) {
    dot.style.color = isAdultMode ? "var(--morado-oscuro)" : "var(--texto-muted)";
  }
}

function renderProfileUI() {
  document.getElementById("profileNameDisplay").innerText = userProfile.name;
  document.getElementById("profileDescDisplay").innerText = userProfile.desc;
  document.getElementById("profileAvatarDisplay").style.backgroundImage = `url('${userProfile.avatar}')`;
}

function openEditProfileModal() {
  document.getElementById("editNameInput").value = userProfile.name;
  document.getElementById("editAvatarInput").value = userProfile.avatar;
  document.getElementById("editDescInput").value = userProfile.desc;
  document.getElementById("editProfileModal").style.display = "flex";
}

function closeEditProfileModal() {
  document.getElementById("editProfileModal").style.display = "none";
}

function saveProfileChanges() {
  userProfile.name = document.getElementById("editNameInput").value || "Jugadora";
  userProfile.avatar = document.getElementById("editAvatarInput").value || userProfile.avatar;
  userProfile.desc = document.getElementById("editDescInput").value || "";
  localStorage.setItem("simulo_user_profile", JSON.stringify(userProfile));
  renderProfileUI();
  closeEditProfileModal();
  alert("✨ ¡Perfil actualizado con éxito!");
}

function renderWorldsGrid(category) {
  const grid = document.getElementById("worldsGridContainer");
  if (!grid) return;

  const filteredKeys = Object.keys(worldsCatalog).filter(k => {
    if (category === 'all') return true;
    return worldsCatalog[k].category === category;
  });

  grid.innerHTML = filteredKeys.map(key => {
    const w = worldsCatalog[key];
    return `
      <div class="world-bubble-card" onclick="openWorldDetail('${key}')">
        <div class="bubble-banner" style="background-image: url('${w.banner}');">
          <span class="bubble-badge">🪼 200+ Mundos</span>
        </div>
        <div class="bubble-info">
          <h4>${w.title}</h4>
          <p>${w.desc.substring(0, 42)}...</p>
        </div>
      </div>
    `;
  }).join("");
}

function filterWorlds(category) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");
  renderWorldsGrid(category);
}

function switchTab(targetId) {
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  if (targetId === 'explore') document.getElementById("view-explore")?.classList.add("active");
  if (targetId === 'history') {
    document.getElementById("view-history")?.classList.add("active");
    renderGameHistory();
  }
  if (targetId === 'profile') document.getElementById("view-profile")?.classList.add("active");
}

function openWorldDetail(key) {
  activeWorldKey = key;
  const item = worldsCatalog[key];
  
  document.getElementById("detailTitle").innerText = item.title;
  document.getElementById("detailDesc").innerText = item.desc;
  document.getElementById("detailBanner").style.backgroundImage = `url('${item.banner}')`;
  document.getElementById("setupPartidaName").value = item.title;

  const listContainer = document.getElementById("charactersList");
  listContainer.innerHTML = item.chars.map(ch => `
    <div class="char-item-card">
      <div class="char-avatar-box" style="background-image: url('${ch.img}');"></div>
      <div>
        <h5>${ch.name}</h5>
        <span style="font-size:0.75rem; color:var(--texto-muted);">${ch.role}</span>
      </div>
    </div>
  `).join("");

  renderWorldPartidasList();

  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-world-detail")?.classList.add("active");
}

function openSetupModal() {
  if (turns <= 0 && !isCreator) {
    alert("¡Turnos agotados! Visita la tienda para recargar gratis.");
    openShopModal();
    return;
  }
  document.getElementById("setupModal").style.display = "flex";
}

function closeSetupModal() {
  document.getElementById("setupModal").style.display = "none";
}

function confirmStartSimulation() {
  closeSetupModal();
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-game")?.classList.add("active");
  
  const world = worldsCatalog[activeWorldKey];
  const partidaName = document.getElementById("setupPartidaName").value || world.title;
  const relacionVal = document.getElementById("setupRelacion").value;

  let extraNote = "";
  if (relacionVal === "bl") extraNote = "<br><br><i>[Modo BL / Chicos activo]</i>";
  if (relacionVal === "lesbian") extraNote = "<br><br><i>[Modo Lesbianas / Chicas activo]</i>";

  messageHistory = [
    { id: Date.now(), sender: "bot", text: world.intro + extraNote }
  ];

  userPartidas.unshift({
    id: Date.now(),
    worldKey: activeWorldKey,
    title: partidaName,
    date: new Date().toLocaleDateString(),
    turnos: 1
  });
  localStorage.setItem("simulo_partidas", JSON.stringify(userPartidas));

  renderChatViewport();
}

function renderWorldPartidasList() {
  const container = document.getElementById("worldPartidasList");
  if (!container) return;

  const currentWorldPartidas = userPartidas.filter(p => p.worldKey === activeWorldKey);
  if (currentWorldPartidas.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:var(--texto-muted);">Aún no hay partidas en este mundo.</p>`;
    return;
  }

  container.innerHTML = currentWorldPartidas.map(p => `
    <div class="char-item-card" style="justify-content: space-between; margin-bottom: 8px;">
      <div>
        <h5>${p.title}</h5>
        <span style="font-size:0.75rem; color:var(--texto-muted);">Turno ${p.turnos} • ${p.date}</span>
      </div>
      <button class="action-icon-btn delete" onclick="deletePartida(${p.id})">🗑️ Borrar</button>
    </div>
  `).join("");
}

function renderChatViewport() {
  const viewport = document.getElementById("chatBox");
  if (!viewport) return;
  const world = worldsCatalog[activeWorldKey];

  viewport.innerHTML = messageHistory.map((msg, index) => {
    if (msg.sender === "user") {
      return `
        <div class="user-msg-card">
          <div class="msg-header-user">${userProfile.name} (TU JUGADA)</div>
          <div class="user-msg-text">${msg.text}</div>
          <div class="msg-actions">
            <button class="action-icon-btn" onclick="editMessage(${index})">✏️ Editar</button>
            <button class="action-icon-btn delete" onclick="deleteMessage(${index})">🗑️ Borrar</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="bot-msg-card">
          <div class="msg-header-bot">
            <span>RESPUESTA DEL MUNDO</span>
            <span style="font-weight:normal; font-size:0.7rem; color:var(--texto-muted);">${world.title}</span>
          </div>
          <div class="bot-msg-text">${msg.text}</div>
          <div class="msg-actions">
            <button class="action-icon-btn" onclick="editMessage(${index})">✏️ Editar</button>
            <button class="action-icon-btn delete" onclick="deleteMessage(${index})">🗑️ Borrar</button>
          </div>
        </div>
      `;
    }
  }).join("");

  viewport.scrollTop = viewport.scrollHeight;
}

async function postPlayerAction() {
  const inputField = document.getElementById("userInput");
  if (!inputField) return;
  const userText = inputField.value.trim();
  if (!userText) return;

  if (!isCreator) {
    turns--;
    localStorage.setItem("simulo_turns", turns);
    refreshUserStats();
  }

  messageHistory.push({ id: Date.now(), sender: "user", text: userText });
  inputField.value = "";
  renderChatViewport();

  setTimeout(() => {
    const world = worldsCatalog[activeWorldKey];
    const botReply = `El entorno reacciona a tus palabras y acciones. Los personajes presentes analizan tu jugada y la trama de <b>${world.title}</b> avanza con naturalidad según tus decisiones.<br><br><b>¿Cómo deseas continuar?</b>`;
    messageHistory.push({ id: Date.now(), sender: "bot", text: botReply });
    renderChatViewport();
  }, 900);
}

function editMessage(index) {
  const currentText = messageHistory[index].text.replace(/<br>/g, "\n");
  const newText = prompt("Edita el mensaje:", currentText);
  if (newText !== null && newText.trim() !== "") {
    messageHistory[index].text = newText.trim().replace(/\n/g, "<br>");
    renderChatViewport();
  }
}

function deleteMessage(index) {
  if (confirm("¿Deseas eliminar este mensaje?")) {
    messageHistory.splice(index, 1);
    renderChatViewport();
  }
}

function deletePartida(id) {
  userPartidas = userPartidas.filter(p => p.id !== id);
  localStorage.setItem("simulo_partidas", JSON.stringify(userPartidas));
  renderWorldPartidasList();
}

function refreshUserStats() {
  const displayVal = isCreator ? "∞" : turns;
  const turnsCount = document.getElementById("turnsCount");
  const gameTurnsCounter = document.getElementById("gameTurnsCounter");
  
  if (turnsCount) turnsCount.innerText = displayVal;
  if (gameTurnsCounter) gameTurnsCounter.innerText = `Turnos: ${displayVal}`;
}

function openShopModal() {
  document.getElementById("shopModal").style.display = "flex";
}

function closeShopModal() {
  document.getElementById("shopModal").style.display = "none";
}

function watchAdReward() {
  alert("🪼 ¡Anuncio completado! +15 turnos añadidos.");
  turns += 15;
  localStorage.setItem("simulo_turns", turns);
  refreshUserStats();
  closeShopModal();
}

function renderGameHistory() {
  const historyBox = document.getElementById("historyList");
  if (historyBox) {
    if (userPartidas.length === 0) {
      historyBox.innerHTML = `<p style="font-size:0.85rem; color:var(--texto-muted); text-align:center;">Aún no hay partidas guardadas.</p>`;
      return;
    }
    historyBox.innerHTML = userPartidas.map(p => `
      <div class="char-item-card" style="justify-content: space-between; margin-bottom: 10px; cursor:pointer;" onclick="openWorldDetail('${p.worldKey}')">
        <div>
          <h5>${p.title}</h5>
          <p style="font-size:0.75rem; color:var(--texto-muted);">Turno ${p.turnos} • ${p.date}</p>
        </div>
        <button class="action-icon-btn delete" onclick="event.stopPropagation(); deletePartida(${p.id})">🗑️ Borrar</button>
      </div>
    `).join("");
  }
        }
    
