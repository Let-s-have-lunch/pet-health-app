import axiosInstance from "@/api/axiosInstance";

const getPostList = async (page: number) => {
    const response = await axiosInstance.get("/post")
}

export default { getPostList, }