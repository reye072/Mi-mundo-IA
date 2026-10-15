// ==========================================
// ESTADO GLOBAL Y DATOS DE LA PLATAFORMA
// ==========================================
let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 50,
  zaps: 100,
  isVIP: false,
  gamesCount: 0,
  memoryText: "",
  currentModel: "Vanilla V3",
  adultMode: false
};

// Base de datos masiva con mundos de franquicias oficiales
const worldsDatabase = [
  {
    id: "mha",
    title: "My Hero Academia",
    genre: "anime",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    desc: "Un mundo donde el 80% de la población posee superpoderes llamados 'Quirks'. Conviértete en héroe profesional o únete a la Liga de Villanos.",
    characters: [
      { name: "Katsuki Bakugo", role: "Rival explosivo", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200" },
      { name: "Shoto Todoroki", role: "Mitad Fuego / Mitad Hielo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
      { name: "Himiko Toga", role: "Villana impredecible", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" }
    ]
  },
  {
    id: "twd",
    title: "The Walking Dead",
    genre: "terror",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    desc: "El mundo ha caído ante una pandemia zombie. Los muertos caminan y los vivos son la verdadera amenaza. ¿Podrás sobrevivir?",
    characters: [
      { name: "Daryl Dixon", role: "Ballestero solitario", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
      { name: "Maggie Rhee", role: "Lideresa de Hilltop", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" },
      { name: "Negan Smith", role: "Líder de los Salvadores", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }
    ]
  },
  {
    id: "naruto",
    title: "Naruto Shippuden",
    genre: "anime",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
    desc: "Aldeas ocultas, guerras ninja, jutsus legendarios y bestias con colas. Forja tu propio camino ninja en el País del Fuego.",
    characters: [
      { name: "Kakashi Hatake", role: "Ninja Copión", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200" },
      { name: "Uchiha Sasuke", role: "Vengador sombrío", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" },
      { name: "Tsunade Senju", role: "Quinta Hokage", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" }
    ]
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk Edge",
    genre: "series",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
    desc: "Neon, implantes cibernéticos y corporaciones corruptas en Night City. Sobrevive al límite de la psicosis cibernética.",
    characters: [
      { name: "Lucy Kushinada", role: "Netrunner experta", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200" },
      { name: "David Martinez", role: "Mercenario novato", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200" }
    ]
  }
];

let activeWorld = null;
let activePartidas = [];
let communityIdeas = [
  { text: "Añadir modo multijugador en tiempo real para chatear con amigas", votes: 42 },
  { text: "Más avatares oficiales de anime y manhwas", votes: 31 }
];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderWorlds(worldsDatabase);
  updateUI();
  renderCommunityIdeas();
  
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }
  
  const userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});

// ==========================================
// CONTROL DE UI Y VISTAS
// ==========================================
function switchTab(tabId) {
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  
  if (tabId === 'explore') {
    document.getElementById("view-explore").classList.add("active");
  } else if (tabId === 'profile') {
    document.getElementById("view-profile").classList.add("active");
  } else if (tabId === 'game') {
    document.getElementById("view-game").classList.add("active");
  }
  updateUI();
}

function updateUI() {
  document.getElementById("turnsCount").textContent = userData.turns;
  document.getElementById("gamesCount").textContent = userData.gamesCount;
  document.getElementById("profileNameDisplay").textContent = userData.name;
  document.getElementById("profileDescDisplay").textContent = userData.desc;
  document.getElementById("profileAvatarDisplay").style.backgroundImage = `url('${userData.avatar}')`;
  
  const badge = document.getElementById("creatorStatusBadge");
  if (userData.isVIP) {
    badge.textContent = "Creadora VIP Verificada 👑";
    badge.style.background = "#FFD700";
    badge.style.color = "#333";
  } else {
    badge.textContent = "Cuenta Gratuita (Canjea un video para ser VIP)";
    badge.style.background = "#F3E8FF";
    badge.style.color = "var(--morado-oscuro)";
  }
}

// ==========================================
// EFECTO MÁGICO DE APERTURA DE PAPEL (REGALO)
// ==========================================
function openGiftAndEnter() {
  const modal = document.getElementById("giftModal");
  const modalBox = modal.querySelector(".modal-box");
  
  // Activa la animación de la carta desplegándose
  modalBox.classList.add("paper-opening-anim");
  modal.style.background = "rgba(107, 33, 168, 0)";

  setTimeout(() => {
    modal.style.display = "none";
    modalBox.classList.remove("paper-opening-anim");
    modal.style.background = "rgba(80, 20, 110, 0.85)";
  }, 600);

  userData.turns += 25;
  updateUI();
  switchTab('explore');
  
  setTimeout(() => {
    alert("🎁 ¡La carta mágica se ha abierto! Has recibido +25 turnos extra en SimulO.");
  }, 700);
}

// ==========================================
// MUNDOS Y FILTROS
// ==========================================
function renderWorlds(list) {
  const container = document.getElementById("worldsGridContainer");
  if (!container) return;
  
  container.innerHTML = "";
  list.forEach(w => {
    container.innerHTML += `
      <div class="world-card" onclick="openWorldDetail('${w.id}')">
        <div class="world-cover" style="background-image: url('${w.cover}');">
          <span class="world-tag">${w.genre.toUpperCase()}</span>
        </div>
        <div class="world-info">
          <h4>${w.title}</h4>
          <p>${w.desc.substring(0, 65)}...</p>
          <button class="btn-play">Explorar Mundo</button>
        </div>
      </div>
    `;
  });
}

function filterWorlds(genre) {
  document.querySelectorAll(".genre-chips .chip").forEach(c => c.classList.remove("active"));
  event.target.classList.add("active");
  
  if (genre === 'all') {
    renderWorlds(worldsDatabase);
  } else {
    const filtered = worldsDatabase.filter(w => w.genre === genre);
    renderWorlds(filtered);
  }
}

function searchWorlds() {
  const query = document.getElementById("worldSearchInput").value.toLowerCase();
  const filtered = worldsDatabase.filter(w => w.title.toLowerCase().includes(query) || w.desc.toLowerCase().includes(query));
  renderWorlds(filtered);
}

// ==========================================
// DETALLE DE MUNDO Y PARTIDAS
// ==========================================
function openWorldDetail(worldId) {
  activeWorld = worldsDatabase.find(w => w.id === worldId);
  if (!activeWorld) return;
  
  document.getElementById("detailTitle").textContent = activeWorld.title;
  document.getElementById("detailDesc").textContent = activeWorld.desc;
  document.getElementById("detailBanner").style.backgroundImage = `url('${activeWorld.cover}')`;
  
  const charContainer = document.getElementById("charactersList");
  charContainer.innerHTML = "";
  activeWorld.characters.forEach(c => {
    charContainer.innerHTML += `
      <div class="char-item-card">
        <div class="char-mini-avatar" style="background-image: url('${c.avatar}');"></div>
        <div>
          <h5>${c.name}</h5>
          <p style="font-size:0.72rem; color:var(--texto-muted);">${c.role}</p>
        </div>
      </div>
    `;
  });
  
  renderWorldPartidas();
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-world-detail").classList.add("active");
}

function renderWorldPartidas() {
  const listContainer = document.getElementById("worldPartidasList");
  if (!activeWorld) return;
  
  const worldPartidas = activePartidas.filter(p => p.worldId === activeWorld.id);
  if (worldPartidas.length === 0) {
    listContainer.innerHTML = `<p style="font-size:0.8rem; color:var(--texto-muted);">No tienes partidas activas en este mundo. ¡Crea una!</p>`;
    return;
  }
  
  listContainer.innerHTML = "";
  worldPartidas.forEach((p, idx) => {
    listContainer.innerHTML += `
      <div style="background:var(--bg-app); padding:12px; border-radius:12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h5 style="color:var(--morado-oscuro);">${p.name}</h5>
          <p style="font-size:0.75rem; color:var(--texto-muted);">Rol: ${p.role} | Edad: ${p.edad}</p>
        </div>
        <button class="creator-badge-btn" onclick="resumeGame(${idx})">Continuar ➔</button>
      </div>
    `;
  });
}

// ==========================================
// CONFIGURACIÓN Y INICIO DE PARTIDA
// ==========================================
function openSetupModal() { document.getElementById("setupModal").style.display = "flex"; }
function closeSetupModal() { document.getElementById("setupModal").style.display = "none"; }

function confirmStartSimulation() {
  const edad = document.getElementById("setupEdad").value || "18";
  const nombre = document.getElementById("setupNombre").value || userData.name;
  const prof = document.getElementById("setupProf").value || "Aventurera";
  const arma = document.getElementById("setupArma").value || "Ninguna";
  const relacion = document.getElementById("setupRelacion").value;
  const partidaName = document.getElementById("setupPartidaName").value || "Partida Nueva";
  
  if (userData.turns <= 0) {
    alert("¡No tienes suficientes turnos! Visita la tienda o comparte un video para recargar.");
    closeSetupModal();
    openShopModal();
    return;
  }
  
  const newPartida = {
    worldId: activeWorld.id,
    worldTitle: activeWorld.title,
    name: partidaName,
    edad,
    nombre,
    prof,
    arma,
    relacion,
    messages: [
      { sender: "system", text: `[Simulación iniciada en: ${activeWorld.title} | Modelo: ${userData.currentModel} | Dinámica: ${relacion}]` },
      { sender: "ai", text: `Te encuentras en las calles de ${activeWorld.title}. El ambiente es tenso y cada decisión cuenta. Te presentas como ${nombre}, ${prof}, de ${edad} años. ¿Qué haces ahora?` }
    ]
  };
  
  activePartidas.push(newPartida);
  userData.gamesCount++;
  userData.turns--;
  closeSetupModal();
  loadGameSession(newPartida);
  switchTab('game');
}

let currentActiveGame = null;
function loadGameSession(partidaObj) {
  currentActiveGame = partidaObj;
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  
  currentActiveGame.messages.forEach(m => {
    appendMessageUI(m.sender, m.text);
  });
}

function resumeGame(index) {
  const worldPartidas = activePartidas.filter(p => p.worldId === activeWorld.id);
  const target = worldPartidas[index];
  loadGameSession(target);
  switchTab('game');
}

// ==========================================
// CHAT E INTERACCIÓN CON IA
// ==========================================
function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  
  if (userData.turns <= 0) {
    alert("¡Te has quedado sin turnos! Abre la tienda o canjea un video en redes para continuar.");
    openShopModal();
    return;
  }
  
  userData.turns--;
  updateUI();
  
  appendMessageUI("user", text);
  if (currentActiveGame) {
    currentActiveGame.messages.push({ sender: "user", text });
  }
  
  input.value = "";
  
  setTimeout(() => {
    let aiReply = generateAIReply(text);
    appendMessageUI("ai", aiReply);
    if (currentActiveGame) {
      currentActiveGame.messages.push({ sender: "ai", text: aiReply });
    }
  }, 800);
}

function appendMessageUI(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "chat-msg user-bubble" : (sender === "system" ? "chat-msg system-bubble" : "chat-msg ai-bubble");
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function generateAIReply(userText) {
  if (userData.currentModel === 'Manzana Verde') {
    return `[Manzana Verde]: Analizando tu acción "${userText}". El entorno reacciona de forma directa y precisa a tu movimiento.`;
  } else if (userData.currentModel === 'Pimentón (Alta Tensión)') {
    return `[🔥 Pimentón]: ¡Peligro inminente! Ante "${userText}", la tensión se dispara y un giro inesperado altera por completo la escena.`;
  } else if (userData.currentModel === 'Enebro Storyworld') {
    return `[💜 Enebro]: Profundizando en los matices narrativos de tu elección ("${userText}"), los personajes observan cada uno de tus pasos con cautela.`;
  } else {
    return `[🪼 Vanilla V3]: Respondiendo fluidamente a tu acción. Las consecuencias de "${userText}" comienzan a manifestarse en el mundo.`;
  }
}

// ==========================================
// MODALES Y HERRAMIENTAS INMERSIVAS
// ==========================================
function openTutorialModal() { document.getElementById("tutorialModal").style.display = "flex"; }
function closeTutorialModal() { document.getElementById("tutorialModal").style.display = "none"; }

function openUnifiedCreation() { document.getElementById("creationUnifiedModal").style.display = "flex"; }
function closeUnifiedCreation() { document.getElementById("creationUnifiedModal").style.display = "none"; }

function openJellyfishModelsModal() { document.getElementById("jellyfishModelsModal").style.display = "flex"; }
function closeJellyfishModelsModal() { document.getElementById("jellyfishModelsModal").style.display = "none"; }

function selectModel(modelName) {
  userData.currentModel = modelName;
  closeJellyfishModelsModal();
  alert(`✨ Modelo cambiado exitosamente a: ${modelName}`);
}

function openMemoryModal() {
  document.getElementById("memoryTextInput").value = userData.memoryText;
  updateMemoryCount();
  document.getElementById("memoryModal").style.display = "flex";
}
function closeMemoryModal() { document.getElementById("memoryModal").style.display = "none"; }

function updateMemoryCount() {
  const val = document.getElementById("memoryTextInput").value;
  document.getElementById("memCharCount").textContent = `${val.length} / 1200 caracteres`;
}

function saveMemoryData() {
  userData.memoryText = document.getElementById("memoryTextInput").value;
  closeMemoryModal();
  alert("🧠 Memoria de la partida guardada y sincronizada con la IA.");
}

function openMarketModal() { document.getElementById("marketModal").style.display = "flex"; }
function closeMarketModal() { document.getElementById("marketModal").style.display = "none"; }

function openShopModal() { document.getElementById("shopModal").style.display = "flex"; }
function closeShopModal() { document.getElementById("shopModal").style.display = "none"; }

function openVerifyLinkModal() { document.getElementById("verifyLinkModal").style.display = "flex"; }
function closeVerifyLinkModal() { document.getElementById("verifyLinkModal").style.display = "none"; }

function openEditProfileModal() {
  document.getElementById("editNameInput").value = userData.name;
  document.getElementById("editAvatarInput").value = userData.avatar;
  document.getElementById("editDescInput").value = userData.desc;
  document.getElementById("editProfileModal").style.display = "flex";
}
function closeEditProfileModal() { document.getElementById("editProfileModal").style.display = "none"; }

function saveProfileChanges() {
  userData.name = document.getElementById("editNameInput").value || userData.name;
  userData.avatar = document.getElementById("editAvatarInput").value || userData.avatar;
  userData.desc = document.getElementById("editDescInput").value || userData.desc;
  closeEditProfileModal();
  updateUI();
  alert("✨ Perfil actualizado correctamente.");
}

// ==========================================
// VERIFICACIÓN DE VIDEOS Y PAGOS
// ==========================================
function submitVideoLink() {
  const link = document.getElementById("videoLinkInput").value.trim();
  if (!link) {
    alert("Por favor ingresa un enlace válido.");
    return;
  }
  
  if (link.includes("tiktok.com") || link.includes("instagram.com") || link.includes("youtube.com") || link.includes("youtu.be")) {
    userData.turns += 50;
    userData.isVIP = true;
    updateUI();
    closeVerifyLinkModal();
    alert("¡Video verificado con éxito! 🎉 +50 turnos añadidos y estatus Creadora VIP activado.");
    document.getElementById("videoLinkInput").value = "";
  } else {
    alert("El enlace no pertenece a una red social compatible (TikTok, Instagram o YouTube).");
  }
}

function watchAdReward() {
  alert("📺 Cargando anuncio corto patrocinado...");
  setTimeout(() => {
    userData.turns += 15;
    updateUI();
    alert("¡Recompensa reclamada! +15 turnos añadidos a tu cuenta.");
  }, 1000);
}

function submitCommunityIdea() {
  const input = document.getElementById("newIdeaInput");
  const val = input.value.trim();
  if (!val) return;
  
  communityIdeas.unshift({ text: val, votes: 1 });
  input.value = "";
  renderCommunityIdeas();
  alert("💡 ¡Idea enviada al buzón de la comunidad con éxito!");
}

function renderCommunityIdeas() {
  const container = document.getElementById("ideasCommunityList");
  if (!container) return;
  
  container.innerHTML = "";
  communityIdeas.forEach((item, idx) => {
    container.innerHTML += `
      <div style="background:var(--bg-app); padding:10px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
        <span>${item.text}</span>
        <button class="creator-badge-btn" onclick="voteIdea(${idx})" style="padding:4px 8px; font-size:0.7rem;">👍 ${item.votes}</button>
      </div>
    `;
  });
}

function voteIdea(idx) {
  communityIdeas[idx].votes++;
  renderCommunityIdeas();
}

function toggleAdultMode() {
  userData.adultMode = !userData.adultMode;
  if (userData.adultMode) {
    alert("🌙 [Modo Creativo Sin Censura activado].");
    document.getElementById("secretDotBtn").style.color = "var(--rosa-brillante)";
  } else {
    alert("☀️ [Modo Estándar activado].");
    document.getElementById("secretDotBtn").style.color = "var(--texto-muted)";
  }
}
  
