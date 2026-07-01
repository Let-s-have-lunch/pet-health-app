import { create } from "axios";
import { useAuthStore } from "@/stores/auth/useAuthStore";

// React는 VITE를 통해 구동을 시켰기 때문에 환경번수의 접두사가 VITE_로 시작함
// React-Native + Expo 환경에서는 VITE_ 대신 EXPO_PUBLIC_으로 접두사가 시작함

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = create({
    baseURL: BASE_URL, // 직접 주소를 코드 상에 기재하지 않고, 환경변수를 통해 값을 집어 넣어야 함
    timeout: 3000, // 통신에 안된다고 판단하는 기준 시간
    withCredentials: true, // 쿠키를 사용할 수 있도록 설정
});

export default api;

// 인터셉터를 쓸 수 있음
api.interceptors.request.use(config => {
    const { token } = useAuthStore.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
