import axiosInstance from "@/api/axiosInstance";
import { CreateDiaryInputType } from "@/schemas/user/diary/createDiarySchema";
import { Diary } from "@/types/diary";
import { UpdateDiaryInputType } from "@/schemas/user/diary/updateDiarySchema";

const getDiaryList = async (date: string): Promise<Diary[]> => {
    const response = await axiosInstance.get(`/diary/date`, {
        params: {
            date,
        },
    });
    return response.data.data;
};

const getDiaryListByRange = async (startDate: string, endDate: string): Promise<Diary[]> => {
    const response = await axiosInstance.get(`/diary/range`, {
        params: {
            startDate,
            endDate,
        },
    });
    return response.data.data;
};

const createDiary = async (data: CreateDiaryInputType): Promise<Diary> => {
    const response = await axiosInstance.post("/diary/create", data);
    return response.data.data;
};

const updateDiary = async (id: number, data: UpdateDiaryInputType): Promise<Diary> => {
    const response = await axiosInstance.patch(`/diary/${id}`, data);
    return response.data.data;
};

const deleteDiary = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/diary/${id}`);
};

export default {
    getDiaryList,
    getDiaryListByRange,
    createDiary,
    updateDiary,
    deleteDiary,
};
