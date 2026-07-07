import React from "react";
import { twMerge } from "tailwind-merge";

// 그림자 단계를 정의 (팀 내에서 사용할 스타일 통일)
type ShadowSize = "none" | "sm" | "md" | "lg";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    shadow?: ShadowSize;
    wrap?: boolean;
}

const getShadowStyles: Record<ShadowSize, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]",
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
        <div
            className={twMerge(
                "bg-white",
                "rounded-[10px]",
                "p-5",
                wrap && "flex-1",
                getShadowStyles[shadow],
                className,
            )}
            {...props}>
            {children}
        </div>
    );
}
