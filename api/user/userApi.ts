import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { User } from "@/types/user";
import axiosInstance from "@/api/axiosInstance";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";
import { UpdateUserInputType } from "@/schemas/user/updateUserSchema";
import { UpdatePasswordInputType } from "@/schemas/user/updatePasswordSchema";

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

const updateUser = async (data: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch("/user/update", data);
    return response.data.data;
};

const updatePassword = async (data: UpdatePasswordInputType): Promise<void> => {
    await axiosInstance.patch("/user/password", data);
};

export default { registerUser, login, updateUser, updatePassword };
