import { WeightLog } from "@/types/WeightLog";
import { WeightLogInputType } from "@/schemas/weightLog/weightLogSchema";
import axiosInstance from "../axiosInstance";

export const weightLogApi = {
    // 1. 조회
    getByPetId: (petId: number) => axiosInstance.get(`/weight-logs/pet/${petId}`),

    // 2. 통계
    getStats: (petId: number, startDate: string, endDate: string) =>
        axiosInstance.get(`/weight-logs/pet/${petId}/stats`, {
            params: { startDate, endDate },
        }),

    // 3. 생성
    create: (petId: number, data: WeightLogInputType) =>
        axiosInstance.post<WeightLog>("/weight-logs", { petId, ...data }),

    // 4. 수정 (🚨 백엔드 스키마 검증 통과를 위해 바디에 petId 병합!)
    update: (id: number, petId: number, data: WeightLogInputType) =>
        axiosInstance.put<{ message: string; data: WeightLog }>(`/weight-logs/${id}`, {
            petId,
            ...data,
        }),

    // 5. 삭제
    delete: (id: number) => axiosInstance.delete(`/weight-logs/${id}`),
};
