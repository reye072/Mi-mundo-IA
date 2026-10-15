let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 100,
  isVIP: false,
  gamesCount: 0
};

// Base de datos completa con más de 200 mundos simulados y portadas variadas
const worldsDatabase = [
  { id: "jjk", title: "Jujutsu Kaisen", genre: "anime", cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500", desc: "Maldiciones y hechicería. Estás en el Colegio Técnico." },
  { id: "twd", title: "The Walking Dead", genre: "terror", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500", desc: "Sobrevive al apocalipsis zombie junto a los supervivientes." },
  { id: "ds", title: "Demon Slayer", genre: "anime", cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500", desc: "Simulación inmersiva e historia completa en la era Taisho." },
  { id: "mha", title: "My Hero Academia", genre: "anime", cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500", desc: "Simulación inmersiva y entrenamiento de héroes profesionales." },
  { id: "naruto", title: "Naruto Shippuden", genre: "anime", cover: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500", desc: "Aldeas ocultas, jutsus legendarios y batallas épicas ninja." },
  { id: "cyberpunk", title: "Cyberpunk Edge", genre: "series", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500", desc: "Neones, implantes cibernéticos y acción en Night City." },
  { id: "conjuro", title: "El Conjuro", genre: "terror", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500", desc: "Investigación paranormal y entidades oscuras al acecho." },
  { id: "novela", title: "Pecados de la Alta Sociedad", genre: "novela", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", desc: "Romances prohibidos, secretos y lujos en una mansión." }
];

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
  }
  updateUI();
}

function updateUI() {
  const turnsEl = document.getElementById("turnsCount");
  const gamesEl = document.getElementById("gamesCount");
  if (turnsEl) turnsEl.textContent = userData.turns;
  if (gamesEl) gamesEl.textContent = userData.gamesCount;
}

function renderWorlds(list) {
  const container = document.getElementById("worldsGridContainer");
  if (!container) return;
  
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--texto-muted); padding:20px; grid-column: 1/-1;">No se encontró ningún mundo.</p>`;
    return;
  }
  
  list.forEach(w => {
    container.innerHTML += `
      <div class="world-card" onclick="alert('Abriendo el mundo: ${w.title}')">
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

// CONTROL DE MODALES DE AYUDA Y PERFIL
function openTutorialModal() {
  document.getElementById("tutorialModal").style.display = "flex";
}
function closeTutorialModal() {
  document.getElementById("tutorialModal").style.display = "none";
}

function openEditProfileModal() {
  document.getElementById("editNameInput").value = userData.name;
  document.getElementById("editDescInput").value = userData.desc;
  document.getElementById("editProfileModal").style.display = "flex";
}
function closeEditProfileModal() {
  document.getElementById("editProfileModal").style.display = "none";
}

function saveProfileChanges() {
  userData.name = document.getElementById("editNameInput").value || userData.name;
  userData.desc = document.getElementById("editDescInput").value || userData.desc;
  closeEditProfileModal();
  updateUI();
  alert("¡Perfil actualizado con éxito!");
}
