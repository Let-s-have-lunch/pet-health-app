import { Image, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextComponent from "@/components/common/text/TextComponent";
import { Pet } from "@/types/pet";

type Props = {
    pet: Pet;
    onPressEdit?: () => void;
};

export default function PetCard({ pet, onPressEdit }: Props) {
    return (
        <View
            className="w-full rounded-[28px] bg-white p-5"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 20,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                elevation: 6,
            }}
        >
            {/* 상단 */}
            <View className="mb-5 flex-row items-center justify-between">
                <TextComponent className="text-[24px] font-bold text-[#2F2A28]">
                    반려동물 등록증
                </TextComponent>

                <Pressable
                    onPress={onPressEdit}
                    className="rounded-xl border border-[#8BC5B2] px-4 py-2"
                >
                    <TextComponent className="text-[#5A8E80] font-semibold">
                        수정
                    </TextComponent>
                </Pressable>
            </View>

            {/* 내용 */}
            <View className="flex-row">

                {/* 사진 */}

                {pet.profileImage ? (
                    <Image
                        source={{ uri: pet.profileImage }}
                        className="h-32 w-32 rounded-2xl bg-gray-200"
                    />
                ) : (
                    <View className="h-36 w-36 items-center justify-center rounded-2xl bg-gray-200">
                        <Ionicons
                            name="paw"
                            size={42}
                            color="#777"
                        />
                    </View>
                )}

                {/* 정보 */}

                <View className="ml-6 flex-1 justify-center">

                    <InfoRow
                        label="이름"
                        value={pet.name}
                    />

                    <InfoRow
                        label="생년월일"
                        value={
                            pet.birthdate
                                ? pet.birthdate.slice(0, 10)
                                : "-"
                        }
                    />

                    <InfoRow
                        label="성별"
                        value={
                            pet.gender === "MALE"
                                ? "수컷"
                                : "암컷"
                        }
                    />

                    <InfoRow
                        label="종"
                        value={
                            pet.species === "DOG"
                                ? "강아지"
                                : "고양이"
                        }
                    />

                    <InfoRow
                        label="품종"
                        value={pet.breed || "-"}
                    />

                    <InfoRow
                        label="중성화"
                        value={
                            pet.neutered
                                ? "중성화"
                                : "미완료"
                        }
                    />

                </View>

            </View>
        </View>
    );
}

type RowProps = {
    label: string;
    value: string;
};

function InfoRow({
                     label,
                     value,
                 }: RowProps) {
    return (
        <View className="mb-2 flex-row">
            <TextComponent className="w-20 text-[#666]">
                {label}
            </TextComponent>

            <TextComponent className="font-semibold text-[#2F2A28]">
                {value}
            </TextComponent>
        </View>
    );
}