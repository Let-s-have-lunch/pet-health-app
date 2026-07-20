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
                ["bg-background-paper"],
                ["shadow-[0_-2px_4px_rgba(0,0,0,0.05)]", "elevation-3"],
            )}>
            <View
                className={twMerge(
                    ["w-full", "h-full", "max-w-xl"],
                    ["flex-row", "justify-between", "items-center"],
                )}>
                {USER_NAV_LIST.map((item, index) => {
                    const isActive =
                        item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                    const isLast = index === USER_NAV_LIST.length - 1;

                    return (
                        <Link href={item.path} key={item.path} asChild className="w-[25%]">
                            <Pressable
                                onPress={e => handleTabPress(e, item.path)}
                                className={twMerge([
                                    "justify-center",
                                    "items-center",
                                    "relative",
                                    "h-full",
                                ])}>
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

                                {!isLast && (
                                    <View
                                        className="absolute right-0 top-1/2 mt-[-8px] w-[1px] h-[16px] bg-[#000000]/15"
                                    />
                                )}
                            </Pressable>
                        </Link>
                    );
                })}
            </View>
        </View>
    );
}

export default MainFooter;
