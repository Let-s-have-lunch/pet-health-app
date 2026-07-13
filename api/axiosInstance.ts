import { create } from "axios";
import { useAuthStore } from "@/stores/auth/useAuthStore";


const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = create({
    baseURL: BASE_URL,
    timeout: 3000,
    withCredentials: true,
});

export default api;


api.interceptors.request.use(config => {
    const { token } = useAuthStore.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
