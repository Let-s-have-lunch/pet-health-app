import axiosInstance from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { Post, PostListItemType} from "@/types/post";
import { PostInputType } from "@/schemas/post/postSchema";

const getPostList = async (page = 1, size = 20): Promise<PaginationResponseType<PostListItemType>> => {
    const response = await axiosInstance.get("/post", {
        params: { page, size },
    });
    return response.data.data;
};

const getPostById = async (postId: number): Promise<PostListItemType> => {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data.data;
};

const createPost = async (data: PostInputType): Promise<Post> => {
    const response = await axiosInstance.post("/post/create", data);
    return response.data.data;
};

const updatePost = async (postId: number, data: PostInputType): Promise<Post> => {
    const response = await axiosInstance.patch(`/post/${postId}`, data);
    return response.data.data;
};

const deletePost = async (postId: number): Promise<void> => {
    await axiosInstance.delete(`/post/${postId}`);
};

export default {
    getPostList,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
