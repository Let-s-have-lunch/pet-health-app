import express from "express";
// 별표(*)를 없애고 중괄호안에 필요한 함수들을 직접 가져옵니다.
import {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
} from "../controller/noticeController.ts";

const router = express.Router();

// 전체 목록 조회 (앞에 noticeController. 를 떼고 함수 이름만 깔끔하게 작성!)
router.get("/", getNotices);

// 상세 조회
router.get("/:id", getNoticeById);

// 공지사항 작성
router.post("/", createNotice);

// 공지사항 수정
router.put("/:id", updateNotice);

// 공지사항 삭제
router.delete("/:id", deleteNotice);

export default router;
