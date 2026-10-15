let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 100,
  isVIP: false,
  gamesCount: 0
};

// CATÁLOGO MASIVO COMPLETO DE MUNDOS
let worldsDatabase = [
  { id: "jjk", title: "Jujutsu Kaisen", genre: "anime", cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500", desc: "Maldiciones y hechicería. Estás en el Colegio Técnico." },
  { id: "twd", title: "The Walking Dead", genre: "terror", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500", desc: "Sobrevive al apocalipsis zombie junto a los supervivientes." },
  { id: "ds", title: "Demon Slayer", genre: "anime", cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500", desc: "Simulación inmersiva e historia completa en la era Taisho." },
  { id: "mha", title: "My Hero Academia", genre: "anime", cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500", desc: "Simulación inmersiva y entrenamiento de héroes profesionales." },
  { id: "naruto", title: "Naruto Shippuden", genre: "anime", cover: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500", desc: "Aldeas ocultas, jutsus legendarios y batallas épicas ninja." },
  { id: "cyberpunk", title: "Cyberpunk Edge", genre: "series", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500", desc: "Neones, implantes cibernéticos y acción en Night City." },
  { id: "conjuro", title: "El Conjuro", genre: "terror", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500", desc: "Investigación paranormal y entidades oscuras al acecho." },
  { id: "novela", title: "Pecados de la Alta Sociedad", genre: "novela", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", desc: "Romances prohibidos, secretos y lujos en una mansión." },
  { id: "solo", title: "Solo Leveling", genre: "anime", cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500", desc: "Mazmorras, monstruos y el despertar del cazador más débil." },
  { id: "bungou", title: "Bungou Stray Dogs", genre: "anime", cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500", desc: "Detectives con poderes basados en grandes literatos." },
  { id: "creepy", title: "Creepypastas", genre: "terror", cover: "https://share.google/LToPJrBO0hE0IQ4GZ", desc: "Leyendas urbanas de internet y encuentros terroríficos." },
  { id: "viernes13", title: "Viernes 13", genre: "terror", cover: "https://share.google/63sT9Gstej1Wm33Fg", desc: "Campamento Crystal Lake y la sombra ineludible de Jason." },
  { id: "scream", title: "Scream", genre: "terror", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500", desc: "Llamadas enmascaradas, suspenso y misterio en Woodsboro." },
  { id: "stranger", title: "Stranger Things", genre: "series", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500", desc: "El Otro Lado, misterios gubernamentales y poderes ocultos." },
  { id: "euphoria", title: "Euphoria", genre: "series", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", desc: "Dramas juveniles, fiestas nocturnas y secretos intensos." },
  { id: "kdrama", title: "Amores de K-Drama", genre: "novela", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", desc: "Romances de oficina, triángulos amorosos y alta tensión." }
];

let activeWorld = null;

document.addEventListener("DOMContentLoaded", () => {
  renderWorlds(worldsDatabase);
  updateUI();
});

function openGiftAndEnter() {
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
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  
  if (tabId === 'explore') {
    document.getElementById("view-explore").classList.add("active");
  } else if (tabId === 'history') {
    document.getElementById("view-history").classList.add("active");
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
    container.innerHTML = `<p style="text-align:center; color:var(--texto-muted); padding:20px; grid-column: 1/-1;">No se encontró ningún mundo con ese nombre.</p>`;
    return;
  }
  
  list.forEach(w => {
    container.innerHTML += `
      <div class="world-card" onclick="openWorld('${w.id}')">
        <div class="world-cover" style="background-image: url('${w.cover}');">
          <span class="world-badge-tag">🪼 200+ Mundos</span>
        </div>
        <div class="world-info">
          <h4>${w.title}</h4>
          <p>${w.desc}</p>
        </div>
      </div>
    `;
  });
}

function openWorld(worldId) {
  activeWorld = worldsDatabase.find(w => w.id === worldId);
  if (!activeWorld) return;
  
  document.getElementById("activeWorldTitle").textContent = activeWorld.title;
  document.getElementById("activeWorldDesc").textContent = activeWorld.desc;
  
  document.getElementById("chatBox").style.display = "none";
  document.getElementById("chatComposerBox").style.display = "none";
  
  switchTab('game');
}

function startChatSimulation() {
  if (userData.turns <= 0) {
    alert("Te has quedado sin turnos/puntos.");
    return;
  }
  userData.turns--;
  userData.gamesCount++;
  updateUI();
  
  const chatBox = document.getElementById("chatBox");
  chatBox.style.display = "block";
  document.getElementById("chatComposerBox").style.display = "flex";
  
  chatBox.innerHTML = `<div style="background:var(--morado-claro); padding:10px; border-radius:12px; font-size:0.8rem; margin-bottom:8px;">✨ ¡Simulación iniciada en <b>${activeWorld.title}</b>! Los personajes cobran vida.</div>`;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<div style="text-align:right; margin:6px 0;"><span style="background:var(--morado-principal); color:white; padding:8px 12px; border-radius:12px; display:inline-block; font-size:0.8rem;">${text}</span></div>`;
  input.value = "";
  
  setTimeout(() => {
    chatBox.innerHTML += `<div style="text-align:left; margin:6px 0;"><span style="background:#E2E8F0; color:#2C3E50; padding:8px 12px; border-radius:12px; display:inline-block; font-size:0.8rem;">[IA]: Reaccionando a tu acción en ${activeWorld.title}... continúa la historia.</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 700);
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
    w.desc.toLowerCase().includes(query)
  );
  renderWorlds(filtered);
}

// CREAR NUEVO MUNDO DESDE LA MEDUSA (🪼)
function promptCreateWorld() {
  const title = prompt("🌍 Ingresa el nombre de tu nuevo mundo, serie o anime:");
  if (!title) return;
  const genre = prompt("Género (anime, terror, series, novela):") || "anime";
  const desc = prompt("Descripción breve del mundo:") || "Mundo personalizado creado por ti.";
  const cover = prompt("URL de la foto de portada (opcional):") || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500";
  
  const newWorld = {
    id: "custom-" + Date.now(),
    title,
    genre: genre.toLowerCase(),
    cover,
    desc
  };
  
  worldsDatabase.unshift(newWorld);
  renderWorlds(worldsDatabase);
  alert(`✨ ¡Tu mundo "${title}" ha sido creado con éxito y añadido al catálogo!`);
}

// CONTROL DE MODALES DE AYUDA Y PERFIL
function openTutorialModal() {
  document.getElementById("tutorialModal").style.display = "flex";
}
function closeTutorialModal() {
  document.getElementById("tutorialModal").style.display = "none";
}

function openEditProfileModal() {
  document.getElementById("editNameInput").value = userData.name;
  document.getElementById("editAvatarInput").value = userData.avatar;
  document.getElementById("editDescInput").value = userData.desc;
  document.getElementById("editProfileModal").style.display = "flex";
}
function closeEditProfileModal() {
  document.getElementById("editProfileModal").style.display = "none";
}

function saveProfileChanges() {
  userData.name = document.getElementById("editNameInput").value || userData.name;
  userData.avatar = document.getElementById("editAvatarInput").value || userData.avatar;
  userData.desc = document.getElementById("editDescInput").value || userData.desc;
  closeEditProfileModal();
  updateUI();
  alert("✨ ¡Perfil y foto actualizados con éxito!");
                }
                                           
