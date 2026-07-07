import axios from "axios";
import { Notice, PaginatedNoticeResponse} from "../../types/notice";
import { NoticeFormData } from "./noticeSchema";
import { noticeFormSchema } from "@/schemas/noticeSchema";
import { z } from "zod";

// 1. 인스턴스 생성 (베이스 URL 관리)
// eslint-disable-next-line import/no-named-as-default-member
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/notices",
    headers: { "Content-Type": "application/json" },
});

export const noticeApi = {
    // 목록 조회
    getNotices: async (page: number, size: number): Promise<PaginatedNoticeResponse> => {
        const response = await apiClient.get(`?page=${page}&size=${size}`);
        return response.data;
    },

    // 상세 조회
    getNoticeById: async (id: number): Promise<{ success: boolean; data: Notice }> => {
        const response = await apiClient.get(`/${id}`);
        return response.data;
    },

    // 작성
    createNotice: async (data: NoticeFormData) => {
        const response = await apiClient.post("", data);
        return response.data;
    },

    // 2. 수정 API 추가 (필수!)
    updateNotice: async (id: number, data: NoticeFormData) => {
        const response = await apiClient.put(`/${id}`, data);
        return response.data;
    },

    // 삭제
    deleteNotice: async (id: number) => {
        const response = await apiClient.delete(`/${id}`);
        return response.data;
    },
};

export type NoticeFormData = z.infer<typeof noticeFormSchema>;
