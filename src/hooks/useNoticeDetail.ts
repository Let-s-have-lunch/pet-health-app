import { useState, useEffect } from "react";
import { noticeApi } from "../apis/noticeApi";
import { Notice } from "../types/notice";

export const useNoticeDetail = (noticeId: number) => {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const response = await noticeApi.getNoticeById(noticeId);
                if (response.success) {
                    setNotice(response.data);
                } else {
                    setError("데이터를 불러오지 못했습니다.");
                }
            } catch (err: any) {
                setError(err.message || "서버 통신 중 에러가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        if (noticeId) {
            fetchDetail();
        }
    }, [noticeId]);

    return { notice, isLoading, error };
};
