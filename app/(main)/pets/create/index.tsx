import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Alert,
    Modal,
    Pressable,
} from "react-native";

import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import petApi from "@/api/user/petApi";
import { RegisterPetInputType, registerPetSchema } from "@/schemas/user/pet/registerPetSchema";
import TextComponent from "@/components/common/text/TextComponent";
import { useEffect, useState } from "react";

function PetCreatePage() {
    const router = useRouter();
    const { petId } = useLocalSearchParams<{ petId: string }>();

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterPetInputType>({
        resolver: zodResolver(registerPetSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            species: "",
            breed: "",
            birthdate: "",
            gender: "MALE",
            neutered: false,
            registrationNumber: "",
            profileImage: "",
        },
    });

    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [neuteredModalVisible, setNeuteredModalVisible] = useState(false);

    useEffect(() => {
        if (!petId) return;

        const loadPet = async () => {
            try {
                const pet = await petApi.getPet(Number(petId));

                reset({
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed ?? "",
                    birthdate: pet.birthdate ? pet.birthdate.slice(0, 10).replaceAll("-", "") : "",
                    gender: pet.gender,
                    neutered: pet.neutered,
                    registrationNumber: pet.registrationNumber ?? "",
                    profileImage: pet.profileImage ?? "",
                });
            } catch (error) {
                console.log(error);
            }
        };
        loadPet().then(() => {});
    }, [petId, reset]);

    const onSubmit = async (data: RegisterPetInputType) => {
        try {
            const payload = {
                ...data,
                birthdate: data.birthdate
                    ? `${data.birthdate.slice(0, 4)}-${data.birthdate.slice(4, 6)}-${data.birthdate.slice(6, 8)}`
                    : undefined,
                registrationNumber:
                    (data.registrationNumber ?? "").trim() === ""
                        ? undefined
                        : data.registrationNumber,
                profileImage:
                    (data.profileImage ?? "").trim() === "" ? undefined : data.profileImage,
            };

            if (petId) {
                await petApi.updatePet(Number(petId), payload);
            } else {
                await petApi.registerPet(payload);
            }

            router.replace("/");
        } catch (error: any) {
            console.log(error.response?.status);
            console.log(error.response?.data);
            console.log(error.response?.data?.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <Title title="반려동물 등록" showBackButton onBackPress={() => router.replace("/")} />

            <ScrollView>
                <ContentContainer className="bg-transparent p-0">
                    <FormContainer>
                        <View className="items-center mb-6">
                            <View className="w-32 h-32 rounded-xl bg-gray-200 justify-center items-center">
                                <TextComponent>사진 등록</TextComponent>
                            </View>

                            <Button
                                variant="outlined"
                                size={"small"}
                                textClassName={"font-semibold text-text-default"}
                                className="w-32 h-10 mt-3 border-primary-main"
                                onPress={() => {
                                    // TODO : 이미지 선택
                                }}>
                                사진 선택
                            </Button>

                            {/*TODO: 사진 등록 기능*/}
                        </View>

                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <InputGroup
                                    id="name"
                                    label="이름"
                                    placeholder="이름을 입력해주세요."
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="species"
                            render={({ field }) => (
                                <InputGroup
                                    id="species"
                                    label="동물종"
                                    placeholder="예)강아지, 고양이"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.species?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="breed"
                            render={({ field }) => (
                                <InputGroup
                                    id="breed"
                                    label="품종"
                                    placeholder="품종을 입력해주세요."
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.breed?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="birthdate"
                            render={({ field }) => (
                                <InputGroup
                                    id="birthdate"
                                    label="생년월일"
                                    placeholder="YYYYMMDD"
                                    keyboardType="number-pad"
                                    maxLength={8}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.birthdate?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <Pressable onPress={() => setGenderModalVisible(true)}>
                                    <View pointerEvents={"none"}>
                                        <InputGroup
                                            id="gender"
                                            label="성별"
                                            value={field.value === "MALE" ? "수컷" : "암컷"}
                                            editable={false}
                                            onPress={() => setGenderModalVisible(true)}
                                            errorMessage={errors.gender?.message}
                                        />
                                    </View>
                                </Pressable>
                            )}
                        />
                        <Controller
                            control={control}
                            name="neutered"
                            render={({ field }) => (
                                <Pressable onPress={() => setNeuteredModalVisible(true)}>
                                    <View pointerEvents={"none"}>
                                        <InputGroup
                                            id="neutered"
                                            label="중성화 여부"
                                            value={field.value ? "완료" : "미완료"}
                                            editable={false}
                                            onPress={() => setNeuteredModalVisible(true)}
                                        />
                                    </View>
                                </Pressable>
                            )}
                        />

                        <Controller
                            control={control}
                            name="registrationNumber"
                            render={({ field }) => (
                                <InputGroup
                                    id="registrationNumber"
                                    label="동물등록번호"
                                    placeholder="선택 입력"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.registrationNumber?.message}
                                />
                            )}
                        />
                        {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}

                        <View className="mt-8">
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                textClassName={"font-semibold "}>
                                {petId ? "수정하기" : "등록하기"}
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>

            <Modal visible={genderModalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center white bg-black/40">
                    <View className="w-80 rounded-xl bg-white p-5">
                        <TextComponent className="text-lg font-semibold mb-4">
                            성별 선택
                        </TextComponent>

                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <>
                                    <Button
                                        onPress={() => {
                                            field.onChange("MALE");
                                            setGenderModalVisible(false);
                                        }}>
                                        수컷
                                    </Button>

                                    <View className="h-3" />

                                    <Button
                                        onPress={() => {
                                            field.onChange("FEMALE");
                                            setGenderModalVisible(false);
                                        }}>
                                        암컷
                                    </Button>
                                </>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={neuteredModalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-80 rounded-xl bg-white p-5">
                        <TextComponent className="text-lg font-semibold mb-4">
                            중성화 여부
                        </TextComponent>

                        <Controller
                            control={control}
                            name="neutered"
                            render={({ field }) => (
                                <>
                                    <Button
                                        onPress={() => {
                                            field.onChange(true);
                                            setNeuteredModalVisible(false);
                                        }}>
                                        완료
                                    </Button>

                                    <View className="h-3" />

                                    <Button
                                        onPress={() => {
                                            field.onChange(false);
                                            setNeuteredModalVisible(false);
                                        }}>
                                        미완료
                                    </Button>
                                </>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

export default PetCreatePage;
