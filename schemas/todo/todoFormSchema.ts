import { z } from "zod";

export const todoFormSchema = z.object({
    title: z
        .string()
        .min(1, { message: "일정 내용을 입력해주세요." })
        .max(20, { message: "일정은 20자 이내로 입력해주세요." }), // 기존 20자로 제한하셨네요
    date: z.date({
        required_error: "시간을 선택해주세요.",
        invalid_type_error: "올바른 날짜 형식이 아닙니다.",
    }),
});

export type TodoFormInputType = z.infer<typeof todoFormSchema>;
