import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

function PostPageHeader() {


    return (
        <View
            className={twMerge(
                ["w-full", "h-20", "bg-background-default"],
                ["justify-center", "items-center"],
                ["border-b", "border-divider"],
            )}>
            <View className={twMerge(["w-full", "flex-row", "items-center", "max-w-7xl"])}>
                <View
                    className={twMerge(
                        ["flex-row", "h-20", "items-center"],
                        ["flex-1", "px-4", "h-full"],
                    )}>
                    <View
                        className={twMerge(
                            ["flex-row", "h-12", "w-12", "items-center", "justify-center"],
                            ["rounded-full", "bg-success-main"],
                        )}>
                        <Feather name={"message-circle"} size={22} />
                    </View>
                    <View className={twMerge(["px-2"])}>
                        <TextComponent className={twMerge(["text-xl", "font-bold"])}>
                            커뮤니티
                        </TextComponent>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default PostPageHeader;
