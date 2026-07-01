import { z } from "zod";

export const petDiarySchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요."),
    content: z.string().min(1, "내용을 입력해주세요."),
})

export type petDiaryInputType = z.infer<typeof petDiarySchema>;