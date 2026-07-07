import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function MyPageHeader() {
    const router = useRouter();
    const { isLoggedIn, user } = useAuthStore();

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
                    <Pressable
                        onPress={() => router.push(isLoggedIn ? "/auth/edit" : "/auth/login")} // 프로필 수정 등 이동용
                        className={twMerge([
                            "flex-row",
                            "h-20",
                            "items-center",
                            "gap-2.5",
                            "w-full",
                        ])}>

                        <View
                            className={twMerge(
                                ["flex-row", "h-12", "w-12", "items-center", "justify-center"],
                                ["rounded-full", "bg-success-main"],
                            )}>
                            <Ionicons name="person" size={22} color="#FFFFFF" />
                        </View>

                        <View className="justify-center">
                            <TextComponent
                                className={twMerge(["text-base", "font-bold", "leading-tight"])}>
                                {isLoggedIn ? user?.nickname : "게스트"}
                            </TextComponent>
                            {isLoggedIn && (
                                <TextComponent
                                    className={twMerge([
                                        "text-xs",
                                        "text-text-muted",
                                        "font-normal",
                                        "mt-0.5",
                                    ])}>
                                    {user?.email}
                                </TextComponent>
                            )}
                        </View>

                        <View className="flex-1" />


                        <Ionicons name="chevron-forward" size={16} className="text-text-default" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default MyPageHeader;
