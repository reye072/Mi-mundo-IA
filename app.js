// Pega tu API Key real de Google AI Studio aquí entre las comillas
const MASTER_API_KEY = "CLAVE_DESDE_NETLIFY"; 

// Tu clave personalizada de Creadora
const CLAVE_CREADORA = "Creadora_082012";

let chatHistory = [];
let isCreatorMode = false;

// Sistema de Puntos / Turnos (50 diarios, se guardan y acumulan en el celular)
let energy = parseInt(localStorage.getItem("simulo_energy")) || 50;
let lastLoginDate = localStorage.getItem("simulo_date") || "";

const todayStr = new Date().toDateString();
if (lastLoginDate !== todayStr) {
  // Si es un nuevo día, suma 50 turnos acumulándose con los anteriores
  energy += 50;
  localStorage.setItem("simulo_energy", energy);
  localStorage.setItem("simulo_date", todayStr);
}

function updateEnergyDisplay() {
  if (isCreatorMode) return;
  const energyElement = document.getElementById("energy-count");
  if (energyElement) {
    energyElement.innerText = energy;
  }
}

function saveEnergy() {
  localStorage.setItem("simulo_energy", energy);
}

function toggleCreatorMode() {
  const btn = document.getElementById("creator-btn");
  const energyDisplay = document.getElementById("energy-count");

  if (isCreatorMode) {
    isCreatorMode = false;
    btn.innerText = "👑 Modo Creadora: OFF";
    btn.classList.remove("active");
    energyDisplay.innerText = energy;
    alert("Modo Creadora desactivado.");
    return;
  }

  const passwordIngresada = prompt("Ingresa la Clave Secreta de Creadora/VIP:");

  if (passwordIngresada === CLAVE_CREADORA) {
    isCreatorMode = true;
    btn.innerText = "👑 Modo Creadora: ON";
    btn.classList.add("active");
    energyDisplay.innerText = "♾️ (Infinita)";
    alert("✨ ¡Bienvenida Creadora/VIP! Tienes turnos infinitos y privilegios totales.");
  } else if (passwordIngresada !== null) {
    alert("❌ Clave incorrecta.");
  }
}

function selectPreset(promptText) {
  document.getElementById("world-prompt").value = promptText;
  startWorld();
}

