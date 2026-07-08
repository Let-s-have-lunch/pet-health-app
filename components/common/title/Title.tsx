import React, { ReactNode } from "react";
import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";

interface Props {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    description?: string;
    children?: ReactNode;
    className?: string;
}

function Title({
                   title,
                   showBackButton = false,
                   onBackPress,
                   description,
                   children,
                   className,
               }: Props) {
    return (
        <View
            className={twMerge(
                "w-full h-20 flex-row items-center justify-between px-8 border-b border-divider bg-transparent",
                className,
            )}>
            <View className="flex-row items-center gap-4 flex-1">
                {showBackButton && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="w-6 h-6 items-center justify-center"
                        activeOpacity={0.7}>
                        <Feather
                            name="chevron-left"
                            size={24}
                            className={twMerge("text-text-default")}
                        />
                    </TouchableOpacity>
                )}
                <View className="flex-1">
                    <TextComponent
                        className={twMerge(
                            "text-text-default",
                            "font-bold",
                            "text-xl",
                            "leading-[24px]",
                        )}
                        numberOfLines={1}
                    >
                        {title}
                    </TextComponent>
                    {description && (
                        <TextComponent
                            className={twMerge("text-sm", "text-text-secondary", "mt-1")}
                            numberOfLines={1}
                        >
                            {description}
                        </TextComponent>
                    )}
                </View>
            </View>

            <View className="flex-row items-center shrink-0 pl-4">{children}</View>
        </View>
    );
}

export default Title;