import AddPetCard from "@/app/(main)/(tabs)/components/Pet/AddPetCard";
import { Text } from "react-native";

type Props = {
    isLoggedIn: boolean;
    onPressAdd: () => void;
};

export default function PetCardSection({ isLoggedIn, onPressAdd }: Props) {
    if (!isLoggedIn) {
        return (
            <>
                <AddPetCard onPress={onPressAdd} />
            </>
        );
    }

    return (

            <Text>아</Text>

    );
}
