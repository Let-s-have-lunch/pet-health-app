
export interface WeightLog {
    id: number;
    petId: number;
    weight: number;
    recordDate: string;
    memo: string | null;
    change: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
