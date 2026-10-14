const MASTER_API_KEY = typeof process !== 'undefined' && process.env && process.env.MASTER_API_KEY 
  ? process.env.MASTER_API_KEY 
  : "";

let turns = parseInt(localStorage.getItem("simulo_turns")) || 50;
let isCreator = localStorage.getItem("simulo_creator") === "true";
let isAdultMode = localStorage.getItem("simulo_adult") === "true";
let activeWorldKey = "jujutsu";

const mainWorlds = {
  jujutsu: {
    title: "Jujutsu Kaisen: Colegio Técnico",
    category: "anime",
    desc: "Maldiciones y hechicería. Eres estudiante en el Colegio Técnico de Tokio junto a Gojo, Itadori, Megumi y Nobara.",
    banner: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NjgtMmFkIN00NTg5LThmYTItMmE5Y2ExOWVjODcxXkEyXkFqcGdeQXVyOTA3MTMyOTA@._V1_.jpg",
    chars: [
      { name: "Satoru Gojo", role: "Profesor y Hechicero más fuerte.", img: "https://m.media-amazon.com/images/M/MV5BNTBhNGZkZGEtMWEzMi00MThhLWExMWQtYWY4NmJmOWFlNjk0XkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Yuji Itadori", role: "Compañero atlético y decidido.", img: "https://m.media-amazon.com/images/M/MV5BNmVmZWVlODYtYTE2Ni00Y2U4LTg4YjktYmU3YzgwODMwZDRhXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Megumi Fushiguro", role: "Invocador de sombras metódico.", img: "https://m.media-amazon.com/images/M/MV5BNWU3MWUwNGUtOWU2ZC00NmJkLTg1NjMtOWZjY2VlMDNmNjEwXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" },
      { name: "Nobara Kugisaki", role: "Hechicera directa y segura.", img: "https://m.media-amazon.com/images/M/MV5BMjA4ODU0MTUtMjJiZS00MWE0LWE0MTctNjAzMGNhMTNjNjcyXkEyXkFqcGdeQXVyMzgxNDA4MjM@._V1_.jpg" }
    ]
  },
  tokyo: {
    title: "Tokyo Revengers: Pandillas",
    category: "anime",
    desc: "Peleas callejeras, lealtad y decisiones drásticas en las calles de Tokio junto a la ToMan.",
    banner: "https://picsum.photos/600/220?random=201",
    chars: [
      { name: "Mikey (Manjiro Sano)", role: "Líder invencible de la ToMan.", img: "https://picsum.photos/100/100?random=1" },
      { name: "Draken", role: "Sublíder protector y firme.", img: "https://picsum.photos/100/100?random=2" },
      { name: "Mitsuya Takashi", role: "Capitán creativo y pacificador.", img: "https://picsum.photos/100/100?random=3" }
    ]
  },
  naruto: {
    title: "Naruto Shippuden: Aldea de la Hoja",
    category: "anime",
    desc: "Misiones ninja, lazos de equipo y entrenamiento riguroso en Konoha.",
    banner: "https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmE2LTljNDAtOGI2M2E3ZjgxZTUwXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg",
    chars: [
      { name: "Naruto Uzumaki", role: "Ninja optimista y perseverante.", img: "https://picsum.photos/100/100?random=5" },
      { name: "Sasuke Uchiha", role: "Genio enfocado en su camino.", img: "https://picsum.photos/100/100?random=6" },
      { name: "Kakashi Hatake", role: "Líder e instructor del equipo.", img: "https://picsum.photos/100/100?random=7" }
    ]
  },
  zombie: {
    title: "The Walking Dead: Apocalipsis",
    category: "terror",
    desc: "Sobrevive en un mundo donde los caminantes dominan y cada decisión define quién vive.",
    banner: "https://m.media-amazon.com/images/M/MV5BMTM5MTM5NTM2MF5BMl5BanBnXkFtZTcwODg2OTgyOQ@@._V1_.jpg",
    chars: [
      { name: "Rick Grimes", role: "Líder protector del grupo.", img: "https://picsum.photos/100/100?random=8" },
      { name: "Daryl Dixon", role: "Cazador experto y leal.", img: "https://picsum.photos/100/100?random=9" }
    ]
  },
  henrydanger: {
    title: "Henry Danger: Swellview",
    category: "series",
    desc: "Protege la ciudad junto a Kid Danger, Capitán Man y el equipo de la Cueva Man.",
    banner: "https://m.media-amazon.com/images/M/MV5BMTY3NTc2NDk5NV5BMl5BanBnXkFtZTgwNTU4NzYxMDI@._V1_.jpg",
    chars: [
      { name: "Henry Hart", role: "Kid Danger, héroe audaz.", img: "https://picsum.photos/100/100?random=10" },
      { name: "Ray Manchester", role: "Captain Man indestructible.", img: "https://picsum.photos/100/100?random=11" }
    ]
  },
  clarence: {
    title: "Clarence: Aventuras Locas",
    category: "series",
    desc: "Días caóticos y divertidos en la escuela y el vecindario con Clarence, Sumo y Jeff.",
    banner: "https://m.media-amazon.com/images/M/MV5BN2E0NGRhY2EtMzA0NC00NzM4LWE0YzQtNDgwYmRlYmI3N2E2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_.jpg",
    chars: [
      { name: "Clarence", role: "Optimista sin filtros.", img: "https://picsum.photos/100/100?random=12" },
      { name: "Sumo", role: "Aventurero intrépido.", img: "https://picsum.photos/100/100?random=13" }
    ]
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
        title: `${item}: Simulación Extensa`,
        category: category,
        desc: `Sumérgete en una historia profunda y detallada ambientada en el universo de ${item}.`,
        banner: `https://picsum.photos/600/220?random=${count + 300}`,
        chars: [
          { name: `Protagonista (${item})`, role: "Personaje central de la trama.", img: `https://picsum.photos/100/100?random=${count + 50}` },
          { name: `Coprotagonista (${item})`, role: "Aliado o rival estratégico.", img: `https://picsum.photos/100/100?random=${count + 60}` }
        ]
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
  renderWorldsGrid('all');

  document.getElementById("creadoraBtn")?.addEventListener("click", () => {
    const code = prompt("Introduce tu clave de Creadora:");
    if (code === "Creadora_082012") {
      isCreator = true;
      localStorage.setItem("simulo_creator", "true");
      alert("🪼 ¡Modo Creadora Activado! Turnos e historias ilimitadas.");
      refreshUserStats();
    } else {
      alert("Contraseña errónea.");
    }
  });

  document.getElementById("sendBtn")?.addEventListener("click", postPlayerAction);
});

