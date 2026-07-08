import { User } from "@/types/user";

export interface Post {
    id: number;
    title: string;
    content: string;
    views: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type PostUser = Pick<User, "id" | "nickname" | "email">;

// 게시글 상세 조회 시 응답 (게시글 정보 + 작성자 + 댓글 목록)
export interface PostDetail extends Post {
    user: PostUser;
    comments: ReplyListItemType[]; // 아래 정의한 댓글 목록 타입 사용
}