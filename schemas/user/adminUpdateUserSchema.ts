import { userSchema } from "@/schemas/user/userSchema";
import {z} from "zod";
import { Role } from "@/types/user";

export const adminUpdateUserSchema = userSchema.extend({
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다.").optional().or(z.literal("")),
    role: z.enum(Role, "권한을 선택해주세요."),
});

export type AdminUpdateUserInputType = z.infer<typeof adminUpdateUserSchema>;