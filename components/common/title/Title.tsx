import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";

interface Props {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    children?: ReactNode;
    className?: string;
}

function Title({ title, showBackButton = false, onBackPress, children, className }: Props) {
    return (
        <View
            className={twMerge(
                "w-full h-20 flex-row items-center justify-between px-8 border-b border-divider bg-transparent",
                className,
            )}>

            <View className="flex-row items-center gap-4">
                {showBackButton && (

                    <TouchableOpacity
                        onPress={onBackPress}
                        className="w-6 h-6 items-center justify-center" // 피그마 크기 24px = w-6, h-6
                        activeOpacity={0.7}>

                        <Feather
                            name="chevron-left"
                            size={24} // 피그마 너비 24px 맞춤
                            className={twMerge("text-text-default")}
                        />
                    </TouchableOpacity>
                )}
                <Text
                    className={twMerge(
                        "text-text-default",
                        "font-bold",
                        "text-xl",
                        "leading-[24px]",
                        "text-center",
                    )}>
                    {title}
                </Text>
            </View>


            <View className="flex-row items-center">{children}</View>
        </View>
    );
}

export default Title;
