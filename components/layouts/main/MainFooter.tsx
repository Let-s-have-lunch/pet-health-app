import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponents";
import { USER_NAV_LIST } from "@/constants/menu";
import { Link, usePathname } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function MainFooter() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    return (
        <View
            className={twMerge([
                "w-full",
                "h-24",
                "flex-row",
                "justify-between",
                "items-center",
                "px-7",
                "bg-background-paper",
            ])}>
            {USER_NAV_LIST.map(item => {
                const isActive =
                    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                return (
                    <Link href={item.path} key={item.path} asChild>
                        <Pressable className={twMerge(["justify-center", "items-center"])}>
                            <Feather
                                name={item.icon as any}
                                size={24}
                                className={"text-text-default"}
                            />
                            <TextComponent>{item.label}</TextComponent>
                        </Pressable>
                    </Link>
                );
            })}
        </View>
    );
}

export default MainFooter;
