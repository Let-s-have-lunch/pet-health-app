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
}

function Button({
    color = "secondary",
    variant = "contained",
    size = "medium",
    fullWidth = false,
    showChevron = false,
    wrap = false,
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
                return `border-2 border-text-${color} bg-transparent`;
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
                "flex-row items-center rounded-[10px]",

                showChevron ? "justify-between" : "justify-center",
                BUTTON_SIZE_STYLE[size],
                getVariantClasses(),
                fullWidth ? "w-full" : "",
                wrap && "flex-1",
                className,
            )}
            {...props}>
            {/* 글자 영역 */}
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "leading-none text-center font-normal text-[#000000]",
                        size === "small" ? "text-base" : size === "large" ? "text-xl" : "text-lg",
                        textClassName
                    )}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}

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
