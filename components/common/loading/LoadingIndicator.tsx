import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    fullScreen?: boolean; // 로딩 컴포넌트가 전체 화면의 중심에 들어가길 원하면 true
    // false 라면 사용되는 그 자리에 빙글빙글 spinner가 들어갈 것임
}

function LoadingIndicator({
    fullScreen = false,
    size = "large",
    color = "#A3D9C9",
    className,
    ...props
}: LoadingIndicatorProps) {
    if (fullScreen) {
        return (
            <View
                className={twMerge(
                    ["absolute", "z-50", "inset-0"],
                    ["justify-center", "items-center"],
                    className,
                )}>
                {/* 배경 */}
                <View
                    className={twMerge(
                        ["absolute", "inset-0"],
                        ["bg-background-default", "opacity-70"],
                    )}></View>
                {/* 스피너 */}
                <ActivityIndicator size={size} color={color} {...props} />
            </View>
        );
    }

    return (
        <View className={twMerge(["py-10", "justify-center", "items-center"], className)}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
}

export default LoadingIndicator;
