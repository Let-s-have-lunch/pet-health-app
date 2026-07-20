import axiosInstance from "@/api/axiosInstance";
import { Reply, ReplyListItemType } from "@/types/reply";


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

// 댓글 조회
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
