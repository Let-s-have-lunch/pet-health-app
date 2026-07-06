import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";

interface Props {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    children?: ReactNode; // 이 부분에 우측 아이콘이나 인풋창이 들어갑니다.
    className?: string;
}

function Title({ title, showBackButton = false, onBackPress, children, className }: Props) {
    return (
        <View
            className={twMerge(
                "h-[91px] flex-row items-center justify-between px-8 border-b border-divider bg-transparent",
                className,
            )}>
            {/* 왼쪽 영역: 뒤로가기 버튼 + 타이틀 */}
            <View className="flex-row items-center gap-4">
                {showBackButton && (
                    // 2. 터치 가능한 영역 태그(TouchableOpacity)로 감싸고 테일윈드를 먹입니다.
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="w-6 h-6 items-center justify-center" // 피그마 크기 24px = w-6, h-6
                        activeOpacity={0.7}>
                        {/* 3. 실제 아이콘 태그를 넣고 크기와 색상(시스템 토큰)을 지정합니다. */}
                        <Feather
                            name="chevron-left"
                            size={24} // 피그마 너비 24px 맞춤
                            className={twMerge("text-[#191919]")}
                        />
                    </TouchableOpacity>
                )}
                <Text
                    className={twMerge(
                        "text-secondary-contrast",
                        "font-bold",
                        "text-xl",
                        "leading-[24px]",
                        "text-center",
                    )}>
                    {title}
                </Text>
            </View>

            {/* 오른쪽 영역: 호출하는 화면에서 정의한 UI가 그대로 꽂히는 곳 */}
            <View className="flex-row items-center">{children}</View>
        </View>
    );
}

export default Title;
