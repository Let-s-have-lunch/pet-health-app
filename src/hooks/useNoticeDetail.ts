import { useState, useEffect, useCallback } from "react";
import { noticeApi } from "../apis/noticeApi";
import { Notice } from "../types/notice";

// 1. React Router(useParams) 연동을 고려해 string, undefined도 받을 수 있게 타입 확장
export const useNoticeDetail = (noticeId: number | string | undefined) => {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 재호출(새로고침)이 가능하도록 함수를 useCallback으로 분리
    const fetchDetail = useCallback(async () => {
        if (!noticeId) {
            setError("올바르지 않은 접근입니다.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null); // 새로운 요청 전 에러 초기화

        try {
            // 주소창에서 id를 받아올 경우를 대비해 안전하게 숫자로 변환
            const id = typeof noticeId === "string" ? parseInt(noticeId, 10) : noticeId;

            if (isNaN(id)) {
                setError("존재하지 않는 공지사항 번호입니다.");
                setIsLoading(false);
                return;
            }

            const response = await noticeApi.getNoticeById(id);

            if (response.success && response.data) {
                setNotice(response.data);
            } else {
                // 공지사항 특성에 맞는 명확한 안내 문구
                setError("해당 공지사항을 찾을 수 없거나 삭제된 게시글입니다.");
            }
        } catch (err: any) {
            setError(err.message || "데이터를 불러오는 중 에러가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [noticeId]);

    useEffect(() => {
        void fetchDetail();
    }, [fetchDetail]);

    // 2. 만약의 상황(상세보기 화면에서 새로고침 버튼 등)을 위해 refetch도 함께 반환
    return { notice, isLoading, error, refetch: fetchDetail };
};
