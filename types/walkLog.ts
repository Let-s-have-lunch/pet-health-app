export interface WalkLog {
    id: number;
    walkDate: string;
    duration: number;
    keywords: string[];
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
