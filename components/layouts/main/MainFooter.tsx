import { Alert, Platform, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { USER_NAV_LIST } from "@/constants/menu";
import { Link, usePathname, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function MainFooter() {
    const pathname = usePathname();
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    const handleTabPress = (e: any, path: string) => {
        if (path === "/diary" && !isLoggedIn) {
            e.preventDefault();

            if (Platform.OS === "web") {
                window.alert("로그인이 필요한 서비스입니다.");
                router.push("/auth/login");
            } else {
                Alert.alert("알림", "로그인이 필요한 서비스입니다.", [
                    { text: "취소", style: "cancel" },
                    { text: "로그인하기", onPress: () => router.push("/auth/login") },
                ]);
            }
        }
    };
    return (
        <View
            className={twMerge(
                ["w-full", "h-20", "justify-center", "items-center"],
                ["px-7", "bg-background-paper"],
            )}>
            <View
                className={twMerge(
                    ["w-full", "h-full", "max-w-xl"],
                    ["flex-row", "justify-between", "items-center"],
                )}>
                {USER_NAV_LIST.map(item => {
                    const isActive =
                        item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                    return (
                        <Link href={item.path} key={item.path} asChild>
                            <Pressable
                                onPress={e => handleTabPress(e, item.path)}
                                className={twMerge(["justify-center", "items-center"])}>
                                <Feather
                                    name={item.icon as any}
                                    size={24}
                                    className={
                                        isActive ? "text-secondary-point" : "text-text-default"
                                    }
                                />
                                <TextComponent
                                    className={twMerge(
                                        ["text-xs", "pb-0.5"],
                                        isActive ? "text-secondary-point" : "text-text-default",
                                    )}>
                                    {item.label}
                                </TextComponent>
                            </Pressable>
                        </Link>
                    );
                })}
            </View>
        </View>
    );
}

export default MainFooter;
