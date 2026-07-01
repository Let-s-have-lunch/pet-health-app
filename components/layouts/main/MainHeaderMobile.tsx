import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponents";

function MainHeaderMobile() {
    const router = useRouter();
    
    
    return (
        <View
            className={twMerge(
                ["w-full", "h-20", "bg-background-default"],
                ["justify-center"],
                ["border-b", "border-divider"],
            )}>
            <View
                className={twMerge(
                    ["flex-row", "h-20", "justify-between", "items-center"],
                    ["w-full", "px-4", "h-full"],
                )}>
                <Pressable className={twMerge(["flex-row","h-20", "items-center", "gap-1", "h-full"])}>
                    <View
                        className={twMerge(
                            ["flex-row", "h-12", "w-12", "items-center"],
                            ["rounded-full", "bg-success-main"],
                        )}></View>
                    <TextComponent>초코</TextComponent>
                    <Ionicons
                        name={"chevron-down"}
                        size={16}
                        className={"text-text-default"}></Ionicons>
                </Pressable>
            </View>
        </View>
    );
}

export default MainHeaderMobile;