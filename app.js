let apiKey = "";
let chatHistory = [];

function startWorld() {
  apiKey = document.getElementById("api-key").value.trim();
  const promptText = document.getElementById("world-prompt").value.trim();

  if (!apiKey) {
    alert("Por favor, introduce tu API Key de Gemini.");
    return;
  }

  if (!promptText) {
    alert("Por favor, describe la temática o historia de tu mundo.");
    return;
  }

  document.getElementById("game-section").style.display = "block";
  
  const initialInstruction = `Eres el narrador de un mundo interactivo. La temática inicial es: "${promptText}". 
  Comienza la aventura describiendo la escena inicial de forma inmersiva y termina planteando una situación u opción para que el usuario decida qué hacer. Mantén los párrafos breves.`;

  callGemini(initialInstruction, true);
}

async function callGemini(message, isSystemStart = false) {
  const storyBox = document.getElementById("story-box");
  
  if (!isSystemStart) {
    storyBox.innerHTML += `<br><br><b>Tú:</b> ${message}<br>`;
    chatHistory.push({ role: "user", parts: [{ text: message }] });
  } else {
    storyBox.innerHTML = "<b>Cargando tu mundo...</b>";
    chatHistory = [{ role: "user", parts: [{ text: message }] }];
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
      
      storyBox.innerHTML += `<br><b>Narrador:</b> ${aiReply}<br>`;
      chatHistory.push({ role: "model", parts: [{ text: aiReply }] });
      storyBox.scrollTop = storyBox.scrollHeight;
    } else {
      let errorMsg = "No se pudo conectar con la IA.";
      if (data.error && data.error.message) {
        errorMsg = data.error.message;
      }
      storyBox.innerHTML += `<br><span style="color:red;">Error: ${errorMsg}</span>`;
    }
  } catch (error) {
    storyBox.innerHTML += `<br><span style="color:red;">Error de red o conexión.</span>`;
  }
}

function sendAction() {
  const input = document.getElementById("user-input");
  const actionText = input.value.trim();
  if (!actionText) return;

  input.value = "";
  callGemini(actionText);
}
