import axiosInstance from "../axiosInstance";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";


export const vetLogApi = {
    // 1. 병원 기록 생성 (POST /vet-records)
    create: async (formData: FormData) => {
        console.log(formData);
        const { token } = useAuthStore.getState();

        const response = await fetch(BASE_URL + "/vet-records", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("업로드 실패");
        }

        return await response.json();
    },

    // 2. 특정 반려동물의 전체 기록 조회 (GET /vet-records/pet/:petId)
    getByPetId: async (petId: number) => {
        return await axiosInstance.get(`/vet-records/pet/${petId}`);
    },

    // 3. 특정 병원 기록 상세 조회 (GET /vet-records/:id)
    getById: async (id: number) => {
        return await axiosInstance.get(`/vet-records/${id}`);
    },

    // 4. 병원 기록 수정 (PUT /vet-records/:id)
    update: async (
        id: number,
        data: {
            petId?: number;
            hospitalName?: string;
            visitPurpose?: string;
            visitDate?: string;
            diagnosis?: string;
            treatment?: string;
            cost?: number;
            memo?: string;
        },
    ) => {
        return await axiosInstance.put(`/vet-records/${id}`, data);
    },

    // 5. 병원 기록 삭제 (DELETE /vet-records/:id)
    delete: (id: number) => axiosInstance.delete(`/vet-records/${id}`),

    updateWithImage: (id: number, formData: FormData) =>
        axiosInstance.put(`/vet-logs/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};
