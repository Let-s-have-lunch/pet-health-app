export type StyleColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";
export type StyleVariantType = "contained" | "outlined" | "text" | "icon";
export type StyleSizeType = "small" | "medium" | "large";

export const BUTTON_SIZE_STYLE = {
    small: "px-3 py-2", // 아죽 작은 글자 크기
    medium: "px-5 py-3", // 작은 글자 크기
    large: "px-8 py-5", // 원래 글자 크기
};

export const INPUT_SIZE_STYLE = {
    small: "text-sm px-6 py-4", // 글자 14px, 조금 콤팩트한 여백
    medium: "text-lg px-9 py-6", // 글자 18px (기존 16px에서 키움), 가이드 여백
    large: "text-xl px-11 py-8", // 글자 20px, 큼직하고 시원한 여백
};
