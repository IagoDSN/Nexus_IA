import { elements, adicionarMensagem, alternarTelas, mostrarTela } from './components/ui';
import { enviarParaChat, registrar } from './api/api';
import { VoiceManager } from './core/voice';
import { Auth } from './core/auth';
import { carregarDashboard, inicializarDashboard } from './components/dash';

const API_URL = "http://127.0.0.1:8000";

declare global {
    interface Window {
        lucide: any;
        handleLogin: () => void;
        handleRegister: () => void;
    }
}

if (window.lucide) {
    window.lucide.createIcons();
}

let modoJarvis: boolean = false;

// ================= VOZ =================
const voice = new VoiceManager(
    (textoDetectado: string) => {
        const el = document.getElementById('transcriptPreview');
        if (el) el.innerText = textoDetectado;

        enviarMensagem(textoDetectado);
    },
    () => {
        // @ts-ignore
        if (modoJarvis && !voice.falando) {
            setTimeout(() => voice.start(), 800);
        }
    }
);

// ================= INPUT ENTER =================
if (elements.userInput) {
    elements.userInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    });
}

// ================= REGISTER =================
window.handleRegister = async function () {
    const username = (document.getElementById('userRegister') as HTMLInputElement)?.value;
    const email = (document.getElementById('emailRegister') as HTMLInputElement)?.value;
    const password = (document.getElementById('passRegister') as HTMLInputElement)?.value;

    if (!username || !email || !password) {
        alert("Preencha todos os campos");
        return;
    }

    try {
        await registrar(username, email, password);
        alert("Conta criada! Agora faça login.");
    } catch (e: any) {
        alert(e.message || "Erro ao cadastrar");
    }
};

// ================= LOGIN =================
window.handleLogin = async function () {
    const userIn = document.getElementById("userLogin") as HTMLInputElement;
    const passIn = document.getElementById("passLogin") as HTMLInputElement;

    try {
        const res = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: userIn.value, password: passIn.value })
        });

        if (!res.ok) {
            alert("Credenciais inválidas.");
            return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));

        if (data.role === "admin") {
            mostrarTela('admin');
            inicializarDashboard();
        } else {
            mostrarTela('chat');
        }
    } catch (err) {
        console.error("Erro no login:", err);
    }
};

document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'adminLogoutBtn' || target.closest('#adminLogoutBtn')) {
        console.log("Saindo do painel admin...");
        localStorage.clear();
        window.location.href = "/"; 
    }
});

// ================= CHAT =================
async function enviarMensagem(textoVoz: string | null = null) {
    const user = Auth.getUser();

    if (!user) {
        alert("Você precisa estar logado.");
        return;
    }

    const input = document.getElementById("userInput") as HTMLTextAreaElement | null;
    if (input) {
        console.log(input.value);
    }

    const text = textoVoz || input?.value.trim();

    if (!text) return;

    if (!textoVoz && input) input.value = '';

    adicionarMensagem(text, 'user');

    if (modoJarvis && elements.transcriptPreview) {
        elements.transcriptPreview.innerText = "Processando...";
    }

    const loadingId = adicionarMensagem("Processando...", 'ai');

    try {
        const voiceSelect = document.getElementById('voiceGender') as HTMLSelectElement;

        const data = await enviarParaChat(
            text,
            user.username,
            voiceSelect?.value || "male",
            modoJarvis
        );

        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();

        adicionarMensagem(data.response, 'ai');

        if (modoJarvis && elements.transcriptPreview) {
            elements.transcriptPreview.innerText = data.response;
        }

        if (modoJarvis && data.audio) {
            voice.tocarAudio(data.audio, () => {
                if (modoJarvis && elements.transcriptPreview) {
                    elements.transcriptPreview.innerText = "Escutando...";
                    voice.start();
                }
            });
        }

    } catch (err) {
        console.error(err);
        if (modoJarvis && elements.transcriptPreview) {
            elements.transcriptPreview.innerText = "Erro.";
        }
    }
}

// ================= EVENTOS =================
document.addEventListener('DOMContentLoaded', () => {

    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.onclick = () => enviarMensagem();

    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.onclick = () => {
            modoJarvis = true;

            if (elements.jarvisOverlay) {
                elements.jarvisOverlay.style.display = "flex";
            }

            if (elements.jarvisOrb) {
                const voiceSelect = document.getElementById('voiceGender') as HTMLSelectElement;
                elements.jarvisOrb.className = `orb ${voiceSelect?.value}`;
            }

            voice.start();
        };
    }

    const cancelVoice = document.getElementById('cancelVoice');
    if (cancelVoice) {
        cancelVoice.onclick = () => {
            modoJarvis = false;

            if (elements.jarvisOverlay) {
                elements.jarvisOverlay.style.display = "none";
            }

            voice.stop();
        };
    }

    if (Auth.getUser()) {
        alternarTelas(true);

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
});

// ================= LOGOUT =================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("user");
        location.reload();
    };
}

// ================= ADMIN PANEL =================
function mostrarAdmin() {
    const login = document.getElementById("loginSection");
    const app = document.getElementById("mainApp");
    const admin = document.getElementById("adminPanel");

    if (login) login.style.display = "none";
    if (app) app.style.display = "none";
    if (admin) admin.style.display = "block";

    carregarDashboard();
}

document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'adminLogout' || target.closest('#adminLogout')) {
        localStorage.clear();
        window.location.href = "/";
    }
});