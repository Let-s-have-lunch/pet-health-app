import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Link, usePathname } from "expo-router";
import { ADMIN_NAV_LIST } from "@/constants/menu";
import { Feather, Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function AdminAsideDesktop() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <View
            className={twMerge(
                ["w-[250px]", "h-full", "flex-col", "justify-between"],
                ["bg-background-paper", "border-r", "border-divider"],
            )}>
            <View>
                <Link
                    href={"/admin"}
                    asChild
                    className={twMerge(
                        ["flex-row", "h-20", "items-center"],
                        ["border-b", "border-divider"],
                    )}>
                    <Pressable>
                        <TextComponent className={twMerge(["text-xl", "font-semibold", "px-8"])}>
                            <Ionicons name={"shield-half"} size={22} className={twMerge(["pr-1", "text-text-default"])} />
                            관리자 센터
                        </TextComponent>
                    </Pressable>
                </Link>

                <View className={"px-3 py-4 gap-1"}>
                    {/* 실제 메뉴판 */}
                    {ADMIN_NAV_LIST.map(item => {
                        // 지금 사용자가 보고 있는 화면이 어떤 메뉴에 속하는지 강조
                        const isActive =
                            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                        return (
                            <Link href={item.path} key={item.path} asChild>
                                <Pressable
                                    className={twMerge(
                                        ["flex-row", "items-center", "gap-3", "px-4", "py-3.5"],
                                        ["rounded-xl", "transition-all"],
                                        isActive
                                            ? "bg-primary-main" //
                                            : "hover:bg-background-default", // 지금 현재 사용자가 위치한 메뉴는 배경색 강조
                                    )}>
                                    <Feather
                                        name={item.icon as any}
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-primary-contrast" // light 폰트 색상이 않보여서 내 맘대로 수정
                                                : "text-text-secondary"
                                        }
                                    />
                                    <TextComponent
                                        className={twMerge(
                                            "font-bold",

                                            isActive
                                                ? "text-primary-contrast" // light 폰트 색상이 않보여서 내 맘대로 수정
                                                : "text-text-default",
                                        )}>
                                        {item.label}
                                    </TextComponent>
                                </Pressable>
                            </Link>
                        );
                    })}
                </View>
            </View>
            {/* 로그인 로그아웃 상태 */}
        </View>
    );
}

export default AdminAsideDesktop;
