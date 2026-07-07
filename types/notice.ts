// 반려동물 공지사항 카테고리 정의
export type NoticeCategory = "general" | "maintenance" | "event";

// 공지사항 단건 데이터 타입 (백엔드 스키마와 1:1 매칭)
export interface Notice {
    id: number;
    title: string;
    content: string;
    category: NoticeCategory;
    isPinned: boolean;
    views: number;
    createdAt: string; // ISO String형태로 넘어오므로 string 처리
    updatedAt: string;
}

// 백엔드 페이징 응답 규격 타입
export interface PaginatedNoticeResponse {
    success: boolean;
    message: string;
    data: {
        page: number;
        size: number;
        total: number;
        list: Notice[];
    };
}
