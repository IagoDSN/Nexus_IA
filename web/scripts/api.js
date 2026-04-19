export async function enviarParaChat(text, username, voice, jarvis) {

    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            text: text,
            username: username,
            voice: voice,
            jarvis: jarvis   
        })
    });

    if (!res.ok) {
        const error = await res.json();
        console.error(error);
        throw new Error("Falha na comunicação com Atlas");
    }

    return await res.json();
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