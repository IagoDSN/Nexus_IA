import { Auth } from './auth.js';

export async function enviarParaChat(text, username, voice, jarvis) {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
            text,
            username,
            voice,
            jarvis
        })
    });

    if (!res.ok) {
        const err = await res.json();
        console.error("Erro:", err);
        throw new Error("Falha na comunicação com Atlas");
    }

    return res.json();
}

export async function realizarLogin(login, password) {
    const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: login,
            password: password
        })
    });

    if (!res.ok) {
        const err = await res.json();
        console.error("Erro login:", err);
        throw new Error(err.detail);
    }

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data));

    return data;
}

export async function registrar(username, email, password) {
    const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Erro no cadastro");
    }

    return data;
}