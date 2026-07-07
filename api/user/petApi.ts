import axiosInstance from "@/api/axiosInstance";
import { PetListResponse } from "@/types/pet";

const getMyPetList = async (): Promise<PetListResponse[]> => {
    const response = await axiosInstance.get("/pet/list");
    return response.data.data;
};

export default {getMyPetList};