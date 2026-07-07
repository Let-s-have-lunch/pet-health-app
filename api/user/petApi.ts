import axiosInstance from "@/api/axiosInstance";
import { RegisterPetInputType } from "@/schemas/user/pet/registerPetSchema";
import { Pet } from "@/types/pet";

const getMyPetList = async():Promise<Pet[]> => {
    const response = await axiosInstance.get("/pet/list");
    return response.data.data;
};

const registerPet = async ( data: RegisterPetInputType ): Promise<Pet> => {
    const response = await axiosInstance.post("/pet/create", data);
    return response.data.data;
};




export default {
    getMyPetList,
    registerPet,
};
