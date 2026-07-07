import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface ContentContainerProps {
    children: ReactNode;
    className?: string;
}

function ContentContainer({ children, className }: ContentContainerProps) {
    return (
        <View
            className={twMerge([
                "flex-1",
                "w-full",
                "max-w-7xl",
                "p-[25px]",
                "md:py-8",
                "self-center",
                "bg-background-default",
                className, // 추가적인 스타일 확장이 필요할 때 사용
            ])}>
            {children}
        </View>
    );
}

export default ContentContainer;
