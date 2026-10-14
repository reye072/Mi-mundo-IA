const MASTER_API_KEY = typeof process !== 'undefined' && process.env && process.env.MASTER_API_KEY 
  ? process.env.MASTER_API_KEY 
  : "";

let turns = parseInt(localStorage.getItem("simulo_turns")) || 50;
let isCreator = localStorage.getItem("simulo_creator") === "true";
let activeWorldKey = "zombie";

const worldsCatalog = {
  zombie: {
    title: "The Walking Dead",
    category: "terror",
    desc: "La civilización colapsó. Los caminantes dominan las calles y Rick con su grupo luchan por sobrevivir.",
    banner: "https://m.media-amazon.com/images/M/MV5BMTM5MTM5NTM2MF5BMl5BanBnXkFtZTcwODg2OTgyOQ@@._V1_.jpg",
    chars: [
      { name: "Rick Grimes", role: "Líder táctico y pistolero", img: "https://m.media-amazon.com/images/M/MV5BMjAxMzA5MzMxMF5BMl5BanBnXkFtZTcwNTI5OTM0OQ@@._V1_.jpg" },
      { name: "Daryl Dixon", role: "Rastreador experto con ballesta", img: "https://m.media-amazon.com/images/M/MV5BMTkzODE4NDAzNV5BMl5BanBnXkFtZTgwNTQyOTIzNzE@._V1_.jpg" },
      { name: "Glenn Rhee", role: "Explorador de suministros", img: "https://m.media-amazon.com/images/M/MV5BMjI3MzgwMTM1OF5BMl5BanBnXkFtZTgwNTM3Mzc5NzE@._V1_.jpg" },
      { name: "Michonne", role: "Guerrera con katana", img: "https://m.media-amazon.com/images/M/MV5BMTc5MDExNTgwOV5BMl5BanBnXkFtZTgwODIxNDQ5NzE@._V1_.jpg" },
      { name: "Maggie Greene", role: "Líder de Hilltop", img: "https://m.media-amazon.com/images/M/MV5BOTU1MjQ0NTcxNl5BMl5BanBnXkFtZTgwNDM3Mzc5NzE@._V1_.jpg" }
    ]
  },
  jujutsu: {
    title: "Jujutsu Kaisen",
    category: "anime",
    desc: "Maldiciones desatadas. Acompaña a Yuji, Megumi, Nobara y Satoru Gojo en la Academia de Hechicería.",
    banner: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NjgtMmFkIN00NTg5LThmYTItMmE5Y2ExOWVjODcxXkEyXkFqcGdeQXVyOTA3MTMyOTA@._V1_.jpg",
    chars: [
      { name: "Satoru Gojo", role: "Hechicero del Infinito", img: "https://m.media-amazon.com/images/M/MV5BNTBhNGZkZGEtMWEzMi00MThhLWExMWQtYWY4NmJmOWFlNjk0XkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Yuji Itadori", role: "Recipiente de Sukuna", img: "https://m.media-amazon.com/images/M/MV5BNmVmZWVlODYtYTE2Ni00Y2U4LTg4YjktYmU3YzgwODMwZDRhXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Megumi Fushiguro", role: "Invocador de sombras", img: "https://m.media-amazon.com/images/M/MV5BNWU3MWUwNGUtOWU2ZC00NmJkLTg1NjMtOWZjY2VlMDNmNjEwXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Nobara Kugisaki", role: "Hechicera de resonancia", img: "https://m.media-amazon.com/images/M/MV5BMjA4ODU0MTUtMjJiZS00MWE0LWE0MTctNjAzMGNhMTNjNjcyXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Ryomen Sukuna", role: "Rey de las Maldiciones", img: "https://m.media-amazon.com/images/M/MV5BM2EyZThmYmEtNzBkNS00MjNkLTg0MjYtODU0ZDNjNjM0ZWM5XkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" }
    ]
  },
  naruto: {
    title: "Naruto Shippuden",
    category: "anime",
    desc: "El camino ninja del Equipo 7. Domina jutsus, completa misiones y protege la Aldea de la Hoja.",
    banner: "https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmE2LTljNDAtOGI2M2E3ZjgxZTUwXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg",
    chars: [
      { name: "Naruto Uzumaki", role: "Jinchuriki del Zorro de Nueve Colas", img: "https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg5YjctOGY4ZjY2ODk2MzQ3XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg" },
      { name: "Sasuke Uchiha", role: "Maestro del Sharingan", img: "https://m.media-amazon.com/images/M/MV5BYTEzNzI4MmYtY2ZhNi00ZTQzLThhM2UtMDZjYjBmY2JjOWY5XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg" },
      { name: "Sakura Haruno", role: "Ninja médico de fuerza sobrehumana", img: "https://m.media-amazon.com/images/M/MV5BMjE3OTEzMzUzM15BMl5BanBnXkFtZTgwNTgzNjU3ODE@._V1_.jpg" },
      { name: "Kakashi Hatake", role: "El Ninja Copia", img: "https://m.media-amazon.com/images/M/MV5BMzcwMDFiMDctMTM1ZC00YjBhLWI0MzgtZWIxMjQ1YjA1ZWEzXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg" },
      { name: "Itachi Uchiha", role: "Prodigio del clan Uchiha", img: "https://m.media-amazon.com/images/M/MV5BMjAzMjI5NzYwNV5BMl5BanBnXkFtZTgwNTg4MTI0ODE@._V1_.jpg" }
    ]
  },
  henrydanger: {
    title: "Henry Danger",
    category: "series",
    desc: "Únete a Kid Danger, Capitán Man y su equipo para defender Swellview de villanos en secreto.",
    banner: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg",
    chars: [
      { name: "Henry Hart (Kid Danger)", role: "Héroe en entrenamiento", img: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg" },
      { name: "Ray Manchester (Captain Man)", role: "Superhéroe indestructible", img: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg" },
      { name: "Charlotte Page", role: "Estratega del equipo", img: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg" },
      { name: "Jasper Dunlop", role: "Encargado de la Cueva Man", img: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg" }
    ]
  },
  clarence: {
    title: "Clarence: Aventuras Locas",
    category: "series",
    desc: "Disfruta del caótico día a día de Clarence, Sumo y Jeff creando travesuras inolvidables.",
    banner: "https://m.media-amazon.com/images/M/MV5BN2E0NGRhY2EtMzA0NC00NzM4LWE0YzQtNDgwYmRlYmI3N2E2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_.jpg",
    chars: [
      { name: "Clarence Wendle", role: "Optimista incorregible", img: "https://m.media-amazon.com/images/M/MV5BN2E0NGRhY2EtMzA0NC00NzM4LWE0YzQtNDgwYmRlYmI3N2E2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_.jpg" },
      { name: "Sumo (Ryan Sumouski)", role: "Aventurero salvaje", img: "https://m.media-amazon.com/images/M/MV5BN2E0NGRhY2EtMzA0NC00NzM4LWE0YzQtNDgwYmRlYmI3N2E2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_.jpg" },
      { name: "Jeff Randell", role: "El cerebro perfeccionista", img: "https://m.media-amazon.com/images/M/MV5BN2E0NGRhY2EtMzA0NC00NzM4LWE0YzQtNDgwYmRlYmI3N2E2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_.jpg" }
    ]
  },
  leyendas: {
    title: "Leyendas de Terror Urbano",
    category: "leyendas",
    desc: "Criaturas de la noche, asesinos seriales y mitos oscuros que acechan en callejones solitarios a medianoche.",
    banner: "https://picsum.photos/600/220?random=105",
    chars: [
      { name: "The Slender Man", role: "Entidad sin rostro", img: "https://picsum.photos/100/100?random=29" },
      { name: "Jeff The Killer", role: "Asesino psicópata", img: "https://picsum.photos/100/100?random=30" }
    ]
  }
};

// Generador automático de bots secundarios para complementar los elencos
function generateExtraBots() {
  Object.keys(worldsCatalog).forEach((wKey, wIdx) => {
    for (let i = 1; i <= 25; i++) {
      worldsCatalog[wKey].chars.push({
        name: `Personaje Secundario #${i}`,
        role: `Bot Aliado / Enemigo (${worldsCatalog[wKey].title})`,
        img: worldsCatalog[wKey].banner
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateExtraBots();
  refreshUserStats();
  renderWorldsGrid('all');

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
          <span class="bubble-badge">🪼 30+ Bots</span>
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
  
  const titleEl = document.getElementById("detailTitle");
  const descEl = document.getElementById("detailDesc");
  const bannerEl = document.getElementById("detailBanner");
  
  if (titleEl) titleEl.innerText = item.title;
  if (descEl) descEl.innerText = item.desc;
  if (bannerEl) bannerEl.style.backgroundImage = `url('${item.banner}')`;

  const listContainer = document.getElementById("charactersList");
  if (listContainer) {
    listContainer.innerHTML = item.chars.map(ch => `
      <div class="char-item-card">
        <div class="char-avatar-box" style="background-image: url('${ch.img}');"></div>
        <div>
          <h5>${ch.name}</h5>
          <span style="font-size:0.75rem; color:var(--texto-muted);">${ch.role}</span>
        </div>
      </div>
    `).join("");
  }

  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-world-detail")?.classList.add("active");
}

function startNewSimulation() {
  if (turns <= 0 && !isCreator) {
    alert("¡Turnos agotados! Visita la tienda para recargar gratis.");
    openShopModal();
    return;
  }
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-game")?.classList.add("active");
  
  const viewport = document.getElementById("chatBox");
  if (viewport) {
    viewport.innerHTML = `<div class="chat-bubble"><b>[Simulador Activo]</b> Te adentras en el mundo de <b>${worldsCatalog[activeWorldKey].title}</b>. Escribe tu primera acción (*acción*) o diálogo ("diálogo").</div>`;
  }
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

  const viewport = document.getElementById("chatBox");
  if (viewport) {
    viewport.innerHTML += `<div class="chat-bubble user">${userText}</div>`;
    inputField.value = "";
    viewport.scrollTop = viewport.scrollHeight;

    setTimeout(() => {
      viewport.innerHTML += `<div class="chat-bubble"><b>Narrador / Bot:</b> El equipo reacciona a tu acción: *Los personajes se organizan y responden a tus palabras.*</div>`;
      viewport.scrollTop = viewport.scrollHeight;
    }, 900);
  }
}

function refreshUserStats() {
  const displayVal = isCreator ? "∞" : turns;
  const turnsCount = document.getElementById("turnsCount");
  const gameTurnsCounter = document.getElementById("gameTurnsCounter");
  
  if (turnsCount) turnsCount.innerText = displayVal;
  if (gameTurnsCounter) gameTurnsCounter.innerText = `Turnos: ${displayVal}`;
}

function openShopModal() {
  const shopModal = document.getElementById("shopModal");
  if (shopModal) shopModal.style.display = "flex";
}

function closeShopModal() {
  const shopModal = document.getElementById("shopModal");
  if (shopModal) shopModal.style.display = "none";
}

function watchAdReward() {
  alert("🪼 ¡Anuncio completado! +15 turnos añadidos con éxito.");
  turns += 15;
  localStorage.setItem("simulo_turns", turns);
  refreshUserStats();
  closeShopModal();
}

function renderGameHistory() {
  const historyBox = document.getElementById("historyList");
  if (historyBox) {
    historyBox.innerHTML = `
      <div class="char-item-card" onclick="startNewSimulation()" style="cursor:pointer;">
        <div class="char-avatar-box" style="background-image: url('${worldsCatalog[activeWorldKey].banner}');"></div>
        <div>
          <h5>${worldsCatalog[activeWorldKey].title}</h5>
          <p style="font-size:0.75rem; color:var(--texto-muted);">Partida guardada • Turnos: ${isCreator ? "Ilimitados" : turns}</p>
        </div>
      </div>
    `;
  }
}
