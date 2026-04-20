// ===== CONFIG =====
const API_URL = "http://127.0.0.1:8000";

// ===== TIPOS =====

export type ChatResponse = {
    response: string;
    audio?: string;
};

export type LoginResponse = {
    token: string;
    username: string;
    role: string;
};

export type RegisterResponse = {
    msg: string;
};

// ===== FUNÇÕES =====
export async function enviarParaChat(
    text: string,
    username: string,
    voice: string,
    jarvis: boolean
) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            text,
            username,
            voice,
            jarvis
        })
    });

    if (!res.ok) {
        const error = await res.json();
        console.error("Erro chat:", error);
        throw new Error(error.detail || "Erro no chat");
    }

    return await res.json();
}

export async function realizarLogin(login: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login,
            password
        })
    });

    if (!res.ok) {
        const err = await res.json();
        console.error("Erro login:", err);
        throw new Error(err.detail || "Erro no login");
    }

    const data = await res.json();

    console.log("TOKEN RECEBIDO:", data.token);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        username: data.username,
        role: data.role
    }));

    return data;
}

export async function registrar(username: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/register`, {
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