import { z } from "zod";

export const waterLogSchema = z.object({
    recordDate: z.string().length(8, "날짜 8자리를 입력해주세요."),
    amount: z
        .number("숫자를 입력해주세요.")
        .int("음수량은 정수로만 입력해주세요.")
        .nonnegative("음수는 입력할 수 없습니다.")
        .min(1, "음수량을 입력해주세요."),
    memo: z.string().max(20, "메모는 20자 이내로 입력해주세요.").optional(), // 💡 min -> max로 수정
});

export type WaterLogInputType = z.infer<typeof waterLogSchema>;
