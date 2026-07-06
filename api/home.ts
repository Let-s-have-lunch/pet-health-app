import axiosInstance from "./axiosInstance";

// 백엔드가 주는 데이터 타입 정의
export interface DashboardData {
    date: string;
    walk: { count: number };
    weight: { value: number };
    water: { totalAmount: number };
    vetRecord: {
        purpose: string;
        hospitalName: string;
    } | null;
}

/**
 * 🏡 메인 대시보드 데이터 가져오기 API
 */
export const getHomeDashboard = async (petId: number, date: string) => {
    // 안 되어있다면 전체 주소를 적어주셔도 됩니다. 여기서는 인스턴스 기준으로 작성합니다.
    const response = await axiosInstance.get<{ success: boolean; data: DashboardData }>(
        `/home/dashboard`,
        {
            params: { petId, date },
        },
    );
    return response.data;
};
