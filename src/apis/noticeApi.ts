import axios from "axios";
import { Notice, PaginatedNoticeResponse, NoticeFormData } from "../types/notice";

// 환경변수에 설정된 백엔드 주소 (예: http://localhost:8000/api/notices)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/notices";

export const noticeApi = {
    // 1. 목록 조회
    getNotices: async (page: number, size: number): Promise<PaginatedNoticeResponse> => {
        const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`);
        return response.data;
    },

    // 2. 상세 조회
    getNoticeById: async (id: number): Promise<{ success: boolean; data: Notice }> => {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // 3. 작성 (Zod 스키마로 검증된 데이터를 보냄)
    createNotice: async (data: NoticeFormData) => {
        const response = await axios.post(BASE_URL, data);
        return response.data;
    },

    // 4. 삭제
    deleteNotice: async (id: number) => {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    },
};
