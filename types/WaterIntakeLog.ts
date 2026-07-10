export interface WaterIntakeLog {
    id: number;
    petId: number;
    amount: number; // 음수량 (단위: ml)
    recordDate: string; // 기록 날짜 (YYYY-MM-DD 또는 ISO 스트링)
    memo: string | null; // 한 줄 메모
    createdAt?: string;
    updatedAt?: string;
}

// 등록/수정용 페이로드 타입
export interface WaterIntakePayload {
    petId: number;
    amount: number;
    recordDate: string;
    memo?: string;
}
