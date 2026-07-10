// import PetCard from "@/app/(main)/(tabs)/components/Pet/PetCard";
//
// export default function PetCardSection() {
//     return (
//         <>
//             {pets.map(pet => (
//                 <PetCard key={pet.id} pet={pet} />
//             ))}
//         </>
//     );
// }

import { View } from "react-native";
import AddPetCard from "@/app/(main)/(tabs)/components/Pet/AddPetCard";

type Props = {
    isLoggedIn: boolean;
    onPressAdd: () => void;
};

export default function PetCardSection({ isLoggedIn, onPressAdd }: Props) {
    return (
        <View>
            <View>{/* 등록증 */}</View>
            {!isLoggedIn && <AddPetCard onPress={onPressAdd} />}
        </View>
    );
}
