import axiosInstance from "@/api/axiosInstance";
import { Reply, ReplyItemType, ReplyListItemType } from "@/types/reply";
import { PaginationResponseType } from "@/types/common";

const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post("/reply/create", {
        postId,
        content,
    });
    return response.data.data;
};

const getRepliesByPostId = async (postId: number, page: number, size: number,):Promise<PaginationResponseType<ReplyListItemType>> => {
    const response = await axiosInstance.get(`/reply/${postId}`, {
        params: {
            page,
            size,
        }
    })
    return response.data.data;
}

const updateReply = async (replyId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.patch(`/reply/${replyId}`, {
        content,
    })
    return response.data.data;
}

const deleteReply = async (replyId: number): Promise<void> => {
    await axiosInstance.delete(`/reply/${replyId}`);
}


export default {
    createReply,
    getRepliesByPostId,
    deleteReply,
    updateReply,
}