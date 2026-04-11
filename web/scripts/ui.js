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

export function alternarTelas(isLogged) {
    elements.loginSection.style.display = isLogged ? 'none' : 'flex';
    elements.mainApp.style.display = isLogged ? 'flex' : 'none';
}