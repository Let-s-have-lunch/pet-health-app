import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { User } from "@/types/user";
import axiosInstance from "@/api/axiosInstance";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";

const registerUser = async (
    data: Omit<RegisterUserInputType, "confirmPassword">,
): Promise<User> => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data.data;
};

const login = async (data: LoginUserInputType): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

export default { registerUser, login };
