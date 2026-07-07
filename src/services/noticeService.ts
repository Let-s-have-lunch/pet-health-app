import { PrismaClient } from "../app/generated/prisma/index.ts"; // 프로젝트 구조에 맞게 프리즈마 경로 확인

const prisma = new PrismaClient();

// 1. 공지사항 전체 목록 조회 (고정글 우선 -> 최신순 정렬)
export const getAllNotices = async () => {
    return await prisma.notice.findMany({
        orderBy: [
            { isPinned: "desc" }, // 중요 고정글이 참(true)인 것을 최상단으로
            { createdAt: "desc" }, // 그다음 최신 등록순으로 정렬
        ],
    });
};

// 2. 공지사항 상세 조회 (조회수 1 증가 처리 포함)
export const getNoticeDetail = async (id: number) => {
    return await prisma.notice.update({
        where: { id },
        data: {
            views: {
                increment: 1, // 조회수 +1 자동 증가
            },
        },
    });
};

// 3. 공지사항 등록
export const createNewNotice = async (data: {
    title: string;
    content: string;
    category?: string;
    isPinned?: boolean;
}) => {
    return await prisma.notice.create({
        data,
    });
};

// 4. 공지사항 수정
export const updateNoticeById = async (
    id: number,
    data: {
        title?: string;
        content?: string;
        category?: string;
        isPinned?: boolean;
    },
) => {
    return await prisma.notice.update({
        where: { id },
        data,
    });
};

// 5. 공지사항 삭제
export const deleteNoticeById = async (id: number) => {
    return await prisma.notice.delete({
        where: { id },
    });
};
