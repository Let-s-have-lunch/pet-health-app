import { Pressable, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { Pet } from "@/types/pet";

type Props = {
    pets: Pet[];
};

export default function PetCard({ pets }: Props) {
    const pet = pets[0];

    if (!pet) return null;

    return (
        <View
            className="mx-5 mt-4 rounded-[14px] border bg-white p-4"
            style={{
                borderColor: "#A3D9C9",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                elevation: 4,
            }}>
            {/* 제목 */}
            <View className="mb-4 flex-row items-center justify-between">
                <TextComponent className="text-xl font-bold">반려동물 등록증</TextComponent>

                <Pressable
                    className="rounded-md border px-3 py-1"
                    style={{ borderColor: "#A3D9C9" }}>
                    <TextComponent className="text-xs font-semibold" style={{ color: "#4D9B87" }}>
                        수정
                    </TextComponent>
                </Pressable>
            </View>

            <View className="flex-row">
                {/* 사진 */}
                <View
                    className="mr-4 h-28 w-28 rounded-xl"
                    style={{ backgroundColor: "#E8E8E8" }}
                />

                {/* 정보 */}
                <View className="flex-1">
                    <InfoRow label="이름" value={pet.name} />

                    <InfoRow label="생년월일" value={pet.birthdate ?? "-"} />

                    <InfoRow label="성별" value={pet.gender === "MALE" ? "수컷" : "암컷"} />

                    <InfoRow label="종" value={pet.species} />

                    <InfoRow label="품종" value={pet.breed ?? "-"} />

                    <InfoRow label="중성화" value={pet.neutered ? "중성화" : "미중성화"} />
                </View>
            </View>
        </View>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View className="mb-1 flex-row">
            <TextComponent className="w-16 text-sm" style={{ color: "#666" }}>
                {label}
            </TextComponent>

            <TextComponent className="text-sm font-semibold">{value}</TextComponent>
        </View>
    );
}
