import { WeightLog } from "@/types/WeightLog";
import axiosInstance from "../axiosInstance";

export const weightLogApi = {
    // 1. 조회: 펫별로 가져오니 getByPetId가 명확합니다.
    getByPetId: (petId: number) =>
        axiosInstance.get<{ data: WeightLog[] }>(`/weight-logs/pet/${petId}`),

    // 2. 생성: 생성 역시 펫 데이터를 넣는 것이므로 create가 맞습니다.
    create: (data: { petId: number; weight: number; recordDate: string }) =>
        axiosInstance.post<WeightLog>("/weight-logs", data),

    // 3. 삭제: 삭제도 꼭 추가해두세요!
    delete: (id: number) => axiosInstance.delete(`/weight-logs/${id}`),
};
