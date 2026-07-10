import { z } from "zod";

export const walkLogSchema = z.object({
    walkDate: z
        .string()
        .regex(/^\d{8}$/, "산책날짜는 8자리 숫자(YYYYMMDD)로 입력해주세요"),
    duration: z.number().int().min(1),
    memo: z.string().max(500).optional(),
});

export type WalkLogInputType = z.infer<typeof walkLogSchema>;
