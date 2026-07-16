import axiosInstance from "../axiosInstance";

export interface DashboardData {
    walk: { count: number, date: string };
    weight: { value: number, date: string | null };
    water: { totalAmount: number, date: string };
    vetRecord: {
        time: string;
        purpose: string;
        hospitalName: string;
    } | null;
}

export const getHomeDashboard = async (petId: number, date: string) => {
    const response = await axiosInstance.get<{ success: boolean; data: DashboardData }>(
        `/home/dashboard`,
        {
            params: { petId, date },
        },
    );
    return response.data;
};

