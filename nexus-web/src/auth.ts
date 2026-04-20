// ===== TIPOS =====

export type User = {
    username: string;
    role: string;
    token?: string;
};

// ===== AUTH =====

export const Auth = {
    saveUser(data: any): void {
        localStorage.setItem("user", JSON.stringify(data));
    },

    getUser(): any | null {
        const data = localStorage.getItem("user");
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    logout(): void {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
    }
};