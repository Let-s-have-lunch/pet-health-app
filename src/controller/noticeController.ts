import { PrismaClient } from "../app/generated/prisma/index.js"; // 제너레이트 경로에 맞게 수정
const prisma = new PrismaClient();

// 1. 공지사항 목록 조회 (고정글 우선 -> 최신순 정렬)
export const getNotices = async (req, res) => {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: [
                { isPinned: "desc" }, // 고정글(true)이 위로 오게 함
                { createdAt: "desc" }, // 그다음 최신순 정렬
            ],
        });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: "공지사항 조회 실패", error: error.message });
    }
};

// 2. 공지사항 상세 조회 (조회수 1 증가 포함)
export const getNoticeById = async (req, res) => {
    const { id } = req.params;
    try {
        const notice = await prisma.notice.update({
            where: { id: parseInt(id) },
            data: { views: { increment: 1 } }, // 조회수 +1 자동 증가
        });
        res.status(200).json(notice);
    } catch (error) {
        res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });
    }
};

// 3. 공지사항 작성
export const createNotice = async (req, res) => {
    const { title, content, category, isPinned } = req.body;
    try {
        const newNotice = await prisma.notice.create({
            data: { title, content, category, isPinned },
        });
        res.status(201).json(newNotice);
    } catch (error) {
        res.status(400).json({ message: "공지사항 등록 실패", error: error.message });
    }
};

// 4. 공지사항 수정
export const updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;
    try {
        const updatedNotice = await prisma.notice.update({
            where: { id: parseInt(id) },
            data: { title, content, category, isPinned },
        });
        res.status(200).json(updatedNotice);
    } catch (error) {
        res.status(400).json({ message: "공지사항 수정 실패", error: error.message });
    }
};

// 5. 공지사항 삭제
export const deleteNotice = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.notice.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "공지사항이 삭제되었습니다." });
    } catch (error) {
        res.status(400).json({ message: "공지사항 삭제 실패", error: error.message });
    }
};
