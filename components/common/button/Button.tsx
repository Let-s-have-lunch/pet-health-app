import { Pressable, PressableProps, View } from "react-native";
import { BUTTON_SIZE_STYLE, StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponents";
import { Feather } from "@expo/vector-icons";
import React from "react";

interface Props extends Omit<PressableProps, "children"> {
    children?: React.ReactNode;
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    fullWidth?: boolean;
    showChevron?: boolean; // > 아이콘 노출 여부
    textClassName?: string;
}

function Button({
    color = "secondary",
    variant = "contained",
    size = "medium",
    fullWidth = false,
    showChevron = false,
    className,
    textClassName,
    children,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main`;
            case "outlined":
                return `border-2 border-text-${color} bg-transparent`;
            case "text":
                return `bg-transparent`;
            case "icon":
                return `rounded-full p-2`;
            default:
                return "";
        }
    };

    return (
        <Pressable
            className={twMerge(
                "flex-row items-center rounded-[10px]",
                // 🔥 핵심: showChevron이 있으면 양 끝 정렬(justify-between), 없으면 무조건 가운데 정렬(justify-center)
                showChevron ? "justify-between" : "justify-center",
                BUTTON_SIZE_STYLE[size],
                getVariantClasses(),
                fullWidth ? "w-full" : "",
                className,
            )}
            {...props}>
            {/* 글자 영역 */}
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "leading-none text-center font-normal text-[#000000]",
                        size === "small" ? "text-large" : size === "large" ? "text-2xl" : "text-xl",
                        textClassName
                    )}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}

            {/* 🔥 showChevron이 true일 때만 아이콘을 렌더링하고, false일 때는 아무것도 남기지 않습니다 */}
            {showChevron && (
                <Feather
                    name="chevron-right"
                    size={size === "small" ? 18 : 24}
                    className="text-[#191919]"
                />
            )}
        </Pressable>
    );
}

export default Button;
