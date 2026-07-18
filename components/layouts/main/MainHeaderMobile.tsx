import { Image, Pressable, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Role } from "@/types/user";
import { usePetStore } from "@/stores/pet/usePetStore";
import SettingsDesktop from "@/components/layouts/main/SettingsDesktop";
import { useState } from "react";
import SettingsMobile from "@/components/layouts/main/SettingMobile";

function MainHeaderMobile() {
    const router = useRouter();
    const { isLoggedIn, user } = useAuthStore();
    const { theme, onChangeTheme } = useThemeStore();
    const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";
    const { selectedPet, isAddCardSelected } = usePetStore();

    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const profileImageUrl = selectedPet?.profileImage
        ? `${BASE_URL}${selectedPet.profileImage}`
        : undefined;

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
                    <Pressable className={twMerge(["flex-row", "items-center", "gap-3", "h-full"])}>
                        {!isAddCardSelected && selectedPet?.profileImage ? (
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
                                )}>
                                <Ionicons name="paw" size={26} color="white" />
                            </View>
                        )}
                        <TextComponent className={twMerge(["text-[22px]", "font-bold"])}>
                            {isAddCardSelected ? "반려동물 등록" : selectedPet?.name}
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
                            name={theme === "light" ? "color-palette-outline" : "color-palette"}
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
                        onPress={() => setIsSettingsOpen(true)}
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
            {isMobile ? (
                <SettingsMobile visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            ) : (
                <SettingsDesktop
                    visible={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
        </View>
    );
}

export default MainHeaderMobile;
