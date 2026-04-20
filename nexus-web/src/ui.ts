export const elements = {
    userInput: document.getElementById('userInput') as HTMLTextAreaElement,
    messagesContainer: document.getElementById('messagesContainer') as HTMLDivElement,
    jarvisOverlay: document.getElementById("jarvisOverlay") as HTMLDivElement,
    transcriptPreview: document.getElementById("transcriptPreview") as HTMLDivElement,
    jarvisOrb: document.getElementById("jarvisOrb") as HTMLDivElement,
    loginSection: document.getElementById('loginSection') as HTMLDivElement,
    mainApp: document.getElementById('mainApp') as HTMLDivElement,
    adminPanel: document.getElementById('adminPanel') as HTMLDivElement
};

type MessageType = "user" | "ai";

export function adicionarMensagem(text: string, type: MessageType): string {
    const id = 'msg-' + Date.now();

    const div = document.createElement('div');
    div.id = id;
    div.className = `message ${type}-message`;
    div.innerHTML = `<div class="message-content">${text}</div>`;

    elements.messagesContainer.appendChild(div);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;

    return id;
}

export function alternarTelas(logado: boolean): void {
    const login = elements.loginSection;
    const app = elements.mainApp;

    if (logado) {
        login.classList.remove("show");

        setTimeout(() => {
            login.style.display = "none";
            app.style.display = "block";

            // força reflow
            void app.offsetWidth;

            app.classList.add("show");
        }, 300);

    } else {
        app.classList.remove("show");

        setTimeout(() => {
            app.style.display = "none";

            login.style.display = "flex";

            void login.offsetWidth;

            login.classList.add("show");
        }, 300);
    }
}

export function mostrarTela(tela: 'login' | 'chat' | 'admin'): void {
    // Esconde todas as seções
    elements.loginSection.style.display = 'none';
    elements.mainApp.style.display = 'none';
    if (elements.adminPanel) elements.adminPanel.style.display = 'none';

    [elements.loginSection, elements.mainApp, elements.adminPanel].forEach(el => {
        if (el) el.classList.remove('show');
    });

    let alvo: HTMLElement | null = null;
    if (tela === 'login') alvo = elements.loginSection;
    if (tela === 'chat') alvo = elements.mainApp;
    if (tela === 'admin') alvo = elements.adminPanel;

    if (alvo) {
        alvo.style.display = (tela === 'login') ? 'flex' : 'block';
        setTimeout(() => alvo?.classList.add('show'), 10);
    }
}