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

                    {ADMIN_NAV_LIST.map(item => {

                        const isActive =
                            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                        return (
                            <Link href={item.path} key={item.path} asChild>
                                <Pressable
                                    className={twMerge(
                                        ["flex-row", "items-center", "gap-3", "px-4", "py-3.5"],
                                        ["rounded-xl", "transition-all"],
                                        isActive
                                            ? "bg-primary-main"
                                            : "hover:bg-background-default",
                                    )}>
                                    <Feather
                                        name={item.icon as any}
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-primary-contrast"
                                                : "text-text-secondary"
                                        }
                                    />
                                    <TextComponent
                                        className={twMerge(
                                            "font-bold",

                                            isActive
                                                ? "text-primary-contrast"
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

        </View>
    );
}

export default AdminAsideDesktop;
