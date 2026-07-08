import { useState, useEffect, useCallback } from "react";
import { noticeApi } from "@/api/user/noticeApi"; // 경로 수정!
import type { Notice } from "@/types/notice";

export const useNoticeDetail = (id: string | undefined) => {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // 에러 상태 추가!

    // useCallback을 써서 함수가 불필요하게 다시 생성되는 걸 막습니다.
    const fetchNotice = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);

            // 💡 여기서 data.data로 접근해야 합니다. (API 응답 구조 반영)
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
        if (!id) return;
        try {
            await noticeApi.deleteNotice(Number(id));
        } catch (err) {
            console.error("삭제 실패:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchNotice();
    }, [fetchNotice]); // 이제 fetchNotice가 안정적이라 여기서도 안전합니다.

    return { notice, isLoading, error, deleteNotice };
};
