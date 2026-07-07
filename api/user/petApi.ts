import axiosInstance from "@/api/axiosInstance";
import { RegisterPetInputType } from "@/schemas/user/pet/registerPetSchema";

const registerPet = async ( data: RegisterPetInputType ) => {
    const response = await axiosInstance.post("/pet/create", data);
    return response.data
};




export default {
    registerPet,
};