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
    // --- 새로 추가된 Props ---
    isFloating?: boolean; // 화면에 고정(fixed/absolute) 여부
    isCircle?: boolean; // 40x40 원형 아이콘 버튼 여부
}

function Button({
    color = "primary",
    variant = "contained",
    size = "medium",
    fullWidth = false,
    showChevron = false,
    wrap = false,
    isFloating = false,
    isCircle = false,
    className,
    textClassName,
    children,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main border-2 border-${color}-main`;
            case "outlined":
                return `border-2 border-text-secondary bg-transparent`;
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
                // 기본 스타일 (원형 버튼일 때는 패딩 조절을 위해 클래스 분기)
                "flex-row items-center justify-center",
                isCircle ? "rounded-full" : "rounded-[10px]",

                // 크기 및 형태 관련 조건문
                isCircle ? "w-[48px] h-[48px] p-0" : BUTTON_SIZE_STYLE[size],
                showChevron && !isCircle ? "justify-between" : "justify-center",

                getVariantClasses(),
                fullWidth && !isCircle ? "w-full" : "",
                wrap && "flex-1",

                // 화면 고정(Floating) 스타일 추가 (예: 우측 하단 고정)
                isFloating && "absolute bottom-6 right-6 z-50 shadow-lg",

                className,
            )}
            {...props}>
            {/* 글자 및 아이콘 영역 */}
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "leading-none text-center font-normal text-text-default",
                        size === "small" ? "text-base" : size === "large" ? "text-xl" : "text-lg",
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
                    size={size === "small" ? 18 : 24}
                    className="text-text-default"
                />
            )}
        </Pressable>
    );
}

export default Button;
