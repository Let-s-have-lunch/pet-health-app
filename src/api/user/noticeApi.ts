import axios from "axios";
import { z } from "zod";
import { Notice, PaginatedNoticeResponse } from "../../types/notice";
import { noticeFormSchema } from "@/schemas/noticeSchema";

// 1. 인스턴스 생성 (베이스 URL 관리)
// 환경 변수에 따라 개발/운영 환경 대응이 가능합니다.
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

// 2. 타입 정의
export type NoticeFormData = z.infer<typeof noticeFormSchema>;

// 3. API 객체
export const noticeApi = {
    // 목록 조회 (이름을 getNoticeList로 통일)
    getNoticeList: async (page: number, size: number): Promise<PaginatedNoticeResponse> => {
        const response = await apiClient.get("/api/notices", {
            params: { page, size },
        });
        return response.data;
    },

    // 상세 조회
    getNoticeById: async (id: number): Promise<{ success: boolean; data: Notice }> => {
        const response = await apiClient.get(`/api/notices/${id}`);
        return response.data;
    },

    // 작성
    createNotice: async (data: NoticeFormData) => {
        const response = await apiClient.post("/api/notices", data);
        return response.data;
    },

    // 수정
    updateNotice: async (id: number, data: NoticeFormData) => {
        const response = await apiClient.put(`/api/notices/${id}`, data);
        return response.data;
    },

    // 삭제
    deleteNotice: async (id: number) => {
        const response = await apiClient.delete(`/api/notices/${id}`);
        return response.data;
    },
};
