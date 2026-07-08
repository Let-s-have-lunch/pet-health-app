import { User } from "@/types/user";

export interface Inquiry {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    answer: string | null;
    answeredAt: string | null;
    userId: number;
    user: Pick<User, "id" | "nickname" | "email">;
}
