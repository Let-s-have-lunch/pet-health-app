import { useMemo, useRef, useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    useWindowDimensions,
    View,
} from "react-native";

import AddPetCard from "./AddPetCard";
import PetCard from "./PetCard";
import { Pet } from "@/types/pet";

type Props = {
    pets: Pet[];
    onPressAdd: () => void;
};

type CarouselItem =
    | {
    type: "pet";
    pet: Pet;
}
    | {
    type: "add";
};

export default function PetCarousel({
                                        pets,
                                        onPressAdd,
                                    }: Props) {
    const { width } = useWindowDimensions();

    const flatListRef = useRef<FlatList<CarouselItem>>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const CARD_WIDTH = Math.min(width - 32, 600);

    const data = useMemo<CarouselItem[]>(() => {
        const petItems = pets.map((pet) => ({
            type: "pet" as const,
            pet,
        }));

        return [...petItems, { type: "add" as const }];
    }, [pets]);

    const handleMomentumEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        const index = Math.round(
            e.nativeEvent.contentOffset.x / CARD_WIDTH,
        );

        setCurrentIndex(index);
    };

    return (
        <View>

            <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled={false}
                decelerationRate="fast"
                disableIntervalMomentum
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(_, index) => index.toString()}
                onMomentumScrollEnd={handleMomentumEnd}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width,
                            paddingHorizontal: 16,
                        }}
                    >
                        {item.type === "pet" ? (
                            <PetCard
                                pet={item.pet}
                            />
                        ) : (
                            <AddPetCard
                                onPress={onPressAdd}
                            />
                        )}
                    </View>
                )}
            />

            {/* Indicator */}

            <View
                className="flex-row justify-center"
                style={{
                    marginTop: 8,
                    marginBottom: 12,
                }}
            >
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 4,
                            backgroundColor:
                                currentIndex === index
                                    ? "#F8A69B"
                                    : "#D8D8D8",
                        }}
                    />
                ))}
            </View>

        </View>
    );
}