import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { View } from "react-native";

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
                        ["flex-row", "h-20", "justify-between", "items-center"],
                        ["flex-1", "px-4", "h-full"],
                    )}>
                    <View className={"justify-between"}>
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
