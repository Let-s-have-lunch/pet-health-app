import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather, Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponents";
import { USER_NAV_LIST } from "@/constants/menu";
import { Link, usePathname } from "expo-router";

function MainFooter() {
    const pathname = usePathname();
    // const { user, logout } = useAuthStore();
    return (
        <View
            className={twMerge(
                ["w-full", "h-20", "justify-center", "items-center"],
                ["px-7", "bg-background-paper"],
            )}>
            <View className={twMerge(["w-full", "h-full", "max-w-xl"], ["flex-row", "justify-between", "items-center"])}>
                {USER_NAV_LIST.map(item => {
                    const isActive =
                        item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                    return (
                        <Link href={item.path} key={item.path} asChild>
                            <Pressable className={twMerge(["justify-center", "items-center"])}>
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
