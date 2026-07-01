export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
};

export type GenderType = (typeof Gender)[keyof typeof Gender];
