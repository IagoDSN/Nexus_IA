import { elements, adicionarMensagem, alternarTelas } from './ui.js';
import { enviarParaChat, realizarLogin, registrar } from './api.js';
import { VoiceManager } from './voice.js';
import { Auth } from './auth.js';

let modoJarvis = false;

// 1. Inicializa Voz
const voice = new VoiceManager(
    (textoDetectado) => {
        document.getElementById('transcriptPreview').innerText = textoDetectado;
        enviarMensagem(textoDetectado);
    },
    () => { 
        if (modoJarvis && !voice.falando) setTimeout(() => voice.start(), 800); 
    }
);

// enviar mensagem ao pressionar Enter no input
elements.userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// 2. FUNÇÃO DE LOGIN/REGISTRO (EXPOSTA NO HTML)
window.handleLogin = async function() {
    const u = document.getElementById('userLogin').value;
    const p = document.getElementById('passLogin').value;
    
    if (!u || !p) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const data = await realizarLogin(u, p);
        Auth.saveUser(data);
        alternarTelas(true);
        if (window.lucide) window.lucide.createIcons();
    } catch (e) {
        alert("Acesso negado: Usuário ou senha inválidos.");
    }
};
window.handleRegister = async function () {
    const username = document.getElementById('userRegister').value;
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passRegister').value;

    if (!username || !email || !password) {
        alert("Preencha todos os campos");
        return;
    }

    try {
        await registrar(username, email, password);
        alert("Conta criada! Agora faça login.");
    } catch (e) {
        alert(e.message || "Erro ao cadastrar");
    }
};

// 3. FUNÇÃO DE ENVIAR MENSAGEM
async function enviarMensagem(textoVoz = null) {
    const user = Auth.getUser();

    if (!user) {
        alert("Você precisa estar logado.");
        return;
    }

    const text = textoVoz || elements.userInput.value.trim();
    if (!text) return;

    if (!textoVoz) elements.userInput.value = '';

    adicionarMensagem(text, 'user');

    if (modoJarvis) {
        elements.transcriptPreview.innerText = "Processando...";
    }

    const loadingId = adicionarMensagem("Processando...", 'ai');

    try {
        const data = await enviarParaChat(
            text,
            user.username,
            document.getElementById('voiceGender').value,
            modoJarvis
        );

        // remove loading
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();

        adicionarMensagem(data.response, 'ai');

        if (modoJarvis) {
            elements.transcriptPreview.innerText = data.response;
        }

        if (modoJarvis && data.audio) {
            voice.tocarAudio(data.audio, () => {
                if (modoJarvis) {
                    elements.transcriptPreview.innerText = "Escutando...";
                    voice.start();
                }
            });
        }

    } catch (err) {
        console.error(err);
        if (modoJarvis) {
            elements.transcriptPreview.innerText = "Erro.";
        }
    }
}

// 4. CONFIGURAÇÃO DE EVENTOS (QUANDO A PÁGINA CARREGA)
document.addEventListener('DOMContentLoaded', () => {
    // Configura botões via ID
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.onclick = () => enviarMensagem();

    const micBtn = document.getElementById('micBtn');
    if (micBtn) micBtn.onclick = () => {
        modoJarvis = true;
        elements.jarvisOverlay.style.display = "flex";
        elements.jarvisOrb.className = `orb ${document.getElementById('voiceGender').value}`;
        voice.start();
    };

    const cancelVoice = document.getElementById('cancelVoice');
    if (cancelVoice) cancelVoice.onclick = () => {
        modoJarvis = false;
        elements.jarvisOverlay.style.display = "none";
        voice.stop();
    };

    // Auto-login se já existir sessão no localStorage
    // if (Auth.getUser()) {
    //     alternarTelas(true);
    //     if (window.lucide) window.lucide.createIcons();
    // }
});