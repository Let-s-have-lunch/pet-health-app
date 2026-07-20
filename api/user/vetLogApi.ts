import axiosInstance from "../axiosInstance";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import axios from "axios";
import { VetRecord } from "@/types/vetRecord";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

export const vetLogApi = {

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


    getByPetId: async (petId: number) => {
        return await axiosInstance.get(`/vet-records/pet/${petId}`);
    },


    getById: async (id: number): Promise<VetRecord> => {
        const response = await axiosInstance.get(`/vet-records/${id}`, {
            data: { id: id },
        });
        return response.data.data;
    },


    update: async (id: number, data: FormData) => {
        return await axiosInstance.put(`/vet-records/${id}`, data);
    },


    delete: (id: number) => axiosInstance.delete(`/vet-records/${id}`),

    updateWithImage: (id: number, formData: FormData) =>
        axiosInstance.put(`/vet-logs/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};
