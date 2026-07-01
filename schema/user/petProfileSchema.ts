import { z } from "zod";
import { Gender } from "@/types/pet";

export const PetProfileSchema = z.object({
    species: z.string().min(1, "동물종을 선택해주세요."),
    breed: z.string().optional(),
    name: z
        .string()
        .min(1, "반려동물 이름을 입력해주세요.")
        .max(20, "반려동물 이름은 20자 이하로 입력해주세요."),
    imageUrl: z.string().optional(),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요") // ""에서 걸림
        .optional() // undefined에 대해서만 통과시킴
        .or(z.literal("")),
    registrationNumber: z.string().optional().or(z.literal("")),
    gender: z.enum(Gender, "성별을 선택해주세요"),
    neutered: z.boolean(),
});

export type PetProfileInputType = z.infer<typeof PetProfileSchema>;
