import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Role } from "@/types/user";

function MainHeaderMobile() {
    const router = useRouter();
    const { isLoggedIn, user } = useAuthStore();

    const { theme, onChangeTheme } = useThemeStore();

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
                        className={twMerge([
                            "flex-row",
                            "h-20",
                            "items-center",
                            "gap-1",
                            "h-full",
                        ])}>
                        <View
                            className={twMerge(
                                ["flex-row", "h-12", "w-12", "items-center"],
                                ["rounded-full", "bg-success-main"],
                            )}></View>
                        <TextComponent className={twMerge(["text-xl", "font-bold"])}>
                            초코
                        </TextComponent>
                    </Pressable>
                </View>

                <View className={twMerge(["flex-row", "items-center", "gap-2", "px-4"])}>
                    <Pressable
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["transition-all", "active:bg-background-default"],
                        )}>
                        <Ionicons
                            onPress={onChangeTheme}
                            name={theme === "light" ? "paw" : "paw-outline"}
                            size={24}
                            className={twMerge("text-text-default")}
                        />
                    </Pressable>

                    {isLoggedIn && user?.role === Role.ADMIN && (
                        <Pressable
                            onPress={() => router.push("/admin")}
                            className={twMerge(
                                ["p-2", "rounded-full"],
                                ["transition-all", "active:bg-background-default"],
                            )}>
                            <Ionicons
                                name={"shield-half"}
                                size={22}
                                className={"text-text-default"}
                            />
                        </Pressable>
                    )}
                    <Pressable
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["transition-all", "active:bg-background-default"],
                        )}>
                        <Ionicons
                            name={"settings-outline"}
                            size={22}
                            className={"text-text-default"}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default MainHeaderMobile;
