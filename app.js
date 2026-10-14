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
    desc: "La civilización colapsó. Los caminantes dominan las calles y los supervivientes son tu mayor prueba.",
    banner: "https://picsum.photos/600/220?random=1",
    chars: [
      { name: "Rick Grimes", role: "Líder táctico y pistolero" },
      { name: "Daryl Dixon", role: "Rastreador experto" },
      { name: "Negan Smith", role: "Líder de los Salvadores" }
    ]
  },
  lastofus: {
    title: "The Last of Us",
    category: "terror",
    desc: "El hongo Cordyceps diezmó a la humanidad. Sobrevive en zonas infestadas de infectados violentos.",
    banner: "https://picsum.photos/600/220?random=2",
    chars: [
      { name: "Joel Miller", role: "Contrabandista veterano" },
      { name: "Ellie Williams", role: "Inmune y audaz" }
    ]
  },
  jujutsu: {
    title: "Jujutsu Kaisen: Canon Oscuro",
    category: "anime",
    desc: "Maldiciones desatadas por el mundo. Entra a la Academia de Hechicería y combate seres sobrenaturales sin censura.",
    banner: "https://picsum.photos/600/220?random=3",
    chars: [
      { name: "Satoru Gojo", role: "Hechicero más fuerte" },
      { name: "Sukuna", role: "Rey de las Maldiciones" }
    ]
  },
  tokyo: {
    title: "Tokyo Revengers: Pandillas",
    category: "anime",
    desc: "Viajes en el tiempo, peleas callejeras sangrientas, lealtades oscuras y decisiones límite.",
    banner: "https://picsum.photos/600/220?random=4",
    chars: [
      { name: "Mikey (Manjiro Sano)", role: "Invencible líder de Toman" },
      { name: "Draken (Ken Ryuguji)", role: "Segundo al mando" }
    ]
  },
  leyendas: {
    title: "Leyendas de Terror Urbano",
    category: "leyendas",
    desc: "Criaturas de la noche, asesinos seriales y mitos oscuros que acechan en callejones a medianoche.",
    banner: "https://picsum.photos/600/220?random=5",
    chars: [
      { name: "The Slender Man", role: "Entidad sin rostro" },
      { name: "Jeff The Killer", role: "Asesino psicópata" }
    ]
  },
  romance: {
    title: "Novela: Oscura Obsesión",
    category: "novela",
    desc: "Una historia de romance oscuro, peligros compartidos, tensión al límite y tramas apasionantes.",
    banner: "https://picsum.photos/600/220?random=6",
    chars: [
      { name: "Christian Grey", role: "Empresario enigmático" },
      { name: "Aiden (Mafioso)", role: "Protector peligroso" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  refreshUserStats();
  renderWorldsGrid('all');

  document.getElementById("creadoraBtn").addEventListener("click", () => {
    const code = prompt("Introduce tu clave de Creadora:");
    if (code === "Creadora_082012") {
      isCreator = true;
      localStorage.setItem("simulo_creator", "true");
      alert("✨ ¡Modo Creadora Activado! Turnos ilimitados.");
      refreshUserStats();
    } else {
      alert("Contraseña errónea.");
    }
  });

  document.getElementById("sendBtn").addEventListener("click", postPlayerAction);
});

function renderWorldsGrid(category) {
  const grid = document.getElementById("worldsGridContainer");
  const filteredKeys = Object.keys(worldsCatalog).filter(k => {
    if (category === 'all') return true;
    return worldsCatalog[k].category === category;
  });

  grid.innerHTML = filteredKeys.map(key => {
    const w = worldsCatalog[key];
    return `
      <div class="world-bubble-card" onclick="openWorldDetail('${key}')">
        <div class="bubble-banner" style="background-image: url('${w.banner}');">
          <span class="bubble-badge">🔥 45K</span>
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
  event.target.classList.add("active");
  renderWorldsGrid(category);
}

function switchTab(targetId) {
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  if (targetId === 'explore') document.getElementById("view-explore").classList.add("active");
  if (targetId === 'history') {
    document.getElementById("view-history").classList.add("active");
    renderGameHistory();
  }
  if (targetId === 'profile') document.getElementById("view-profile").classList.add("active");
}

function openWorldDetail(key) {
  activeWorldKey = key;
  const item = worldsCatalog[key];
  document.getElementById("detailTitle").innerText = item.title;
  document.getElementById("detailDesc").innerText = item.desc;
  document.getElementById("detailBanner").style.backgroundImage = `url('${item.banner}')`;

  const listContainer = document.getElementById("charactersList");
  listContainer.innerHTML = item.chars.map(ch => `
    <div class="char-item-card">
      <div class="char-avatar-box">${ch.name.charAt(0)}</div>
      <div>
        <h5>${ch.name}</h5>
        <span style="font-size:0.75rem; color:var(--texto-muted);">${ch.role}</span>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-world-detail").classList.add("active");
}

function startNewSimulation() {
  if (turns <= 0 && !isCreator) {
    alert("¡Turnos agotados! Visita la tienda para recargar gratis.");
    openShopModal();
    return;
  }
  document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-game").classList.add("active");
  
  const viewport = document.getElementById("chatBox");
  viewport.innerHTML = `<div class="chat-bubble"><b>[Simulador Activo]</b> Te adentras en ${worldsCatalog[activeWorldKey].title}. Describe tu primera acción (*acción*) o diálogo (&quot;diálogo&quot;).</div>`;
}

async function postPlayerAction() {
  const inputField = document.getElementById("userInput");
  const userText = inputField.value.trim();
  if (!userText) return;

  if (!isCreator) {
    turns--;
    localStorage.setItem("simulo_turns", turns);
    refreshUserStats();
  }

  const viewport = document.getElementById("chatBox");
  viewport.innerHTML += `<div class="chat-bubble user">${userText}</div>`;
  inputField.value = "";
  viewport.scrollTop = viewport.scrollHeight;

  // Respuesta simulada de la IA
  setTimeout(() => {
    viewport.innerHTML += `<div class="chat-bubble"><b>Narrador / Bot:</b> El entorno reacciona intensamente a tu movimiento: *La tensión aumenta en el escenario mientras las consecuencias de tus actos comienzan a manifestarse.*</div>`;
    viewport.scrollTop = viewport.scrollHeight;
  }, 900);
}

function refreshUserStats() {
  const displayVal = isCreator ? "∞" : turns;
  document.getElementById("turnsCount").innerText = displayVal;
  document.getElementById("gameTurnsCounter").innerText = `Turnos: ${displayVal}`;
}

function openShopModal() {
  document.getElementById("shopModal").style.display = "flex";
}

function closeShopModal() {
  document.getElementById("shopModal").style.display = "none";
}

function watchAdReward() {
  alert("🎉 ¡Anuncio completado con éxito! +15 turnos añadidos.");
  turns += 15;
  localStorage.setItem("simulo_turns", turns);
  refreshUserStats();
  closeShopModal();
}

function renderGameHistory() {
  const historyBox = document.getElementById("historyList");
  historyBox.innerHTML = `
    <div class="char-item-card" onclick="startNewSimulation()" style="cursor:pointer;">
      <div class="char-avatar-box">🎮</div>
      <div>
        <h5>${worldsCatalog[activeWorldKey].title}</h5>
        <p style="font-size:0.75rem; color:var(--texto-muted);">Partida guardada • Turnos: ${isCreator ? "Ilimitados" : turns}</p>
      </div>
    </div>
  `;
}
