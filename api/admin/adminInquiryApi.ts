import axiosInstance from "@/api/axiosInstance";
import { InquiryUserItemType } from "@/types/inquiry";
import { PaginationResponseType } from "@/types/common";

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

export default {fetchInquiryList, fetchInquiryById}
