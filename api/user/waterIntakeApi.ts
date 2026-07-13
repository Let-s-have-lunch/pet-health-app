import axiosInstance from "@/api/axiosInstance";
import { WaterLogInputType } from "@/schemas/waterLog/waterLogSchema";
import { WaterIntakeLog } from "@/types/WaterIntakeLog";

const getByPetId = async (petId: number): Promise<WaterIntakeLog[]> => {
    const response = await axiosInstance.get(`/water-logs/pet/${petId}`)
    return response.data.data;
}

const createWaterLog = async (petId: number, data: WaterLogInputType): Promise<WaterIntakeLog> => {
    const response = await axiosInstance.post(`/water-logs`, {
        petId,
        ...data,
    })
    return response.data.data;
}

const updateWaterLog = async (waterLogId: number, data: WaterLogInputType): Promise<WaterIntakeLog> => {
    const response = await axiosInstance.put(`/water-logs/${waterLogId}`, data);
    return response.data.data;
}

const deleteWaterLog = async (waterLogId: number): Promise<void> => {
    await axiosInstance.delete(`/water-logs/${waterLogId}`);
}

export default { getByPetId, createWaterLog, updateWaterLog, deleteWaterLog };