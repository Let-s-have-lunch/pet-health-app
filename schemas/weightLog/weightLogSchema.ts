import { z } from "zod";

export const weightLogSchema = z.object({
    recordDate: z.string().length(8, "날짜 8자리를 입력해주세요."),
    weight: z
        .union([z.string(), z.number()])
        .transform(val => Number(val))
        .refine(val => val > 0, "몸무게를 입력해주세요."),
    memo: z.string().max(20, "메모는 20자 이내로 입력해주세요.").optional(),
});

// 💡 z.infer 대신 z.input을 사용하면 빈 문자열("")도 타입 에러 없이 초기값으로 쓸 수 있습니다!
export type WeightLogInputType = z.input<typeof weightLogSchema>;
