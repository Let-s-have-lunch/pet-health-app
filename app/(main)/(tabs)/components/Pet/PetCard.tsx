import { Image, View } from "react-native";
import { Pet } from "@/types/pet";
import TextComponent from "@/components/common/text/TextComponent";

type Props = {
    pet: Pet;
};

export default function PetCard({ pet }: Props) {
    return (
        <View className="mx-5 mt-5 rounded-3xl bg-white border border-gray-200 p-5">
            <View className="flex-row items-center">
                {pet.profileImage ? (
                    <Image source={{ uri: pet.profileImage }} className="w-24 h-24 rounded-full" />
                ) : (
                    <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center">
                        <TextComponent>🐶</TextComponent>
                    </View>
                )}

                <View className="ml-5 flex-1">
                    <TextComponent className="text-2xl font-bold">{pet.name}</TextComponent>

                    <TextComponent className="text-gray-500 mt-1">
                        {pet.species === "DOG" ? "강아지" : "고양이"}
                    </TextComponent>

                    {!!pet.breed && (
                        <TextComponent className="text-gray-500">{pet.breed}</TextComponent>
                    )}

                    {!!pet.birthdate && (
                        <TextComponent className="text-gray-500">
                            🎂 {pet.birthdate.slice(0, 10)}
                        </TextComponent>
                    )}
                </View>
            </View>
        </View>
    );
}
