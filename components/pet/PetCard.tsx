import { Pet } from "@/types/pet";
import Card from "@/components/common/card/Card";
import { Image, Pressable, View, useWindowDimensions } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Ionicons } from "@expo/vector-icons";
import InfoRow from "@/components/common/infoRow/InfoRow";

type Props = {
    pet: Pet;
    onPressEdit?: () => void;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

export default function PetCard({ pet, onPressEdit }: Props) {
    const { width } = useWindowDimensions();

    const isSmall = width < 430;
    const imageSize = isSmall ? 140 : 160;

    const renderImage = () => {
        if (pet.profileImage) {
            return (
                <Image
                    source={{
                        uri: `${BASE_URL}${pet.profileImage}`,
                    }}
                    style={{
                        width: imageSize,
                        height: imageSize,
                        borderRadius: 28,
                        backgroundColor: "#F6C5BE",
                    }}
                />
            );
        }

        return (
            <View
                style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 28,
                    backgroundColor: "#F6C5BE",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Ionicons name="paw" size={48} color="white" />
            </View>
        );
    };

    return (
        <Card
            className={twMerge(["rounded-[28px]"])}
            shadow="none"
            style={{
                width: "100%",
                minHeight: isSmall ? 430 : 320,
                paddingHorizontal: isSmall ? 23 : 35,
                paddingVertical: 24,
            }}>
            {/* 제목 */}
            <View className={twMerge(["flex-row", "items-center", "justify-between", "mb-6"])}>
                <TextComponent
                    className={twMerge(["font-bold", "text-text-default"])}
                    style={{
                        fontSize: isSmall ? 24 : 28,
                    }}>
                    반려동물 등록증
                </TextComponent>

                <Pressable
                    onPress={onPressEdit}
                    className={twMerge(["rounded-xl", "border", "border-[#A6DDD0]"])}
                    style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                    }}>
                    <TextComponent className={twMerge(["font-semibold", "text-[#5C9587]"])}>
                        수정
                    </TextComponent>
                </Pressable>
            </View>

            {isSmall ? (
                <>
                    {/* 작은 화면 */}

                    <View className={twMerge(["items-center", "mt-2", "mb-8"])}>{renderImage()}</View>

                    <View>
                        <InfoRow label="이름" value={pet.name} />
                        <InfoRow
                            label="생년월일"
                            value={pet.birthdate ? pet.birthdate.slice(0, 10) : "-"}
                        />
                        <InfoRow label="성별" value={pet.gender === "MALE" ? "수컷" : "암컷"} />
                        <InfoRow label="종" value={pet.species || "-"} />
                        <InfoRow label="품종" value={pet.breed || "-"} />
                        <InfoRow label="중성화" value={pet.neutered ? "완료" : "미완료"} />
                    </View>
                </>
            ) : (
                <>
                    {/* 큰 화면 */}

                    <View className={twMerge(["flex-row", "items-center"])}>
                        {renderImage()}

                        <View className={twMerge(["flex-1", "ml-8"])}>
                            <InfoRow label="이름" value={pet.name} />
                            <InfoRow
                                label="생년월일"
                                value={pet.birthdate ? pet.birthdate.slice(0, 10) : "-"}
                            />
                            <InfoRow label="성별" value={pet.gender === "MALE" ? "수컷" : "암컷"} />
                            <InfoRow label="종" value={pet.species || "-"} />
                            <InfoRow label="품종" value={pet.breed || "-"} />
                            <InfoRow label="중성화" value={pet.neutered ? "완료" : "미완료"} />
                        </View>
                    </View>
                </>
            )}
        </Card>
    );
}
