import { z } from "zod";

export const walkLogSchema = z.object({
    walkDate: z.string().length(8, "날짜 8자리를 입력해주세요."),
    duration: z.number().min(1, "산책 시간을 입력해주세요."),
    keywords: z.array(z.string()).max(3, "최대 3개까지만 선택 가능합니다.")
});

export type WalkLogInputType = z.infer<typeof walkLogSchema>;
