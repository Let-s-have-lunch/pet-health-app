import axiosInstance from "@/api/axiosInstance";
import { Reply, ReplyListItemType } from "@/types/reply";

// 🔴 백엔드 서비스 응답 구조({ page, size, total, list })에 맞게 프론트엔드 타입을 선언합니다.
export interface PaginationResponseType<T> {
    page: number;
    size: number;
    total: number;
    list: T[];
}

// 댓글 작성
const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post("/reply/create", {
        postId,
        content,
    });
    return response.data.data;
};

// 댓글 조회 (무한 스크롤에서도 이 함수를 그대로 사용합니다)
const getRepliesByPostId = async (
    postId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<ReplyListItemType>> => {
    const response = await axiosInstance.get(`/reply/${postId}`, {
        params: {
            page,
            size,
        },
    });
    // 컨트롤러 응답인 { message, data: result } 에서 data를 반환
    return response.data.data;
};

// 댓글 수정
const updateReply = async (replyId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.patch(`/reply/${replyId}`, {
        content,
    });
    return response.data.data;
};

// 댓글 삭제
const deleteReply = async (replyId: number): Promise<void> => {
    await axiosInstance.delete(`/reply/${replyId}`);
};

export default {
    createReply,
    getRepliesByPostId,
    deleteReply,
    updateReply,
};
