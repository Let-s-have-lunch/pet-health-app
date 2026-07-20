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
    showChevron?: boolean;
    textClassName?: string;
    isFloating?: boolean;
    isCircle?: boolean;
    textColor?: string;
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
    textColor,
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
                isCircle ? "rounded-full" : "rounded-[28px]",

                isCircle ? "w-[48px] h-[48px] p-0" : BUTTON_SIZE_STYLE[size],
                showChevron && !isCircle ? "justify-between" : "justify-center",

                getVariantClasses(),
                fullWidth && !isCircle ? "w-full" : "",
                wrap && "flex-1",

                isFloating && "absolute bottom-6 right-6 z-50 shadow-lg",

                className,
            )}
            {...props}>

            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "leading-none text-center font-normal",
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
                    className={twMerge(textColor || "text-text-default")}
                />
            )}
        </Pressable>
    );
}

export default Button;
