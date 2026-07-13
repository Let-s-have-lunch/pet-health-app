import { User } from "@/types/user";

export interface Reply {
    id: number;
    createdAt: string;
    updatedAt: string;
    content: string;
    postId: number;
    userId: number;
}

export type ReplyListUser = Pick<User, "id" | "nickname">;

export interface ReplyListItemType extends Reply {
    user: ReplyListUser;
}

export type ReplyUser = Pick<User, "id" | "nickname" | "email">;

export interface ReplyItemType extends Reply {
    user: ReplyUser;
}