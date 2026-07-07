import axios from "axios";

// 1. 서버와의 통신 규격을 설정합니다.
const apiClient = axios.create({
    baseURL: "/api", // 서버 주소에 따라 수정이 필요할 수 있습니다.
    headers: {
        "Content-Type": "application/json",
    },
});

const noticeApi = {
    // 2. 공지사항 목록 조회 (페이징 포함)
    getNoticeList: async (page: number, size: number) => {
        const response = await apiClient.get("/notices", {
            params: { page, size },
        });
        return response.data;
    },

    // 3. 공지사항 상세 조회
    getNoticeDetail: async (id: number) => {
        const response = await apiClient.get(`/notices/${id}`);
        return response.data;
    },

    // 4. 공지사항 등록
    createNotice: async (noticeData: { title: string; content: string }) => {
        const response = await apiClient.post("/notices", noticeData);
        return response.data;
    },

    // 5. 공지사항 수정
    updateNotice: async (id: number, noticeData: { title: string; content: string }) => {
        const response = await apiClient.put(`/notices/${id}`, noticeData);
        return response.data;
    },

    // 6. 공지사항 삭제
    deleteNotice: async (id: number) => {
        const response = await apiClient.delete(`/notices/${id}`);
        return response.data;
    },
};

export default noticeApi;
