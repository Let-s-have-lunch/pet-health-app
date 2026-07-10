import AddPetCard from "./AddPetCard";
import PetCarousel from "./PetCarousel";
import { Pet } from "@/types/pet";

type Props = {
    pets: Pet[];
    isLoggedIn: boolean;
    onPressAdd: () => void;
};

export default function PetCardSection({ pets, isLoggedIn, onPressAdd }: Props) {
    if (!isLoggedIn) {
        return <AddPetCard onPress={onPressAdd} />;
    }

    return <PetCarousel pets={pets} onPressAdd={onPressAdd} />;
}
