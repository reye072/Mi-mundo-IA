const MASTER_API_KEY = typeof process !== 'undefined' && process.env && process.env.MASTER_API_KEY 
  ? process.env.MASTER_API_KEY 
  : "";

let turns = parseInt(localStorage.getItem("simulo_turns")) || 50;
let isCreator = localStorage.getItem("simulo_creator") === "true";
let activeWorldKey = "zombie";

const worldsCatalog = {
  zombie: {
    title: "The Walking Dead",
    desc: "La civilización colapsó. Los caminantes dominan las calles y los supervivientes son tu mayor prueba.",
    banner: "https://picsum.photos/600/220?random=10",
    chars: [
      { name: "Rick Grimes", role: "Líder táctico" },
      { name: "Daryl Dixon", role: "Rastreador experto" },
      { name: "Michonne", role: "Guerrera defensiva" }
    ]
  },
  lastofus: {
    title: "The Last of Us",
    desc: "El hongo Cordyceps diezmó a la humanidad. Sobrevive en la zona de cuarentena y más allá.",
    banner: "https://picsum.photos/600/220?random=20",
    chars: [
      { name: "Joel Miller", role: "Contrabandista" },
      { name: "Ellie Williams", role: "Inmune y audaz" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  refreshUserStats();

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
  viewport.innerHTML = `<div class="chat-bubble"><b>[Simulador Activo]</b> Te adentras en ${worldsCatalog[activeWorldKey].title}. Describe tu primera acción u objeto.</div>`;
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

  // Respuesta simulada con estilo dinámico
  setTimeout(() => {
    viewport.innerHTML += `<div class="chat-bubble"><b>Narrador:</b> El entorno reacciona a tu movimiento: *Un silencio tenso se apodera del lugar mientras evalúas tus opciones de supervivencia.*</div>`;
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
    <div class="tool-card" onclick="startNewSimulation()" style="cursor:pointer;">
      <span class="tool-emoji">🧟</span>
      <div>
        <h5>${worldsCatalog[activeWorldKey].title}</h5>
        <p>Partida guardada • Turnos: ${isCreator ? "Ilimitados" : turns}</p>
      </div>
    </div>
  `;
}
