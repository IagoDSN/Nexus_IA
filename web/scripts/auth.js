export const Auth = {
    saveUser(data) {
        localStorage.setItem("user", JSON.stringify(data));
    },

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    },

    getToken() {
        const user = this.getUser();
        return user?.token;
    },

    logout() {
        localStorage.removeItem("user");
    }
};