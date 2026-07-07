// 반려동물 공지사항 카테고리 정의
export type NoticeCategory = "general" | "maintenance" | "event";

// 공지사항 단건 데이터 타입
export interface Notice {
    id: number;
    title: string;
    content: string;
    category: NoticeCategory;
    isPinned: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;

    // 🐾 반려동물 서비스 운영을 위한 실무 추가 필드
    author: string; // 작성자 이름 (관리자)
    thumbnailUrl?: string; // 공지사항 썸네일 (이벤트 배너 등)
    fileUrl?: string; // 첨부파일 (예: 예방접종 안내문 PDF 등)
}

// 백엔드 페이징 응답 규격 타입 (구조 유지)
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

// 🐾 API 요청 시 사용할 데이터 스키마 (Create/Update 대응)
export interface NoticeFormData {
    title: string;
    content: string;
    category: NoticeCategory;
    isPinned: boolean;
    thumbnailUrl?: string;
}
