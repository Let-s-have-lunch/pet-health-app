import axiosInstance from "@/api/axiosInstance";
import { PostListItemType } from "@/types/post";
import { User } from "@/types/user";
import { InquiryUserItemType } from "@/types/inquiry";

const fetchDashboardSummary = async (): Promise<{
    users: User[];
    posts: PostListItemType[];
    inquiries: InquiryUserItemType[];
}> => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.data;
};

export default { fetchDashboardSummary };
