import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterPetInputType, registerPetSchema } from "@/schemas/user/pet/registerPetSchema";
import petApi from "@/api/user/petApi";
import { Alert } from "react-native";
import { isAxiosError } from "axios";

function PetCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerPetSchema),
        mode: "onTouched",
        defaultValues: {
            species: "",
            breed: "",
            name: "",
            profileImage: "",
            birthdate: "",
            registrationNumber: "",
            gender: "",
            neutered: true,
        },
    });

    const onSubmit = async (data: RegisterPetInputType) => {
        try {
            const pet: RegisterPetInputType = data;

            const formattedDate =
                data.birthdate && data.birthdate !== ""
                    ? data.birthdate.slice(0, 4) +
                      "-" +
                      data.birthdate.slice(4, 6) +
                      "-" +
                      data.birthdate.slice(6, 8)
                    : undefined;

            await petApi.registerPet(pet);

            Alert.alert("반려동물이 등록되었습니다.");
        } catch (error) {
            console.log(error);
            let errorMessage = "반려동물 등록 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };
}

export default PetCreatePage;
