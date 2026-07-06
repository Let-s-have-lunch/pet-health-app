import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";

function MainHeaderMobile() {
    const router = useRouter();


    // 테마 변경
    const { theme, onChangeTheme } = useThemeStore();

    return (
        <View
            className={twMerge(
                ["w-full", "h-20", "bg-background-paper"],
                ["justify-center", "items-center"],
                ["border-b", "border-divider"],
            )}>
            <View className={twMerge(["w-full", "flex-row", "items-center"])}>
                {/*  마이펫 사진및 이믈 */}
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

                {/*  우측 컨트롤 영역 */}
                {/* 색상 바뀌는 아이콘 고양이 강아지 이것은 추가로 수정생각하기 선생님께 물어보고 넣기 */}
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
                    {/* 관리자일때 보이는 아이콘 */}
                    {/* TODO user와 관리자 일때 추가 하기  백엔드 연결후 */}
                    <Pressable
                        onPress={() => router.push("/admin")}
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["transition-all", "active:bg-background-default"],
                        )}>
                        <Ionicons name={"shield-half"} size={22} className={"text-text-default"} />
                    </Pressable>
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
