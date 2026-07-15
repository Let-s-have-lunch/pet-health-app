import { Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Role } from "@/types/user";
import { usePetStore } from "@/stores/usePetStore";

function MainHeaderMobile() {
    const router = useRouter();
    const { isLoggedIn, user } = useAuthStore();
    const { theme, onChangeTheme } = useThemeStore();
    const selectedPet = usePetStore(state => state.selectedPet);
    const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";
    const profileImageUrl = selectedPet?.profileImage
        ? `${BASE_URL}${selectedPet.profileImage}`
        : undefined;


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
                    <Pressable className={twMerge(["flex-row", "items-center", "gap-1", "h-full"])}>
                        {selectedPet?.profileImage ? (
                            <Image
                                source={{ uri: profileImageUrl }}
                                className={twMerge(["h-12", "w-12"], ["rounded-full"])}
                            />
                        ) : (
                            <View
                                className={twMerge(
                                    ["h-12", "w-12"],
                                    ["items-center", "justify-center"],
                                    ["rounded-full", "bg-success-main"],
                                )}
                            />
                        )}
                        <TextComponent className={twMerge(["text-xl", "font-bold"])}>
                            {selectedPet?.name ?? "반려동물 등록"}
                        </TextComponent>
                    </Pressable>
                </View>

                <View className={twMerge(["flex-row", "items-center", "gap-2", "px-4"])}>
                    <Pressable
                        onPress={onChangeTheme}
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["active:bg-background-default"],
                        )}>
                        <Ionicons
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
