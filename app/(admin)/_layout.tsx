import { Slot } from "expo-router";
import { ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import AdminAsideDesktop from "@/components/layouts/admin/AdminAsideDesktop";
import AdminAsideMobile from "@/components/layouts/admin/AdminAsideMobile";

function AdminLayout() {
    return (
        <View className={twMerge(["flex-1", "flex-col", "md:flex-row"])}>

            <View className={twMerge("hidden", "md:flex", "h-full")}>
                <AdminAsideDesktop />
            </View>

            <View className={twMerge("flex", "md:hidden", "w-full", "z-50")}>
                <AdminAsideMobile />
            </View>

            <View className={"flex-1 bg-background-default"}>
                <ScrollView
                    className={"flex-1"}
                    contentContainerClassName={"p-[25px] md:p-8 items-center"}
                    showsVerticalScrollIndicator={false}>
                    <View className={"w-full max-w-5xl"}>
                        <Slot />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AdminLayout;