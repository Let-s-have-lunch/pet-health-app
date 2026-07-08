import { useState, useEffect, useCallback } from "react";
import { noticeApi } from "@/api/user/noticeApi";
import type { Notice } from "@/types/notice";

export const useNoticeDetail = (id: string | undefined) => {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 중 상태 추가
    const [error, setError] = useState<string | null>(null);

    const fetchNotice = useCallback(async () => {
        // id가 없거나, 숫자로 변환했을 때 유효하지 않으면 조기 종료
        if (!id || isNaN(Number(id))) {
            setIsLoading(false);
            setError("유효하지 않은 게시글 번호입니다.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await noticeApi.getNoticeById(Number(id));
            if (response.success) {
                setNotice(response.data);
            }
        } catch (err) {
            console.error("공지사항 로딩 실패:", err);
            setError("공지사항을 불러오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const deleteNotice = async () => {
        if (!id || isNaN(Number(id))) return;

        try {
            setIsDeleting(true); // 삭제 시작
            await noticeApi.deleteNotice(Number(id));
            return true; // 성공 시 true 반환 (컴포넌트에서 navigate 하기 좋음)
        } catch (err) {
            console.error("삭제 실패:", err);
            throw err; // 에러는 컴포넌트에서 toast 등으로 처리하도록 던져줌
        } finally {
            setIsDeleting(false); // 삭제 끝
        }
    };

    useEffect(() => {
        fetchNotice();
    }, [fetchNotice]);

    return { notice, isLoading, isDeleting, error, deleteNotice };
};
