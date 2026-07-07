export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
};

export type GenderType = (typeof Gender)[keyof typeof Gender];

export interface Pet {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    species: string;
    breed: string | null;
    name: string;
    birthdate: string | null;
    registrationNumber: string | null;
    neutered: boolean;
    profileImage: string | null;
    userId: number;
    gender: GenderType;
}

export type PetListResponse = Pick<
    Pet,
    | "id"
    | "name"
    | "species"
    | "breed"
    | "profileImage"
    | "birthdate"
    | "gender"
    | "neutered"
    | "registrationNumber"
>;
