import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

type RowProps = {
    label: string;
    value: string;
};

export default function InfoRow({ label, value }: RowProps) {
    return (
        <View className={twMerge(["mb-2"], ["flex-row", "items-center"])}>
            <TextComponent className={twMerge(["w-[80px]"], ["text-[17px]"], ["text-text-secondary"])}>
                {label}
            </TextComponent>
            <TextComponent
                numberOfLines={1}
                className={twMerge(["flex-1"], ["text-[17px]"], ["font-semibold"])}>
                {value}
            </TextComponent>
        </View>
    );
}
