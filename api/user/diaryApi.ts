import axiosInstance from "@/api/axiosInstance";
import { CreateDiaryInputType } from "@/schemas/user/diary/createDiarySchema";
import { UpdateDiaryInputType } from "@/schemas/user/diary/updateDiarySchema";
import { Diary } from "@/types/diary";
import { Platform } from "react-native";

const getDiary = async (id: number): Promise<Diary> => {
    const response = await axiosInstance.get(`/diary/${id}`);
    return response.data.data;
};

const getDiaryList = async (date: string): Promise<Diary[]> => {
    const response = await axiosInstance.get("/diary/date", {
        params: { date },
    });

    return response.data.data ?? [];
};

const getDiaryListByRange = async (startDate: string, endDate: string): Promise<Diary[]> => {
    const response = await axiosInstance.get("/diary/range", {
        params: {
            startDate,
            endDate,
        },
    });

    return response.data.data ?? [];
};

const createDiary = async (data: CreateDiaryInputType, image?: File | string): Promise<Diary> => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("date", data.date.toISOString());

    if (image) {
        if (Platform.OS === "web" && image instanceof File) {
            formData.append("diaryImage", image);
        } else {
            const imageUri = image as string;

            const fileName = imageUri.split("/").pop() ?? "diary.jpg";

            const ext = fileName.split(".").pop()?.toLowerCase();

            let mimeType = "image/jpeg";

            if (ext === "png") {
                mimeType = "image/png";
            } else if (ext === "webp") {
                mimeType = "image/webp";
            }

            formData.append("diaryImage", {
                uri: imageUri,
                name: fileName,
                type: mimeType,
            } as any);
        }
    }

    const response = await axiosInstance.post("/diary/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data;
};

const updateDiary = async (
    id: number,
    data: UpdateDiaryInputType,
    image?: File | string,
): Promise<Diary> => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("date", data.date.toISOString());

    if (image) {
        if (Platform.OS === "web" && image instanceof File) {
            formData.append("diaryImage", image);
        } else {
            const imageUri = image as string;

            const fileName = imageUri.split("/").pop() ?? "diary.jpg";

            const ext = fileName.split(".").pop()?.toLowerCase();

            let mimeType = "image/jpeg";

            if (ext === "png") {
                mimeType = "image/png";
            } else if (ext === "webp") {
                mimeType = "image/webp";
            }

            formData.append("diaryImage", {
                uri: imageUri,
                name: fileName,
                type: mimeType,
            } as any);
        }
    }

    const response = await axiosInstance.patch(`/diary/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data;
};

const deleteDiary = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/diary/${id}`);
};

export default {
    getDiary,
    getDiaryList,
    getDiaryListByRange,
    createDiary,
    updateDiary,
    deleteDiary,
};
