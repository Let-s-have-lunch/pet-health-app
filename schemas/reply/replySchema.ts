import { z } from "zod";

export const replySchema = z.object({
    content: z
        .string()
        .min(1, "내용을 입력해주세요")
        .max(1000, "댓글은 1000자를 넘을 수 없습니다."),
});

export type ReplyInputType = z.infer<typeof replySchema>;
