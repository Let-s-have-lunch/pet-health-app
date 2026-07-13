export interface VetRecord {
    id: number;
    petId: number;
    visitDate: string;
    hospitalName: string;
    visitPurpose: string;
    diagnosis?: string;
    treatment?: string;
    cost?: number;
    memo?: string;
    receiptImage?: string | null;
}

export interface VetLogState {
    upcoming: VetRecord | null; // 다가오는 기록은 하나이거나 없을 수 있음
    history: VetRecord[]; // 지난 기록은 여러 개(배열)임
}