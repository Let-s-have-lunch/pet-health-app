import { z } from "zod";

// 공지사항 작성 및 수정 시 검증할 규칙(스키마) 정의
export const noticeFormSchema = z.object({
    title: z
        .string()
        .min(2, { message: "🐾 제목은 최소 2글자 이상 입력해 주세요." })
        .max(100, { message: "🐾 제목은 100글자를 넘을 수 없습니다." }),

    content: z.string().min(5, { message: "🐾 공지 내용은 최소 5글자 이상 상세히 적어주세요." }),

    category: z.enum(["general", "maintenance", "event"], {
        errorMap: () => ({ message: "🐾 올바른 카테고리(일반/점검/이벤트)를 선택해 주세요." }),
    }),

    isPinned: z.boolean().default(false),
});

// 타입스크립트용 타입으로 자동 변환 추출 (Form 컴포넌트에서 활용)
export type NoticeFormData = z.infer<typeof noticeFormSchema>;
