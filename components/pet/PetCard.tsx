import { Pet } from "@/types/pet";
import Card from "@/components/common/card/Card";
import { Image, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Ionicons } from "@expo/vector-icons";
import InfoRow from "@/components/common/infoRow/InfoRow";

type Props = {
    pet: Pet;
    onPressEdit?: () => void;
};

export default function PetCard({ pet, onPressEdit }: Props) {
    return (
        <Card shadow={"md"} style={{ width: "100%", minHeight: 320 }} className={twMerge("px-8")}>
            <View
                className={twMerge(
                    ["mt-3", "mb-8"],
                    ["flex-row"],
                    ["items-center", "justify-between"],
                )}>
                <TextComponent
                    className={twMerge(["text-[28px]", "text-text-default"], ["font-bold"])}>
                    반려동물 등록증
                </TextComponent>
                <Pressable
                    onPress={onPressEdit}
                    className={twMerge(
                        ["rounded-xl"],
                        ["border", "border-[#A6DDD0]"],
                        ["px-3.5", "py-2"],
                    )}>
                    <TextComponent
                        className={twMerge(["font-semibold"], ["text-[#5C9587]"], ["text-[16px]"])}>
                        수정
                    </TextComponent>
                </Pressable>
            </View>

            <View className={twMerge(["flex-row", "items-center"])}>
                {pet.profileImage ? (
                    <Image
                        source={{
                            uri: pet.profileImage,
                        }}
                        className={twMerge(["h-40", "w-40"], ["rounded-[22px]"], ["bg-[#F6C5BE]"])}
                    />
                ) : (
                    <View
                        className={twMerge(
                            ["h-40", "w-40"],
                            ["items-center", "justify-center"],
                            ["rounded-[22px]"],
                            ["bg-[#F6C5BE]"],
                        )}>
                        <Ionicons name={"paw"} size={48} color={"white"} />
                    </View>
                )}

                <View className={twMerge(["ml-8"], ["flex-1"])}>
                    <InfoRow label={"이름"} value={pet.name} />
                    <InfoRow
                        label={"생년월일"}
                        value={pet.birthdate ? pet.birthdate.slice(0, 10) : "-"}
                    />
                    <InfoRow label={"성별"} value={pet.gender === "MALE" ? "수컷" : "암컷"} />
                    <InfoRow label={"종"} value={pet.species === "dog" ? "강아지" : "고양이"} />
                    <InfoRow label={"품종"} value={pet.breed || "-"} />
                    <InfoRow label={"중성화"} value={pet.neutered ? "중성화" : "미완료"} />
                </View>
                <Ionicons name={"chevron-forward"} size={30} color={"#7F8C8D"} />
            </View>
        </Card>
    );
}
