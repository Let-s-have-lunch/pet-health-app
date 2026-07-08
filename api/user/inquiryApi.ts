import { PaginationResponseType } from "@/types/common";
import { Inquiry } from "@/types/inquiry";
import axiosInstance from "@/api/axiosInstance";
import { InquiryInputType } from "@/schemas/inquiry/inquirySchema";

const fetchMyInquiryList = async (
    page: number,
    size: number,
): Promise<PaginationResponseType<Inquiry>> => {
    const response = await axiosInstance.get("/inquiry/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getMyInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/inquiry/${inquiryId}`);
    return response.data.data;
};

const createInquiry = async (input: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.post("/inquiry/create", input);
    return response.data.data;
};

const updateInquiry = async (inquiryId: number, input: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/inquiry/${inquiryId}`, input);
    return response.data.data;
};

const deleteInquiry = async (inquiryId: number): Promise<void> => {
    await axiosInstance.delete(`/inquiry/${inquiryId}`);
};

export default {
    fetchMyInquiryList,
    getMyInquiryById,
    createInquiry,
    updateInquiry,
    deleteInquiry,
};
