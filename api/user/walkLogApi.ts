import axiosInstance from "@/api/axiosInstance";
import { WalkLog, WalkLogStats } from "@/types/walkLog";
import { WalkLogInputType } from "@/schemas/walkLog/walkLogSchema";

const getWalkLogs = async (petId: number): Promise<WalkLog[]> => {
    const response = await axiosInstance.get(`/walk-logs/${petId}`);
    return response.data.data;
};

const getWalkLogStats = async (petId: number, startDate?: string, endDate?: string): Promise<WalkLogStats> => {
    const response = await axiosInstance.get(`/walk-logs/${petId}/stats`, {
        params: {
            startDate,
            endDate,
        }
    });
    return response.data.data;
};

const createWalkLog = async (petId: number, input: WalkLogInputType): Promise<WalkLog> => {
    const response = await axiosInstance.post(`/walk-logs/create/${petId}`, input);
    return response.data.data;
};

export default { getWalkLogs, getWalkLogStats, createWalkLog };
