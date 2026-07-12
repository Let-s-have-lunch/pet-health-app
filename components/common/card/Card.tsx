import React from "react";
import { View, ViewProps } from "react-native"; // 💡 View와 ViewProps를 불러옵니다.
import { twMerge } from "tailwind-merge";

type ShadowSize = "none" | "sm" | "md" | "lg";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    shadow?: ShadowSize;
    wrap?: boolean;
}

const getShadowStyles: Record<ShadowSize, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-[0_4px_16px_0_rgba(0,0,0,0.08)]",
    lg: "shadow-lg",
};

export default function Card({
    children,
    shadow = "none",
    wrap = false,
    className,
    ...props
}: CardProps) {
    return (
        <View
            className={twMerge(
                "bg-background-paper",
                "rounded-[28px]",
                "p-5",
                wrap && "flex-1",
                getShadowStyles[shadow],
                className,
            )}
            {...props}>
            {children}
        </View>
    );
}
