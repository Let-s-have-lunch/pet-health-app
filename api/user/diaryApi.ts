import axiosInstance from "@/api/axiosInstance";
import { CreateDiaryInputType } from "@/schemas/user/diary/createDiarySchema";
import { Diary } from "@/types/diary";
import { UpdateDiaryInputType } from "@/schemas/user/diary/updateDiarySchema";

// 특정 날짜의 일기 목록 가져오기 (백엔드의 /diary/date 와 매칭)
const getDiaryList = async (date: string): Promise<Diary[]> => {
    const response = await axiosInstance.get(`/diary/date`, {
        params: {
            date,
        },
    });
    // 백엔드 response.data.data 구조가 맞는지 확인용 안전장치 포함
    return response.data?.data || [];
};

// 기간별 일기 목록 가져오기 (백엔드의 /diary/range 와 매칭)
const getDiaryListByRange = async (startDate: string, endDate: string): Promise<Diary[]> => {
    const response = await axiosInstance.get(`/diary/range`, {
        params: {
            startDate,
            endDate,
        },
    });
    return response.data?.data || [];
};

// 일기 생성 (백엔드의 /diary/create 와 매칭)
const createDiary = async (data: CreateDiaryInputType): Promise<Diary> => {
    const response = await axiosInstance.post("/diary/create", data);
    return response.data.data;
};

// 일기 수정 (백엔드의 /diary/:diaryId 와 매칭)
const updateDiary = async (id: number, data: UpdateDiaryInputType): Promise<Diary> => {
    const response = await axiosInstance.patch(`/diary/${id}`, data);
    return response.data.data;
};

// 일기 삭제 (백엔드의 /diary/:diaryId 와 매칭)
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