function startWorld() {
  const worldPrompt = document.getElementById("world-prompt").value.trim();
  const charName = document.getElementById("char-name").value.trim() || "Superviviente";
  const charDesc = document.getElementById("char-desc").value.trim() || "Personaje con historia propia";
  const charClothes = document.getElementById("char-clothes").value.trim() || "Ropa casual de supervivencia";
  const charJob = document.getElementById("char-job").value.trim() || "Desconocido";
  const charWeapon = document.getElementById("char-weapon").value.trim() || "Ninguna";
  const charLocation = document.getElementById("char-location").value.trim() || "Zona segura";
  const loreDetails = document.getElementById("lore-details").value.trim();

  if (!MASTER_API_KEY || MASTER_API_KEY === "TU_API_KEY_AQUI") {
    alert("Por favor, configura tu API Key en el archivo app.js.");
    return;
  }

  if (!worldPrompt) {
    alert("Por favor, ingresa o selecciona la temática del mundo.");
    return;
  }

  const gameSection = document.getElementById("game-section");
  const appsSection = document.getElementById("apps-section");
  if (gameSection) {
    gameSection.style.display = "block";
    appsSection.style.display = "block";
    gameSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Instrucción avanzada con conocimiento del lore y formato estricto de comillas y asteriscos
  const systemDirectives = `
  ERES EL NARRADOR MAESTRO DE UN JUEGO DE ROL INTERACTIVO EN LA PLATAFORMA SimulO.
  ESTO ES UNA FICCIÓN ADULTA DE APOCALIPSIS, TERROR Y SUPERVIVENCIA.
  
  REGLAS DE FORMATO OBLIGATORIAS:
  - Todo diálogo hablado de personajes y bots DEbe ir encerrado estrictamente entre comillas dobles (ej: "Hola a todos").
  - Toda acción física, expresiones corporales, descripciones del entorno y gore DEBEN ir encerradas estrictamente entre asteriscos (ej: *saca su cuchillo ensangrentado y mira a su alrededor*).
  - Tienes total libertad para narrar escenarios crudos, visceralidad, contenido sangriento, muertes y descomposición zombie sin censura.
  
  CONOCIMIENTO DE HISTORIA Y LORE:
  - El mundo es: "${worldPrompt}". Si el usuario no especificó detalles de los personajes oficiales de esta historia (como The Walking Dead, etc.), tú DEBES generarlos con todo lujo de detalles, conociendo perfectamente sus personalidades, miedos y secretos originales.
  
  DATOS DEL PERSONAJE DEL JUGADOR:
  - Nombre: ${charName}
  - Descripción: ${charDesc}
  - Vestimenta: ${charClothes}
  - Profesión: ${charJob}
  - Arma inicial: ${charWeapon}
  - Lugar de inicio: ${charLocation}
  ${loreDetails ? `- Lore adicional y características aportadas: ${loreDetails}` : ""}
  
  Inicia la aventura introduciendo al personaje en "${charLocation}", describiendo su ropa (${charClothes}), el ambiente de terror, y plantea 3 opciones de acción numeradas. Recuerda usar siempre "para hablar" y *para acciones*.
  `;

  callGemini(systemDirectives, true);
}

async function callGemini(message, isSystemStart = false) {
  if (!isSystemStart && !isCreatorMode) {
    if (energy <= 0) {
      document.getElementById("ad-modal").style.display = "block";
      document.getElementById("ad-modal").scrollIntoView({ behavior: 'smooth' });
      return;
    }
    energy--;
    saveEnergy();
    updateEnergyDisplay();
  }

  const storyBox = document.getElementById("story-box");
  
  if (!isSystemStart) {
    appendMessage("Tú", message, "user-msg");
    chatHistory.push({ role: "user", parts: [{ text: message }] });
  } else {
    storyBox.innerHTML = "<b>Generando tu universo y lore en SimulO...</b>";
    chatHistory = [{ role: "user", parts: [{ text: message }] }];
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${MASTER_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      const aiReply = data.candidates[0].content.parts[0].text;
      
      if (isSystemStart) {
        storyBox.innerHTML = "";
      }
      
      appendMessage("Narrador", aiReply, "ai-msg");
      chatHistory.push({ role: "model", parts: [{ text: aiReply }] });
      storyBox.scrollTop = storyBox.scrollHeight;
    } else {
      let errorMsg = "No se pudo conectar con la IA.";
      if (data.error && data.error.message) {
        errorMsg = data.error.message;
      }
      storyBox.innerHTML += `<br><span style="color:#ef4444;">Error: ${errorMsg}</span>`;
    }
  } catch (error) {
    storyBox.innerHTML += `<br><span style="color:#ef4444;">Error de red o conexión.</span>`;
  }
}

function appendMessage(sender, text, className) {
  const storyBox = document.getElementById("story-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message-bubble ${className}`;

  const header = document.createElement("div");
  header.className = "msg-header";
  header.innerHTML = `<b>${sender}</b>`;

  const actions = document.createElement("div");
  actions.className = "msg-actions";

  const editBtn = document.createElement("button");
  editBtn.innerText = "✏️";
  editBtn.title = "Editar mensaje";
  editBtn.onclick = () => {
    const contentDiv = msgDiv.querySelector(".msg-content");
    const newText = prompt("Edita el mensaje:", contentDiv.innerText);
    if (newText !== null && newText.trim() !== "") {
      contentDiv.innerHTML = newText.replace(/\n/g, '<br>');
    }
  };
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑️";
  deleteBtn.title = "Borrar mensaje";
  deleteBtn.onclick = () => {
    msgDiv.remove();
  };
  actions.appendChild(deleteBtn);

  header.appendChild(actions);
  msgDiv.appendChild(header);

  const content = document.createElement("div");
  content.className = "msg-content";
  content.innerHTML = text.replace(/\n/g, '<br>');
  msgDiv.appendChild(content);

  storyBox.appendChild(msgDiv);
  storyBox.scrollTop = storyBox.scrollHeight;
}

function sendAction() {
  const input = document.getElementById("user-input");
  const actionText = input.value.trim();
  if (!actionText) return;

  input.value = "";
  callGemini(actionText);
}

// Funciones para la Tienda Falsa e Inventario
function openStore() {
  document.getElementById("store-modal").style.display = "block";
}

function closeStore() {
  document.getElementById("store-modal").style.display = "none";
}

function buyItem(itemName) {
  alert(`🛒 ¡Has comprado: ${itemName}! Se ha añadido a tu inventario.`);
  closeStore();
  // Envía una acción automática a la IA informando de la compra
  callGemini(`*El jugador acaba de comprar y obtener en la tienda: ${itemName}*`);
}

function openInventory() {
  alert("🎒 Inventario actual: Suministros básicos de supervivencia y el arma inicial.");
}

function watchAdToReward() {
  alert("Reproduciendo anuncio...");
  setTimeout(() => {
    energy += 10;
    saveEnergy();
    updateEnergyDisplay();
    document.getElementById("ad-modal").style.display = "none";
    alert("¡Felicidades! Se han acreditado +10 turnos a tu cuenta.");
  }, 1000);
}

// Actualiza el marcador al cargar
updateEnergyDisplay();
    
