// INITIALIZAÇÃO
lucide.createIcons();

const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const messagesContainer = document.getElementById('messagesContainer');
const audioPlayer = document.getElementById('responseAudio');
const voiceGender = document.getElementById('voiceGender');

// JARVIS UI
const jarvisOverlay = document.getElementById("jarvisOverlay");
const jarvisOrb = document.getElementById("jarvisOrb");
const transcriptPreview = document.getElementById("transcriptPreview");
const cancelVoice = document.getElementById("cancelVoice");

// ESTADO
let modoJarvis = false;
let recognition = null;
let escutando = false;
let falando = false;
let recognitionAtivo = false;


// CONFIG MICROFONE
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


function iniciarReconhecimento() {
    if (!recognition) return;

    try {
        recognition.start();
        recognitionAtivo = true;
        console.log("Microfone iniciado");
    } catch (e) {
        console.log("Erro ao iniciar mic:", e);
    }
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
        escutando = true;
        console.log("Escutando...");
    };

    recognition.onend = () => {
        escutando = false;
        console.log("Mic desligado");

        if (modoJarvis && !falando) {
            setTimeout(() => {
                iniciarReconhecimento();
            }, 800);
        }
    };

    recognition.onerror = (err) => {
        console.warn("Erro mic:", err);

        if (modoJarvis) {
            setTimeout(() => {
                try { iniciarReconhecimento(); } catch { }
            }, 1000);
        }
    };

    recognition.onresult = (event) => {

        if (falando) {
            console.log("Ignorando, IA ainda está falando...");
            return;
        }

        const texto = event.results[0][0].transcript;
        console.log("Você disse:", texto);

        enviarMensagem(texto);
    };

} else {
    console.warn("Web Speech API não suportada");
}

// ENVIAR MENSAGEM
async function enviarMensagem(textoVoz = null) {
    if (falando) {
        console.log("Ignorando voz enquanto IA fala...");
        return;
    }

    const text = textoVoz ? textoVoz : userInput.value.trim();
    if (!text) return;

    if (!textoVoz) userInput.value = '';

    adicionarMensagem(text, 'user');

    const loadingId = adicionarMensagem("Digitando...", 'ai');

    try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                voice: voiceGender.value,
                jarvis: modoJarvis
            })
        });

        const data = await response.json();

        // remove loading
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();

        adicionarMensagem(data.response, 'ai');

        // mostra resposta no overlay
        transcriptPreview.innerText = data.response;

        // evitar loop
        if (recognition && escutando) {
            recognition.stop();
        }

        if (data.audio) {
            console.log("Tocando:", data.audio);
            tocarAudio(data.audio);
        } else {
            console.warn("Sem áudio");
            fecharOverlay();
        }

    } catch (err) {
        console.error(err);

        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) {
            loadingMsg.innerText = "Erro no backend.";
        }
    }
}

// ADICIONAR MENSAGEM
function adicionarMensagem(text, type) {
    const id = 'msg-' + Date.now();

    const div = document.createElement('div');
    div.id = id;
    div.className = `message ${type}-message`;

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerText = text;

    div.appendChild(content);
    messagesContainer.appendChild(div);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return id;
}

// TOCAR ÁUDIO
function tocarAudio(url) {
    falando = true;
    if (recognitionAtivo) {
        try {
            recognition.stop();
            recognitionAtivo = false;
        } catch { }
    }
    const audioPlayer = new Audio(url);
    audioPlayer.play();

    audioPlayer.onended = () => {
        console.log("IA terminou de falar");

        falando = false;

        jarvisOrb.style.transform = "scale(1)";

        // reativa microfone
        if (modoJarvis && recognition) {
            setTimeout(() => {
                iniciarReconhecimento();
            }, 500);
        }
    };
}

// ABRIR JARVIS
micBtn.addEventListener('click', () => {
    if (!recognition) return;

    modoJarvis = true;

    // mostra overlay
    jarvisOverlay.style.display = "flex";

    // define cor da orb
    jarvisOrb.classList.remove("male", "female");
    jarvisOrb.classList.add(voiceGender.value);

    transcriptPreview.innerText = "escutando...";

    try { iniciarReconhecimento(); } catch { }
});

// FECHAR JARVIS
function fecharOverlay() {
    jarvisOverlay.style.display = "none";
}

cancelVoice.addEventListener("click", () => {
    modoJarvis = false;
    fecharOverlay();

    if (recognition) recognition.stop();
});

// BOTÕES
sendBtn.addEventListener('click', enviarMensagem);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});