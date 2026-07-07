import axiosInstance from "@/api/axiosInstance";
import { RegisterPetInputType } from "@/schemas/user/pet/registerPetSchema";
import { PetListResponse } from "@/types/pet";

const getMyPetList = async (): Promise<PetListResponse[]> => {
    const response = await axiosInstance.get("/pet/list");
    return response.data.data;
};

const registerPet = async (data: RegisterPetInputType) => {
    const response = await axiosInstance.post("/pet/create", data);
    return response.data;
};

export default {
    getMyPetList,
    registerPet,
};
