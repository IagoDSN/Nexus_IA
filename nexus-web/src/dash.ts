// ===== TIPOS =====

type User = {
    username: string;
    email: string;
    role: string;
    created_at?: string;
};

type Message = {
    username: string;
    message: string;
};

type StatsResponse = {
    total_users: number;
    users: User[];
    recent_messages: Message[];
};

// ===== INIT =====
export async function inicializarDashboard() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/admin/stats?t=${Date.now()}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            }
        });

        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("text/html")) {
            console.error("ERRO: O servidor ignorou a rota de API e mandou o Index.");
            return;
        }

        const data = await res.json();
        
        const totalEl = document.getElementById("totalUsers");
        if (totalEl) totalEl.innerText = data.total_users;

        renderizarTabelas(data);
    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }
}
// ===== LOAD =====

async function loadStats(token: string) {
    try {
        const res = await fetch("/admin/stats", {
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

        const data: StatsResponse = await res.json();

        const totalUsers = document.getElementById("totalUsers");
        if (totalUsers) totalUsers.innerText = String(data.total_users);

        const userTable = document.getElementById("userTable") as HTMLElement;
        userTable.innerHTML = "";

        data.users.forEach((user: User) => {

            const dataFormatada = user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "Sem data";

            let actions = "";

            if (user.role === "admin") {
                actions = `<button class="demote" onclick="demoteUser('${user.username}')">Remover Admin</button>`;
            } 
            else if (user.role === "banned") {
                actions = `<button class="unban" onclick="unbanUser('${user.username}')">Desbanir</button>`;
            } 
            else {
                actions = `
                    <button class="ban" onclick="banUser('${user.username}')">Banir</button>
                    <button class="promote" onclick="promoteUser('${user.username}')">Promover</button>
                `;
            }

            userTable.innerHTML += `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${dataFormatada}</td>
                    <td>${actions}</td>
                </tr>
            `;
        });

        const messageTable = document.getElementById("messageTable") as HTMLElement;
        messageTable.innerHTML = "";

        data.recent_messages.forEach((msg: Message) => {
            messageTable.innerHTML += `
                <tr>
                    <td>${msg.username}</td>
                    <td>${msg.message}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Erro na dashboard:", err);
        alert("Erro ao conectar com servidor");
    }
}

// ===== ACTIONS =====

async function banUser(username: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm(`Banir ${username}?`)) return;

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
        alert(error.detail);
        return;
    }

    alert("Usuário banido!");
    loadStats(token);
}

async function unbanUser(username: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm(`Desbanir ${username}?`)) return;

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
        alert(error.detail);
        return;
    }

    alert("Usuário desbanido!");
    loadStats(token);
}

async function promoteUser(username: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm(`Promover ${username}?`)) return;

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
        alert(error.detail);
        return;
    }

    alert("Promovido!");
    loadStats(token);
}

async function demoteUser(username: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

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

(window as any).banUser = banUser;
(window as any).unbanUser = unbanUser;
(window as any).promoteUser = promoteUser;
(window as any).demoteUser = demoteUser;

export async function carregarDashboard() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/admin/stats", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();

    const total = document.getElementById("totalUsers");
    if (total) total.innerText = data.total_users;

    const userTable = document.getElementById("userTable");
    if (userTable) {
        userTable.innerHTML = "";
        data.users.forEach((u: any) => {
            userTable.innerHTML += `
                <tr>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>${u.dateCreated || "-"}</td>
                </tr>
            `;
        });
    }

    const msgTable = document.getElementById("messageTable");
    if (msgTable) {
        msgTable.innerHTML = "";
        data.recent_messages.forEach((m: any) => {
            msgTable.innerHTML += `
                <tr>
                    <td>${m.username}</td>
                    <td>${m.text}</td>
                </tr>
            `;
        });
    }
}

function renderizarTabelas(data: any) {
    const userTable = document.getElementById("userTable");
    const msgTable = document.getElementById("messageTable");

    if (userTable && data.users) {
        userTable.innerHTML = data.users.map((u: any) => {
            const isBanido = u.role === 'banned';
            const isAdmin = u.role === 'admin';

            return `
                <tr>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role}">${u.role}</span></td>
                    <td>
                        <div class="admin-actions">
                            ${isBanido 
                                ? `<button class="btn-unban" onclick="window.unbanUser('${u.username}')">Desbanir</button>` 
                                : isAdmin 
                                    ? '<span class="text-muted">Admin</span>' 
                                    : `<button class="btn-ban" onclick="window.banUser('${u.username}')">Banir</button>`
                            }

                            ${!isBanido ? `
                                ${isAdmin 
                                    ? `<button class="btn-demote" onclick="window.demoteUser('${u.username}')">Rebaixar</button>` 
                                    : `<button class="btn-promote" onclick="window.promoteUser('${u.username}')">Promover</button>`
                                }
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (msgTable && data.recent_messages) {
        msgTable.innerHTML = data.recent_messages.map((m: any) => `
            <tr>
                <td style="color: var(--primary); font-weight: bold;">${m.username}</td>
                <td>${m.message}</td>
            </tr>
        `).join('');
    } else {
        console.warn("Aviso: Elemento 'messageTable' ainda não existe no HTML.");
    }
}