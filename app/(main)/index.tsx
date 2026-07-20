import { View, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Redirect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

export default function LandingScreen() {
    const router = useRouter();
    const { isLoggedIn, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return (
            <LoadingIndicator
                fullScreen={true}
            />
        );
    }

    if (isLoggedIn) {
        return <Redirect href="/home" />;
    }

    return (
        <View className={twMerge("flex-1", "bg-background-default")}>
            <ContentContainer className="justify-center items-center">
                {/* 상단 로고 및 타이틀 영역 */}
                <View className="items-center mb-10">
                    <View className="items-center justify-center mb-2">
                        <View className={twMerge("flex-row", "relative")}>
                            <Ionicons
                                name="paw"
                                size={65}
                                className="absolute text-success-main"
                                style={{ top: -55, left: -15, transform: [{ rotate: "15deg" }] }}
                            />
                            <Ionicons
                                name="paw"
                                size={55}
                                className="absolute text-[#F8A69B] opacity-80"
                                style={{ top: -10, left: -60, transform: [{ rotate: "-25deg" }] }}
                            />
                        </View>

                    </View>
                </View>
                <View
                    className={twMerge(
                        ["flex-row", "justify-center"],
                        [["mb-10", "pb-10", "pt-4"]],
                    )}>
                    <TextComponent
                        className={twMerge(["text-text-secondary", "text-[28px]", "font-bold"])}>
                        마이
                    </TextComponent>
                    <TextComponent
                        className={twMerge(["text-[#F8A69B]", "text-[28px]", "font-bold"])}>
                        펫
                    </TextComponent>
                    <TextComponent
                        className={twMerge(["text-text-secondary", "text-[28px]", "font-bold"])}>
                        다이어리
                    </TextComponent>
                </View>


                <View className="w-full items-center">
                    <Pressable
                        onPress={() => router.push("/auth/login")}
                        className="bg-background-paper w-full max-w-[200px] py-3 items-center justify-center rounded-full shadow-sm mb-3">
                        <TextComponent className="text-base font-bold text-text-default">
                            로그인
                        </TextComponent>
                    </Pressable>

                    <TextComponent className="text-sm font-bold text-text-secondary mb-3">
                        OR
                    </TextComponent>

                    <Pressable
                        onPress={() => router.push("/auth/register")}
                        className="bg-background-paper w-full max-w-[200px] py-3 items-center justify-center rounded-full shadow-sm mb-6">
                        <TextComponent className="text-base font-bold text-text-default">
                            회원가입
                        </TextComponent>
                    </Pressable>

                    <Pressable onPress={() => router.push("/home")} className="p-2">
                        <TextComponent className="text-sm text-text-secondary underline underline-offset-4">
                            게스트로 입장하기
                        </TextComponent>
                    </Pressable>
                </View>
            </ContentContainer>
        </View>
    );
}
