import { WeightLog } from "@/types/weightLog";
import { WeightLogInputType } from "@/schemas/weightLog/weightLogSchema";
import axiosInstance from "../axiosInstance";

export const weightLogApi = {

    getByPetId: (petId: number) => axiosInstance.get(`/weight-logs/pet/${petId}`),


    getStats: (petId: number, startDate: string, endDate: string) =>
        axiosInstance.get(`/weight-logs/pet/${petId}/stats`, {
            params: { startDate, endDate },
        }),


    create: (petId: number, data: WeightLogInputType) =>
        axiosInstance.post<WeightLog>("/weight-logs", { petId, ...data }),


    update: (id: number, petId: number, data: WeightLogInputType) =>
        axiosInstance.put<{ message: string; data: WeightLog }>(`/weight-logs/${id}`, {
            petId,
            ...data,
        }),


    delete: (id: number) => axiosInstance.delete(`/weight-logs/${id}`),
};
