const chat = document.getElementById('chat');
const enviarBtn = document.getElementById('enviar');
const input = document.getElementById('pergunta');

// Adiciona mensagem no chat
function adicionarMensagem(texto, classe) {
  const msgContainer = document.createElement('div');
  msgContainer.className = `mensagem-container ${classe}`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = classe === 'usuario' ? 'icons/user.png' : 'icons/ia.png';
  avatar.alt = classe === 'usuario' ? 'Você' : 'IA';

  const msg = document.createElement('div');
  msg.className = `mensagem ${classe}`;
  msg.innerText = texto;

  if (classe === 'usuario') {
    msgContainer.appendChild(msg);
    msgContainer.appendChild(avatar);
  } else {
    msgContainer.appendChild(avatar);
    msgContainer.appendChild(msg);
  }

  chat.appendChild(msgContainer);
  chat.scrollTop = chat.scrollHeight;
}

// Enviar pergunta para a IA
async function enviarPergunta() {
  const pergunta = input.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, 'usuario');
  input.value = '';
  input.blur();

  // Adiciona bolha de "Pensando..."
  const pensandoContainer = document.createElement('div');
  pensandoContainer.className = 'mensagem-container ia';

  const pensandoAvatar = document.createElement('img');
  pensandoAvatar.className = 'avatar';
  pensandoAvatar.src = 'icons/ia.png';
  pensandoAvatar.alt = 'IA';

  const pensandoMsg = document.createElement('div');
  pensandoMsg.className = 'mensagem ia';
  pensandoMsg.innerText = '...'; // pode trocar por "Pensando..." ou animar

  pensandoContainer.appendChild(pensandoAvatar);
  pensandoContainer.appendChild(pensandoMsg);
  chat.appendChild(pensandoContainer);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch('https://web-production-6507d3.up.railway.app/pergunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    });

    const data = await response.json();

    // Remove o "pensando..."
    chat.removeChild(pensandoContainer);

    adicionarMensagem(data.resposta, 'ia');
    falar(data.resposta); // IA fala
  } catch (error) {
    chat.removeChild(pensandoContainer);
    adicionarMensagem('Erro ao conectar com a IA.', 'ia');
    console.error(error);
  }
}

// Eventos de clique e Enter
enviarBtn.addEventListener('click', enviarPergunta);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enviarPergunta();
});

// Reconhecimento de voz
const gravarBtn = document.getElementById("gravar");
let reconhecedor;

gravarBtn.onclick = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Navegador não suporta reconhecimento de voz.");
    return;
  }

  reconhecedor = new webkitSpeechRecognition();
  reconhecedor.lang = "pt-BR";
  reconhecedor.interimResults = false;
  reconhecedor.maxAlternatives = 1;

  reconhecedor.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    input.value = texto;
    enviarPergunta();
  };

  reconhecedor.start();
};

// Fala a resposta da IA
function falar(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

