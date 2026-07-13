import { Pet } from "@/types/pet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    View,
} from "react-native";
import PetCard from "@/components/pet/PetCard";
import AddPetCard from "@/components/pet/AddPetCard";
import { twMerge } from "tailwind-merge";

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

const HORIZONTAL_PADDING = 0;

export default function PetCarousel({ pets, onPressAdd }: Props) {
    const flatListRef = useRef<FlatList<CarouselItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const data = useMemo(() => {
        return [
            ...pets.map(pet => ({
                type: "pet" as const,
                pet,
            })),
            {
                type: "add" as const,
            },
        ];
    }, [pets]);

    const handleLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    const CARD_WIDTH = Math.max(0, containerWidth - HORIZONTAL_PADDING * 2);

    const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        setCurrentIndex(index);
    };

    useEffect(() => {
        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });

        setCurrentIndex(0);
    }, [pets.length]);

    if (CARD_WIDTH === 0) {
        return <View onLayout={handleLayout} />;
    }

    return (
        <View onLayout={handleLayout}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => (item.type === "pet" ? item.pet.id.toString() : "add-card")}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH,
                    offset: CARD_WIDTH * index,
                    index,
                })}
                onMomentumScrollEnd={handleMomentumEnd}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: CARD_WIDTH,
                            marginHorizontal: HORIZONTAL_PADDING,
                        }}>
                        {item.type === "pet" ? (
                            <PetCard pet={item.pet} />
                        ) : (
                            <AddPetCard onPress={onPressAdd} />
                        )}
                    </View>
                )}
            />

            <View className={twMerge(["mt-7"], ["flex-row", "justify-center"])}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: 9,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 4,
                            backgroundColor: currentIndex === index ? "#F8A69B" : "#D8D8D8",
                        }}
                    />
                ))}
            </View>
        </View>
    );
}
