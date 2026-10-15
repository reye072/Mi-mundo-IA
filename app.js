let userData = {
  name: "Jugadora SimulO",
  desc: "Exploradora de universos y creadora de historias.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  turns: 50,
  isVIP: false,
  gamesCount: 0,
  currentModel: "Vanilla V3"
};

const worldsDatabase = [
  {
    id: "mha",
    title: "My Hero Academia",
    genre: "anime",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    desc: "Un mundo donde el 80% de la población posee superpoderes llamados 'Quirks'. Conviértete en héroe profesional o únete a la Liga de Villanos.",
    characters: [
      { name: "Katsuki Bakugo", role: "Rival explosivo", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200" },
      { name: "Shoto Todoroki", role: "Mitad Fuego / Mitad Hielo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" }
    ]
  },
  {
    id: "twd",
    title: "The Walking Dead",
    genre: "terror",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    desc: "El mundo ha caído ante una pandemia zombie. Los muertos caminan y los vivos son la verdadera amenaza. ¿Podrás sobrevivir?",
    characters: [
      { name: "Daryl Dixon", role: "Ballestero solitario", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" }
    ]
  }
];

// EJECUCIÓN AL CARGAR
document.addEventListener("DOMContentLoaded", () => {
  renderWorlds(worldsDatabase);
  updateUI();
  
  // Garantizar cierre del regalo al toque por JS directo
  const giftModal = document.getElementById("giftModal");
  if (giftModal) {
    giftModal.addEventListener("click", openGiftAndEnter);
    giftModal.addEventListener("touchend", openGiftAndEnter);
  }
});

// FUNCIÓN DE APERTURA DEL REGALO
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
  document.getElementById("turnsCount").textContent = userData.turns;
  document.getElementById("gamesCount").textContent = userData.gamesCount;
  document.getElementById("profileNameDisplay").textContent = userData.name;
  document.getElementById("profileDescDisplay").textContent = userData.desc;
  document.getElementById("profileAvatarDisplay").style.backgroundImage = `url('${userData.avatar}')`;
}

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
  if (event) event.target.classList.add("active");
  
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
