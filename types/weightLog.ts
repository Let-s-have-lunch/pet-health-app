
export interface WeightLog {
    id: number;
    petId: number;
    weight: number;
    recordDate: string; // 혹은 Date
    memo: string | null;
    change: number; // 프론트에서 계산해서 보여주거나 백엔드에서 내려주는 값
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
