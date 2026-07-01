import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponents";

function MainFooter() {
    return (
        <View
            className={twMerge([
                "w-full",
                "h-24",
                "flex-row",
                "justify-between",
                "items-center",
                "px-7",
                "bg-background-paper"
            ])}>
            <Pressable className={twMerge(["justify-center", "items-center"])}>
                <Ionicons name={"home-outline"} size={24} className={"text-text-default"} />
                <TextComponent className={""}>홈</TextComponent>
            </Pressable>
            <Pressable className={twMerge(["justify-center", "items-center"])}>
                <Ionicons name={"home-outline"} size={24} className={"text-text-default"} />홈
            </Pressable>
            <Pressable className={twMerge(["justify-center", "items-center"])}>
                <Ionicons name={"home-outline"} size={24} className={"text-text-default"} />홈
            </Pressable>
            <Pressable className={twMerge(["justify-center", "items-center"])}>
                <Ionicons name={"home-outline"} size={24} className={"text-text-default"} />홈
            </Pressable>
        </View>
    );
}

export default MainFooter;
