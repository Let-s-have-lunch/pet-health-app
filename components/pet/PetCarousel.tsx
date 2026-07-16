import { Pet } from "@/types/pet";
import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { FlatList, LayoutChangeEvent, View, ViewToken, Platform } from "react-native";
import PetCard from "@/components/pet/PetCard";
import AddPetCard from "@/components/pet/AddPetCard";
import { twMerge } from "tailwind-merge";
import { router } from "expo-router";
import { usePetStore } from "@/stores/usePetStore";

type Props = { pets: Pet[]; onPressAdd: () => void };
type CarouselItem = { type: "pet"; pet: Pet } | { type: "add" };

const HORIZONTAL_PADDING = 0;

const handleEditPet = (petId: number) => {
    router.push({ pathname: "/pets/create", params: { petId } });
};

export default function PetCarousel({ pets, onPressAdd }: Props) {
    const flatListRef = useRef<FlatList<CarouselItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const setSelectedPet = usePetStore(state => state.setSelectedPet);
    const setIsAddCardSelected = usePetStore(state => state.setIsAddCardSelected);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const firstItem = viewableItems[0];
        if (!firstItem) return;
        const index = firstItem.index ?? 0;
        setCurrentIndex(index);
        const item = data[index];
        if (item?.type === "pet") {
            setSelectedPet(item.pet);
            setIsAddCardSelected(false);
        } else {
            setIsAddCardSelected(true);
        }
    });
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

    const data = useMemo(() => {
        return [...pets.map(pet => ({ type: "pet" as const, pet })), { type: "add" as const }];
    }, [pets]);

    const handleLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    const CARD_WIDTH = Math.max(0, containerWidth - HORIZONTAL_PADDING * 2);

    useEffect(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        setCurrentIndex(0);
    }, [pets.length]);

    const getScrollViewRef = () => {
        return flatListRef.current?.getScrollableNode() as unknown as HTMLDivElement | null;
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (Platform.OS !== "web") return;
        const slider = getScrollViewRef();
        if (!slider) return;

        isDown.current = true;
        slider.style.cursor = "grabbing";

        startX.current = e.pageX - slider.offsetLeft;
        scrollLeft.current = slider.scrollLeft;
    };

    const handleMouseLeaveOrUp = () => {
        if (Platform.OS !== "web") return;
        const slider = getScrollViewRef();
        if (!slider) return;

        if (!isDown.current) return;
        isDown.current = false;
        slider.style.cursor = "grab";

        const currentScroll = slider.scrollLeft;
        const rawIndex = currentScroll / CARD_WIDTH;
        const targetIndex = Math.round(rawIndex);

        flatListRef.current?.scrollToIndex({
            index: Math.max(0, Math.min(targetIndex, data.length - 1)),
            animated: true,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (Platform.OS !== "web" || !isDown.current) return;
        const slider = getScrollViewRef();
        if (!slider) return;

        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        slider.scrollLeft = scrollLeft.current - walk;
    };

    if (CARD_WIDTH === 0) {
        return <View onLayout={handleLayout} />;
    }

    const webContainerProps =
        Platform.OS === "web"
            ? ({
                  onMouseDown: handleMouseDown,
                  onMouseUp: handleMouseLeaveOrUp,
                  onMouseLeave: handleMouseLeaveOrUp,
                  onMouseMove: handleMouseMove,
                  style: { cursor: "grab" },
              } as any)
            : {};

    return (
        <View onLayout={handleLayout} {...webContainerProps}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled={Platform.OS !== "web"}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig.current}
                keyExtractor={item => (item.type === "pet" ? item.pet.id.toString() : "add-card")}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH,
                    offset: CARD_WIDTH * index,
                    index,
                })}
                renderItem={({ item }) => (
                    <View style={{ width: CARD_WIDTH, paddingHorizontal: 4 }}>
                        {item.type === "pet" ? (
                            <PetCard
                                pet={item.pet}
                                onPressEdit={() => handleEditPet(item.pet.id)}
                            />
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
