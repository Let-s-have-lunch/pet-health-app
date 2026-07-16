import { Pressable, PressableProps } from "react-native";
import { BUTTON_SIZE_STYLE, StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import React from "react";
import TextComponent from "@/components/common/text/TextComponent";

interface Props extends Omit<PressableProps, "children"> {
    children?: React.ReactNode;
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    wrap?: boolean;
    fullWidth?: boolean;
    showChevron?: boolean; // > 아이콘 노출 여부
    textClassName?: string;
    isFloating?: boolean; // 화면에 고정(fixed/absolute) 여부
    isCircle?: boolean; // 40x40 원형 아이콘 버튼 여부
    // 👇 폰트 및 아이콘 색상을 변경할 수 있는 prop 추가
    textColor?: string;
}

function Button({
    color = "primary",
    variant = "contained",
    size = "medium", // 기본값이 medium
    fullWidth = false,
    showChevron = false,
    wrap = false,
    isFloating = false,
    isCircle = false,
    className,
    textClassName,
    textColor, // 구조 분해 할당에 추가
    children,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main border border-${color}-main`;
            case "outlined":
                return `border border-text-secondary bg-transparent`;
            case "text":
                return `bg-background-paper`;
            case "icon":
                return `rounded-full p-2`;
            default:
                return "";
        }
    };

    return (
        <Pressable
            className={twMerge(
                "flex-row items-center justify-center",
                isCircle ? "rounded-full" : "rounded-[10px]",

                isCircle ? "w-[48px] h-[48px] p-0" : BUTTON_SIZE_STYLE[size],
                showChevron && !isCircle ? "justify-between" : "justify-center",

                getVariantClasses(),
                fullWidth && !isCircle ? "w-full" : "",
                wrap && "flex-1",

                isFloating && "absolute bottom-6 right-6 z-50 shadow-lg",

                className,
            )}
            {...props}>
            {/* 글자 및 아이콘 영역 */}
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "leading-none text-center font-normal",
                        // 👇 textColor가 있으면 사용하고, 없으면 기본값인 text-text-default 사용
                        textColor || "text-text-default",
                        size === "mini"
                            ? "text-xs"
                            : size === "small"
                              ? "text-base"
                              : size === "large"
                                ? "text-xl"
                                : "text-lg",
                        textClassName,
                    )}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}

            {showChevron && !isCircle && (
                <Feather
                    name="chevron-right"
                    size={size === "mini" ? 16 : size === "small" ? 18 : 24}
                    // 👇 아이콘 색상도 텍스트 색상과 동일하게 맞춰줌 (통일성 유지)
                    className={twMerge(textColor || "text-text-default")}
                />
            )}
        </Pressable>
    );
}

export default Button;
