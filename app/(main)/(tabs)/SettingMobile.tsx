import { Modal, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { SETTINGS_MENU_LIST } from "@/constants/menu";

interface SettingsMobileProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsMobile({ visible, onClose }: SettingsMobileProps) {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        onClose();
        router.push(path);
    };

    const getMobileItemStyle = (pressed: boolean) => ({
        backgroundColor: pressed ? "#E5E7EB" : "transparent",
    });

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View className={twMerge("flex-1", "justify-end")}>
                <Pressable className={twMerge("absolute", "inset-0")} onPress={onClose} />

                <View
                    className={twMerge(
                        "w-full",
                        "bg-background-paper",
                        "rounded-t-3xl",
                        "pb-10",
                        "border-t",
                        "border-divider",
                    )}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -10 },
                        shadowOpacity: 0.15,
                        shadowRadius: 30,
                        elevation: 24,
                    }}>
                    <View className={twMerge("items-center", "pt-4", "pb-2")}>
                        <View className={twMerge("w-12", "h-1.5", "bg-divider", "rounded-full")} />
                    </View>

                    <View className={twMerge("px-4", "pt-2")}>
                        {/* ✨ map 함수를 사용하여 메뉴 렌더링 */}
                        {SETTINGS_MENU_LIST.map((menu, index) => {
                            const isLast = index === SETTINGS_MENU_LIST.length - 1;

                            return (
                                <Pressable
                                    key={menu.path}
                                    onPress={() => handleNavigation(menu.path)}
                                    style={({ pressed }) => getMobileItemStyle(pressed)}
                                    className={twMerge([
                                        "p-5",
                                        !isLast && "border-b border-divider", // 마지막 항목이 아닐 때만 밑줄 추가
                                        "hover:bg-background-default",
                                        "transition",
                                        "rounded-xl",
                                    ])}>
                                    <TextComponent
                                        className={twMerge([
                                            "text-lg",
                                            "text-text-default",
                                            "text-center",
                                        ])}>
                                        {menu.label}
                                    </TextComponent>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
