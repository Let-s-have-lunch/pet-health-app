import { WaterIntakeLog } from "@/types/WaterIntakeLog";
import axiosInstance from "../axiosInstance";

export const waterIntakeApi = {
    // 1. 조회: 펫별로 가져오기 (water-intakes ➡️ water-logs로 변경)
    getByPetId: (petId: number) =>
        axiosInstance.get<{ data: WaterIntakeLog[] }>(`/water-logs/pet/${petId}`),

    // 2. 생성: 새로운 음수량 기록 등록 (water-intakes ➡️ water-logs로 변경)
    create: (data: { petId: number; amount: number; recordDate: string; memo?: string }) =>
        axiosInstance.post<WaterIntakeLog>("/water-logs", data),

    // 3. 삭제: 기존 기록 삭제 (water-intakes ➡️ water-logs로 변경)
    delete: (id: number) => axiosInstance.delete(`/water-logs/${id}`),

    // 4. 수정: 기존 기록 수정 (water-intakes ➡️ water-logs로 변경)
    update: (
        id: number,
        data: { petId: number; amount: number; recordDate: string; memo?: string },
    ) => axiosInstance.put<{ message: string; data: WaterIntakeLog }>(`/water-logs/${id}`, data),
};
