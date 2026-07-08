import axiosInstance from "@/api/axiosInstance";
import { PostDetail } from "@/types/post";
import { PostInputType } from "@/schemas/post/postSchema";


/**
 * 1. 게시글 목록 조회 (Pagination)
 * 응답 데이터에 댓글은 제외되고, 작성자(id, nickname) 정보만 들어옵니다.
 */
export const getPostList = async (page = 1, size = 10): Promise<> => {
    const response = await axiosInstance.get("/", {
        params: { page, size },
    });
    return response.data.data;
};

/**
 * 2. 게시글 상세 조회
 * 응답 데이터에 게시글 상세 내용, 작성자 정보는 물론
 * 제공해주신 댓글 목록(ReplyListItemType[])까지 포함되어 내려옵니다.
 */
export const getPostById = async (postId: number): Promise<PostDetail> => {
    const response = await axiosInstance.get(`/${postId}`);
    return response.data.data;
};

/**
 * 3. 게시글 작성
 */
export const createPost = async (data: PostInputType): Promise<PostDetail> => {
    const response = await axiosInstance.post("/create", data);
    return response.data.data;
};

/**
 * 4. 게시글 수정
 */
export const updatePost = async (
    postId: number,
    data: PostInputType,
): Promise<PostDetail> => {
    const response = await axiosInstance.patch(`/${postId}`, data);
    return response.data.data;
};

/**
 * 5. 게시글 삭제
 */
export const deletePost = async (postId: number): Promise<void> => {
    const response = await axiosInstance.delete(`/${postId}`);
    return response.data.data;
};
