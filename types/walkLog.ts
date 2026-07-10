export interface WalkLog {
    id: number;
    createdAt: string;
    updatedAt: string;
    walkDate: string;
    duration: number;
    memo: string | null;
    petId: number;
}

export interface WalkLogStats {
    summary: {
        totalWalks: number;
        totalDuration: number;
    };
    graphData: {
        date: string;
        walks: number;
        duration: number;
    }[];
}
