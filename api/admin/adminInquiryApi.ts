import axiosInstance from "@/api/axiosInstance";
import { Inquiry, InquiryUserItemType } from "@/types/inquiry";
import { PaginationResponseType } from "@/types/common";
import { InquiryAnswerInputType } from "@/schemas/inquiry/inquiryAnswerSchema";

const fetchInquiryList = async (
    page: number,
    size: number,
): Promise<PaginationResponseType<InquiryUserItemType>> => {
    const response = await axiosInstance.get("/admin/inquiry/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const fetchInquiryById = async (id: number): Promise<InquiryUserItemType> => {
    const response = await axiosInstance.get(`/admin/inquiry/${id}`);
    return response.data.data;
};

const updateInquiryAnswer = async (id: number, input: InquiryAnswerInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/admin/inquiry/${id}`, input);
    return response.data.data;
}

const deleteInquiryAnswer = async (id: number) => {
    await axiosInstance.delete(`/admin/inquiry/${id}`);
}


export default {fetchInquiryList, fetchInquiryById , updateInquiryAnswer, deleteInquiryAnswer}
