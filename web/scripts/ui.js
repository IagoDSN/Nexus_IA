export const elements = {
    userInput: document.getElementById('userInput'),
    messagesContainer: document.getElementById('messagesContainer'),
    jarvisOverlay: document.getElementById("jarvisOverlay"),
    transcriptPreview: document.getElementById("transcriptPreview"),
    jarvisOrb: document.getElementById("jarvisOrb"),
    loginSection: document.getElementById('loginSection'),
    mainApp: document.getElementById('mainApp')
};

export function adicionarMensagem(text, type) {
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = `message ${type}-message`;
    div.innerHTML = `<div class="message-content">${text}</div>`;
    elements.messagesContainer.appendChild(div);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    return id;
}

export function alternarTelas(logado) {
    const login = document.getElementById("loginSection");
    const app = document.getElementById("mainApp");

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