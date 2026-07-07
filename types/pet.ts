export const PetGender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
};

export type PetGenderType = (typeof PetGender)[keyof typeof PetGender];