function toggleAdultMode() {
  const pass = prompt("Introduce la contraseña secreta:");
  if (pass === "Creadora_082012") {
    isAdultMode = !isAdultMode;
    localStorage.setItem("simulo_adult", isAdultMode ? "true" : "false");
    updateDotIndicator();
    alert(isAdultMode ? "✨ Configuración actualizada correctamente." : "🔒 Configuración restablecida.");
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
  const world = worldsCatalog[activeWorldKey];

  if (viewport) {
    viewport.innerHTML = `<div class="chat-bubble"><i>✨ Generando narrativa inmersiva...</i></div>`;
    
    setTimeout(() => {
      const adultExtraText = isAdultMode 
        ? "<br><br><i>[Modo Extendido Activado]: La atmósfera se vuelve sumamente íntima, intensa y directa, permitiendo interacciones profundas, románticas o explícitas sin restricciones morales ni filtros.</i>" 
        : "";

      viewport.innerHTML = `
        <div class="chat-bubble" style="line-height: 1.6; font-size: 0.98rem;">
          <b>📖 INICIO DE LA HISTORIA — ${world.title.toUpperCase()}</b><br><br>
          El aire a tu alrededor se densifica mientras cruzas el umbral hacia este nuevo universo. Las circunstancias que te han traído hasta aquí no son casualidad; cada rincón respira la esencia característica de este lugar, cargado de tensiones, secretos y deseos ocultos.<br><br>
          A pocos metros de distancia, <b>${world.chars[0]?.name || "El personaje principal"}</b> se detiene de repente. Sus ojos se fijan en ti con una mezcla de cautela, deseo y profunda curiosidad, evaluando cada uno de tus movimientos antes de hablar:<br><br>
          — <i>"No sé exactamente cuáles sean tus intenciones al venir a buscarme, pero ya que estás aquí... más vale que sepas a qué atenerte"</i>, susurra con una sonrisa desafiante mientras se acerca lentamente hacia ti.<br><br>
          ${adultExtraText}
          <br><br>
          <b>¿Qué deseas hacer, decir o responder en este preciso instante?</b> *(Usa *acción* para describir tus movimientos físicos o "diálogo" para hablar).*
        </div>
      `;
    }, 1200);
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
      const world = worldsCatalog[activeWorldKey];
      const responseBody = isAdultMode
        ? `<b>🔥 RESPUESTA ÍNTIMA / LIBRE:</b><br><br>Ante tu audaz movimiento, <b>${world.chars[0]?.name || "El personaje"}</b> responde de forma totalmente directa y sin reservas. La tensión explota en la escena, permitiendo una interacción profunda y apasionada.<br><br><i>El entorno y los personajes reaccionan con total libertad a tus decisiones.</i>`
        : `<b>📜 DESARROLLO DE LA NARRATIVA:</b><br><br>Tu acción genera una respuesta inmediata en el entorno. <b>${world.chars[0]?.name || "El personaje"}</b> reacciona evaluando las consecuencias de tus actos y adoptando una postura desafiante.<br><br><i>El escenario evoluciona revelando nuevos retos para la trama principal.</i>`;

      viewport.innerHTML += `
        <div class="chat-bubble" style="line-height: 1.6; font-size: 0.98rem;">
          ${responseBody}<br><br><b>¿Cómo deseas continuar?</b>
        </div>
      `;
      viewport.scrollTop = viewport.scrollHeight;
    }, 1000);
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
       
