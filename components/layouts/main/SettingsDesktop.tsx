import { Modal, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { SETTINGS_MENU_LIST } from "@/constants/menu";

interface SettingsDropdownProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsDesktop({ visible, onClose }: SettingsDropdownProps) {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View className={twMerge("flex-1", "items-center")}>
                <Pressable className={twMerge("absolute", "inset-0")} onPress={onClose} />
                <View
                    className={twMerge("w-full", "max-w-7xl", "h-full", "relative")}
                    pointerEvents="box-none">
                    <View
                        className={twMerge(
                            ["absolute", "top-20", "right-4"],
                            [
                                "w-40",
                                "bg-background-paper",
                                "rounded-xl",
                                "shadow-lg",
                                "elevation-5",
                            ],
                            ["border", "border-divider", "overflow-hidden"],
                        )}>
                        {/* ✨ map 함수를 사용하여 메뉴 렌더링 */}
                        {SETTINGS_MENU_LIST.map((menu, index) => {
                            const isLast = index === SETTINGS_MENU_LIST.length - 1;

                            return (
                                <Pressable
                                    key={menu.path}
                                    onPress={() => handleNavigation(menu.path)}
                                    className={twMerge([
                                        "p-4",
                                        !isLast && "border-b border-divider", // 마지막 항목이 아닐 때만 밑줄 추가
                                        "active:bg-background-default",
                                        "hover:bg-background-default",
                                        "cursor-pointer",
                                        "transition",
                                    ])}>
                                    <TextComponent
                                        className={twMerge([
                                            "text-base",
                                            "text-text-default",
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
