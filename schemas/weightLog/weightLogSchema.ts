import { z } from "zod";

export const weightLogSchema = z.object({
    recordDate: z.string().length(8, "날짜 8자리를 입력해주세요."),
    weight: z.coerce
        .number("숫자를 입력해주세요." )
        .positive("0보다 큰 숫자를 입력해주세요."),
    memo: z.string().max(20, "메모는 20자 이내로 입력해주세요.").optional(),
});


export type WeightLogInputType = z.input<typeof weightLogSchema>;
