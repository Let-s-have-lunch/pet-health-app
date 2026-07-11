import AddPetCard from "@/components/pet/AddPetCard";
import { Pet } from "@/types/pet";
import PetCard from "@/components/pet/PetCard";

type Props = {
    isLoggedIn: boolean;
    pets: Pet[];
    onPressAdd: () => void;
};

export default function PetCardSection({ isLoggedIn, pets, onPressAdd }: Props) {
    if (!isLoggedIn) {
        return <AddPetCard onPress={onPressAdd} />;
    }

    if (pets.length === 0) {
        return <AddPetCard onPress={onPressAdd} />;
    }

    return (
        <>
            {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
            ))}

            <AddPetCard onPress={onPressAdd} />
        </>
    );
}
