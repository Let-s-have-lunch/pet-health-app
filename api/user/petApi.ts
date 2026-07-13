import axiosInstance from "@/api/axiosInstance";
import { RegisterPetInputType } from "@/schemas/user/pet/registerPetSchema";
import { Pet } from "@/types/pet";
import { PetUpdateInputType } from "@/schemas/user/pet/updatePetSchema";

const getPet = async (id: number): Promise<Pet> => {
    const response = await axiosInstance.get(`/pet/list/${id}`);
    return response.data.data;
};

const getMyPetList = async (): Promise<Pet[]> => {
    const response = await axiosInstance.get("/pet/list");
    return response.data.data;
};
const registerPet = async (data: RegisterPetInputType): Promise<Pet> => {
    const response = await axiosInstance.post("/pet/create", data);
    return response.data.data;
};

const updatePet = async (id: number, data: PetUpdateInputType): Promise<Pet> => {
    const response = await axiosInstance.patch(`/pet/update/${id}`, data);
    return response.data.data;
};

const deletePet = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/pet/delete/${id}`);
};

export default {
    getPet,
    getMyPetList,
    registerPet,
    updatePet,
    deletePet,
};
