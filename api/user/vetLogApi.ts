import axiosInstance from "../axiosInstance";

export const vetLogApi = {
    // 1. 병원 기록 생성 (POST /vet-records)
    create: async (data: {
        petId: number;
        visitDate: string;
        hospitalName: string;
        visitPurpose: string;
        diagnosis?: string;
        treatment?: string;
        cost?: number;
        memo?: string;
    }) => {
        return await axiosInstance.post("/vet-records", data);
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
    remove: async (id: number) => {
        return await axiosInstance.delete(`/vet-records/${id}`);
    },
};
