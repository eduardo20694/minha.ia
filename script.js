const chat = document.getElementById('chat');
const enviarBtn = document.getElementById('enviar');
const input = document.getElementById('pergunta');

function adicionarMensagem(texto, classe) {
  const msg = document.createElement('div');
  msg.className = `mensagem ${classe}`;
  msg.innerText = texto;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarPergunta() {
  const pergunta = input.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, 'usuario');
  input.value = '';
  input.focus();
  adicionarMensagem('Pensando...', 'ia');

  try {
    const response = await fetch('https://minhaia-6tfz.onrender.com/pergunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    });

    const data = await response.json();

    // Remover "Pensando..."
    const pensando = chat.querySelector('.ia:last-child');
    if (pensando && pensando.innerText === 'Pensando...') pensando.remove();

    adicionarMensagem(data.resposta, 'ia');
  } catch (error) {
    const pensando = chat.querySelector('.ia:last-child');
    if (pensando && pensando.innerText === 'Pensando...') pensando.remove();

    adicionarMensagem('Erro ao conectar com a IA.', 'ia');
    console.error(error);
  }
}

enviarBtn.addEventListener('click', enviarPergunta);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enviarPergunta();
});
