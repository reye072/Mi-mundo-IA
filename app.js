// ==========================================
// ESTADO GLOBAL Y DATOS DE LA PLATAFORMA
// ==========================================
let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 100,
  isVIP: false,
  gamesCount: 0,
  memoryText: "",
  currentModel: "Vanilla V3",
  adultMode: false
};

// Base de datos masiva de mundos
let worldsDatabase = [
  {
    id: "mha",
    title: "My Hero Academia",
    genre: "anime",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    desc: "Un mundo donde el 80% de la población posee superpoderes llamados 'Quirks'. Conviértete en héroe profesional o únete a la Liga de Villanos.",
    characters: [
      { name: "Katsuki Bakugo", role: "Rival explosivo", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200" },
      { name: "Shoto Todoroki", role: "Mitad Fuego / Mitad Hielo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" }
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
      { name: "Kakashi Hatake", role: "Ninja Copión", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200" }
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
      { name: "Daryl Dixon", role: "Ballestero solitario", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" }
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
      { name: "Lucy Kushinada", role: "Netrunner experta", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200" }
    ]
  },
  {
    id: "novela-amor",
    title: "Pecados de la Alta Sociedad",
    genre: "novela",
    author: "Oficial SimulO",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
    desc: "Una apasionante novela de romances prohibidos, secretos familiares y traiciones en una mansión de lujo.",
    characters: [
      { name: "Alexander Wright", role: "Magnate misterioso", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }
    ]
  }
];

let activeWorld = null;
let activePartidas = [];
let communityIdeas = [
  { text: "Añadir modo multijugador en tiempo real para chatear con amigas", votes: 42 }
];

// EJECUCIÓN AL CARGAR
document.addEventListener("DOMContentLoaded", () => {
  renderWorlds(worldsDatabase);
  updateUI();
  renderCommunityIdeas();
  
  const giftModal = document.getElementById("giftModal");
  if (giftModal) {
    giftModal.addEventListener("click", openGiftAndEnter);
    giftModal.addEventListener("touchend", openGiftAndEnter);
  }

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
});

// APERTURA DEL REGALO
function openGiftAndEnter(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById("giftModal");
  if (modal) {
    modal.style.display = "none";
  }
  userData.turns += 25;
  updateUI();
  switchTab('explore');
}

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
  const turnsEl = document.getElementById("turnsCount");
  const gamesEl = document.getElementById("gamesCount");
  const nameEl = document.getElementById("profileNameDisplay");
  const descEl = document.getElementById("profileDescDisplay");
  const avatarEl = document.getElementById("profileAvatarDisplay");
  
  if (turnsEl) turnsEl.textContent = userData.turns;
  if (gamesEl) gamesEl.textContent = userData.gamesCount;
  if (nameEl) nameEl.textContent = userData.name;
  if (descEl) descEl.textContent = userData.desc;
  if (avatarEl) avatarEl.style.backgroundImage = `url('${userData.avatar}')`;
}

function renderWorlds(list) {
  const container = document.getElementById("worldsGridContainer");
  if (!container) return;
  
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--texto-muted); padding:20px; grid-column: 1/-1;">No se encontraron mundos con ese nombre.</p>`;
    return;
  }
  
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
  if (event && event.target) event.target.classList.add("active");
  
  if (genre === 'all') {
    renderWorlds(worldsDatabase);
  } else {
    const filtered = worldsDatabase.filter(w => w.genre === genre);
    renderWorlds(filtered);
  }
}

function searchWorlds() {
  const query = document.getElementById("worldSearchInput").value.toLowerCase().trim();
  const filtered = worldsDatabase.filter(w => 
    w.title.toLowerCase().includes(query) || 
    w.genre.toLowerCase().includes(query) || 
    w.desc.toLowerCase().includes(query)
  );
  renderWorlds(filtered);
}

function openWorldDetail(worldId) {
  activeWorld = worldsDatabase.find(w => w.id === worldId);
  if (!activeWorld) return;
  
  document.getElementById("detailTitle").textContent = activeWorld.title;
  document.getElementById("detailDesc").textContent = activeWorld.desc;
  document.getElementById("detailBanner").style.backgroundImage = `url('${activeWorld.cover}')`;
  
  const charContainer = document.getElementById("charactersList");
  if (charContainer) {
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
  }
  
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-world-detail").classList.add("active");
}

// ==========================================
// CREACIÓN PERSONALIZADA DE MUNDOS 🌍
// ==========================================
function openCreateWorldModal() {
  const title = prompt("🌍 Ingresa el título de tu nuevo Mundo o Franquicia:");
  if (!title) return;
  const genre = prompt("Género (anime, terror, series, novela):") || "anime";
  const desc = prompt("Breve descripción del mundo:") || "Un mundo personalizado creado por ti.";
  const cover = prompt("URL de imagen de portada (opcional):") || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500";
  
  const newCustomWorld = {
    id: "custom-" + Date.now(),
    title,
    genre: genre.toLowerCase(),
    author: userData.name,
    cover,
    desc,
    characters: [
      { name: "Personaje Principal", role: "Aliado/Rival", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" }
    ]
  };
  
  worldsDatabase.unshift(newCustomWorld);
  renderWorlds(worldsDatabase);
  alert(`✨ ¡Mundo "${title}" creado y publicado con éxito en tu catálogo!`);
}

// GESTIÓN DE PERFIL Y EDICIÓN
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

function openVerifyLinkModal() { document.getElementById("verifyLinkModal").style.display = "flex"; }
function closeVerifyLinkModal() { document.getElementById("verifyLinkModal").style.display = "none"; }

function submitVideoLink() {
  const link = document.getElementById("videoLinkInput").value.trim();
  if (!link) {
    alert("Por favor ingresa un enlace válido.");
    return;
  }
  userData.turns += 50;
  userData.isVIP = true;
  updateUI();
  closeVerifyLinkModal();
  alert("¡Video verificado! 🎉 +50 turnos añadidos y estatus Creadora VIP activado.");
}

function openUnifiedCreation() { document.getElementById("creationUnifiedModal").style.display = "flex"; }
function closeUnifiedCreation() { document.getElementById("creationUnifiedModal").style.display = "none"; }

function openSetupModal() { document.getElementById("setupModal").style.display = "flex"; }
function closeSetupModal() { document.getElementById("setupModal").style.display = "none"; }

function confirmStartSimulation() {
  userData.gamesCount++;
  userData.turns--;
  closeSetupModal();
  switchTab('game');
  alert("¡Simulación iniciada! Ya puedes enviar tus mensajes en el chat.");
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  if (userData.turns <= 0) {
    alert("Te has quedado sin turnos.");
    return;
  }
  userData.turns--;
  updateUI();
  
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<div class="chat-msg user-bubble">${text}</div>`;
  input.value = "";
  
  setTimeout(() => {
    chatBox.innerHTML += `<div class="chat-msg ai-bubble">[IA]: Respondiendo a tu acción con total fluidez y realismo...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
}

function renderCommunityIdeas() {
  const container = document.getElementById("ideasCommunityList");
  if (!container) return;
  container.innerHTML = "";
  communityIdeas.forEach((item) => {
    container.innerHTML += `<div style="background:var(--bg-app); padding:8px; border-radius:8px; font-size:0.75rem;">${item.text}</div>`;
  });
}
