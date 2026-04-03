// =========================
// INIT
// =========================
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

// =========================
// ESTADO
// =========================
let modoJarvis = false;
let recognition = null;
let escutando = false;

// =========================
// CONFIG MICROFONE
// =========================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        escutando = true;
        console.log("Escutando...");
    };

    recognition.onend = () => {
        escutando = false;

        if (modoJarvis) {
            setTimeout(() => {
                try { recognition.start(); } catch { }
            }, 800);
        }
    };

    recognition.onerror = (err) => {
        console.warn("Erro mic:", err);

        if (modoJarvis) {
            setTimeout(() => {
                try { recognition.start(); } catch { }
            }, 1000);
        }
    };

    recognition.onresult = (event) => {
        let transcript = '';

        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        if (!transcript.trim()) return;

        console.log("Você:", transcript);

        transcriptPreview.innerText = transcript;
        userInput.value = transcript;

        enviarMensagem();
    };

} else {
    console.warn("Web Speech API não suportada");
}

// =========================
// ENVIAR MENSAGEM
// =========================
async function enviarMensagem() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';

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

// =========================
// ADICIONAR MENSAGEM
// =========================
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

// =========================
// TOCAR ÁUDIO
// =========================
function tocarAudio(src) {
    audioPlayer.src = src;

    // anima orb
    jarvisOrb.style.transform = "scale(1.3)";

    audioPlayer.play().catch(() => {
        console.warn("Autoplay bloqueado");
    });

    audioPlayer.onended = () => {
        jarvisOrb.style.transform = "scale(1)";

        if (modoJarvis && recognition) {
            try { recognition.start(); } catch { }
        }
    };
}

// =========================
// ABRIR JARVIS
// =========================
micBtn.addEventListener('click', () => {
    if (!recognition) return;

    modoJarvis = true;

    // mostra overlay
    jarvisOverlay.style.display = "flex";

    // define cor da orb
    jarvisOrb.classList.remove("male", "female");
    jarvisOrb.classList.add(voiceGender.value);

    transcriptPreview.innerText = "escutando...";

    try { recognition.start(); } catch { }
});

// =========================
// FECHAR JARVIS
// =========================
function fecharOverlay() {
    jarvisOverlay.style.display = "none";
}

cancelVoice.addEventListener("click", () => {
    modoJarvis = false;
    fecharOverlay();

    if (recognition) recognition.stop();
});

// =========================
// BOTÕES
// =========================
sendBtn.addEventListener('click', enviarMensagem);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});