export interface WalkLog {
    id: number;
    createdAt: string;
    updatedAt: string;
    walkDate: string;
    duration: number;
    keywords: string[];
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
