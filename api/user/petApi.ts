import axiosInstance from "@/api/axiosInstance";
import { RegisterPetInputType } from "@/schemas/user/pet/registerPetSchema";
import { Pet } from "@/types/pet";
import { PetUpdateInputType } from "@/schemas/user/pet/updatePetSchema";

const getMyPetList = async():Promise<Pet[]> => {
    const response = await axiosInstance.get("/pet/list");
    return response.data.data;
};

const registerPet = async ( data: RegisterPetInputType ): Promise<Pet> => {
    const response = await axiosInstance.post("/pet/create", data);
    return response.data.data;
};

const updatePet = async ( petId: number, data: PetUpdateInputType ): Promise<Pet> => {
    const response = await axiosInstance.patch(`/pet/update/${petId}`, data);
    return response.data.data;
};

const deletePet = async ( petId: number ) => {
    await axiosInstance.delete(`/pet/delete/${petId}`);
}



export default {
    getMyPetList,
    registerPet,
    updatePet,
    deletePet,
};
