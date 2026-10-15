let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 100,
  isVIP: false,
  gamesCount: 0
};

// Base de datos de mundos originales listos para buscarse por nombre
const worldsDatabase = [
  { id: "jjk", title: "Jujutsu Kaisen", genre: "anime", desc: "Maldiciones y hechicería. Estás en el Cole..." },
  { id: "twd", title: "The Walking Dead", genre: "terror", desc: "Sobrevive al apocalipsis zombie junto a Ri..." },
  { id: "ds", title: "Demon Slayer", genre: "anime", desc: "Simulación inmersiva e historia completa e..." },
  { id: "mha", title: "My Hero Academia", genre: "anime", desc: "Simulación inmersiva e historia completa e..." }
];

document.addEventListener("DOMContentLoaded", () => {
  renderWorlds(worldsDatabase);
  updateUI();
  
  const giftModal = document.getElementById("giftModal");
  if (giftModal) {
    giftModal.addEventListener("click", openGiftAndEnter);
    giftModal.addEventListener("touchend", openGiftAndEnter);
  }
});

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
    container.innerHTML = `<p style="text-align:center; color:var(--texto-muted); padding:20px; grid-column: 1/-1;">No se encontró ningún mundo con ese nombre.</p>`;
    return;
  }
  
  list.forEach(w => {
    container.innerHTML += `
      <div class="world-card" onclick="alert('Abriendo el mundo: ${w.title}')">
        <span class="world-badge-tag">🪼 200+ Mundos</span>
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

// FUNCIÓN DE BÚSQUEDA EN TIEMPO REAL POR NOMBRE
function searchWorlds() {
  const query = document.getElementById("worldSearchInput").value.toLowerCase().trim();
  const filtered = worldsDatabase.filter(w => 
    w.title.toLowerCase().includes(query) || 
    w.desc.toLowerCase().includes(query)
  );
  renderWorlds(filtered);
}
