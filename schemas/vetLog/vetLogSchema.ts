import { z } from "zod";

export const vetLogSchema = z.object({
    hospitalName: z.string().min(1, "병원 이름을 입력해주세요."),
    visitPurpose: z.string().min(1, "방문 목적을 입력해주세요."),
    visitDate: z.string().min(1, "방문 날짜를 입력해주세요."),
    cost: z.string().optional(),
    memo: z.string().optional(),
});

// 스키마를 통해 타입 자동 추출 (TypeScript의 장점!)
export type VetLogFormValues = z.infer<typeof vetLogSchema>;
