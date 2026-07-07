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
        //* 1. MainHeaderMobile과 완전히 동일한 외부 틀 구조(높이 h-20, 배경색, 테두리) */
        <View
            className={twMerge(
                ["w-full", "h-20", "bg-background-default"],
                ["justify-center", "items-center"],
                ["border-b", "border-divider"],
            )}>
            <View className={twMerge(["w-full", "flex-row", "items-center", "max-w-7xl"])}>
                {/* 2. 왼쪽 영역: 반려동물 대신 유저 정보(초코맘)가 들어가는 곳 */}
                <View
                    className={twMerge(
                        ["flex-row", "h-20", "justify-between", "items-center"],
                        ["flex-1", "px-4", "h-full"],
                    )}>
                    <Pressable
                        onPress={() => router.push("/auth/edit")} // 프로필 수정 등 이동용
                        className={twMerge([
                            "flex-row",
                            "h-20",
                            "items-center",
                            "gap-2.5",
                            "w-full", // 💡 화살표를 끝으로 밀기 위해 터치 영역 가로를 100% 꽉 채웁니다
                        ])}>
                        {/* 유저 아바타 */}
                        <View
                            className={twMerge(
                                ["flex-row", "h-12", "w-12", "items-center", "justify-center"],
                                ["rounded-full", "bg-success-main"],
                            )}>
                            <Ionicons name="person" size={22} color="#FFFFFF" />
                        </View>

                        {/* 유저 닉네임 및 이메일 세로 배치 */}
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

                        {/* 💡 핵심: 이 공간 채우기 뷰가 중간에 남는 공간을 다 밀어내어 화살표를 오른쪽 끝으로 보냅니다 */}
                        <View className="flex-1" />

                        {/* 피그마에 있던 오른쪽 화살표 아이콘(소형) */}
                        <Ionicons name="chevron-forward" size={16} className="text-text-default" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default MyPageHeader;
