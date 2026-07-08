import { User } from "@/types/user";

export interface Reply {
    id: number;
    createdAt: string;
    updatedAt: string;
    content: string;
    postId: number;
    userId: number;
}

// [목록용] 가벼운 유저 타입 (id, nickname만)
export type ReplyListUser = Pick<User, "id" | "nickname">;
export interface ReplyListItemType extends Reply {
    user: ReplyListUser;
}

// [상세/수정용] 상세한 유저 타입 (email 포함)
export type ReplyUser = Pick<User, "id" | "nickname" | "email">;
export interface ReplyItemType extends Reply {
    user: ReplyUser;
}

