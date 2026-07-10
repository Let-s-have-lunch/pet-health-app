import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

import TextComponent from "@/components/common/text/TextComponent";
import { Pet, PetGender } from "@/types/pet";

type Props = {
    pet: Pet;
    onPressEdit: () => void;
};

export default function PetCard({ pet, onPressEdit }: Props) {
    return (
        <View className={twMerge(["mx-5", "rounded-[24px]", "bg-white", "p-5", "shadow-lg"])}>
            {/* 상단 */}
            <View className={twMerge(["flex-row", "items-center", "justify-between"])}>
                <TextComponent className="text-[26px] font-bold text-[#2F2A28]">
                    반려동물등록증
                </TextComponent>

                <Pressable
                    onPress={onPressEdit}
                    className={twMerge([
                        "rounded-[10px]",
                        "border",
                        "border-[#A3D9C9]",
                        "px-4",
                        "py-2",
                    ])}>
                    <TextComponent className="font-semibold text-[#2F2A28]">수정</TextComponent>
                </Pressable>
            </View>

            {/* 등록번호 */}
            <TextComponent className="mt-3 text-base text-[#8A8A8A]">
                {pet.registrationNumber ?? "--"}
            </TextComponent>

            {/* 내용 */}
            <View className={twMerge(["mt-5", "flex-row", "justify-between"])}>
                {/* 왼쪽 */}
                <View className="flex-1">
                    <InfoRow label="이름" value={pet.name} />

                    <InfoRow label="생년월일" value={pet.birthdate ?? "--"} />

                    <InfoRow label="성별" value={pet.gender === PetGender.MALE ? "수컷" : "암컷"} />

                    <InfoRow label="동물종" value={pet.species} />

                    <InfoRow label="품종" value={pet.breed ?? "--"} />

                    <InfoRow label="중성화" value={pet.neutered ? "O" : "X"} />
                </View>

                {/* 사진 */}
                <View
                    className={twMerge([
                        "ml-4",
                        "h-40",
                        "w-32",
                        "items-center",
                        "justify-center",
                        "rounded-[20px]",
                        "bg-[#F6F6F6]",
                    ])}>
                    <TextComponent className="text-5xl">🐾</TextComponent>
                </View>
            </View>
        </View>
    );
}

type InfoRowProps = {
    label: string;
    value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <View className={twMerge(["mb-2", "flex-row"])}>
            <TextComponent className="w-20 text-[#8A8A8A]">{label}</TextComponent>

            <TextComponent className="font-semibold text-[#2F2A28]">{value}</TextComponent>
        </View>
    );
}
