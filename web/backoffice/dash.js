document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || user.role !== "admin") {
        alert("Acesso negado");
        window.location.href = "../index.html";
        return;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "../index.html";
        });
    }

    loadStats(token);
});
async function loadStats(token) {
    try {
        const res = await fetch("http://127.0.0.1:8000/admin/stats", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Erro backend:", error);
            alert(error.detail || "Erro ao carregar dashboard");
            return;
        }

        const data = await res.json();

        document.getElementById("totalUsers").innerText = data.total_users;

        const userTable = document.getElementById("userTable");
        userTable.innerHTML = "";

        data.users.forEach(user => {

            const dataFormatada = user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "Sem data";

            let actions = "";

            if (user.role === "admin") {
                actions = `
            <button class="demote" onclick="demoteUser('${user.username}')">Remover Admin</button>
        `;
            } else if (user.role === "banned") {
                actions = `
            <button class="unban" onclick="unbanUser('${user.username}')">Desbanir</button>
        `;
            } else {
                actions = `
            <button class="ban" onclick="banUser('${user.username}')">Banir</button>
            <button class="promote" onclick="promoteUser('${user.username}')">Promover</button>
        `;
            }

            const row = `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${dataFormatada}</td>
            <td>${actions}</td>
        </tr>
    `;

            userTable.innerHTML += row;
        });
        const messageTable = document.getElementById("messageTable");
        messageTable.innerHTML = "";

        data.recent_messages.forEach(msg => {
            const row = `
                <tr>
                    <td>${msg.username}</td>
                    <td>${msg.message}</td>
                </tr>
            `;
            messageTable.innerHTML += row;
        });

    } catch (err) {
        console.error("Erro na dashboard:", err);
        alert("Erro ao conectar com servidor");
    }
}
async function banUser(username) {
    const token = localStorage.getItem("token");

    if (!confirm(`Banir ${username}?`)) return;

    try {
        const res = await fetch("http://127.0.0.1:8000/admin/ban", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Erro ao banir");
            return;
        }

        alert("Usuário banido!");
        loadStats(token);

    } catch (err) {
        console.error("Erro ao banir:", err);
        alert("Erro de conexão");
    }
}
async function unbanUser(username) {
    const token = localStorage.getItem("token");

    if (!confirm(`Desbanir ${username}?`)) return;

    try {
        const res = await fetch("http://127.0.0.1:8000/admin/unban", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Erro ao desbanir");
            return;
        }

        alert("Usuário desbanido!");
        loadStats(token);

    } catch (err) {
        console.error("Erro ao desbanir:", err);
        alert("Erro de conexão");
    }
}
async function promoteUser(username) {
    const token = localStorage.getItem("token");

    if (!confirm(`Promover ${username} para admin?`)) return;

    const res = await fetch("http://127.0.0.1:8000/admin/promote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username })
    });

    if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Erro ao promover");
        return;
    }

    alert("Usuário promovido!");
    loadStats(token);
}
async function demoteUser(username) {
    const token = localStorage.getItem("token");

    if (!confirm(`Remover admin de ${username}?`)) return;

    const res = await fetch("http://127.0.0.1:8000/admin/demote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username })
    });

    if (!res.ok) {
        const error = await res.json();
        alert(error.detail);
        return;
    }

    alert("Admin removido!");
    loadStats(token);
}