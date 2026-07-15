import { z } from "zod";

export const todoFormSchema = z.object({
    title: z
        .string()
        .min(1, { message: "일정 내용을 입력해주세요." })
        .max(20, { message: "일정은 50자 이내로 입력해주세요." }),
});

export type TodoFormInputType = z.infer<typeof todoFormSchema>;
