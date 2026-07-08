import axiosInstance from "@/api/axiosInstance";
import { AdminNoticeInputType } from "@/schemas/notice/noticeSchema";
import { Notice } from "@/types/notice";

const createNotice = async (input: AdminNoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.post("/admin/notice/create", input);
    return response.data.data;
};

const updateNotice = async (id: number, input: AdminNoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.patch(`/admin/notice/${id}`, input);
    return response.data.data;
};

const deleteNotice = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/notice/${id}`);
};

export default { createNotice, updateNotice, deleteNotice };
