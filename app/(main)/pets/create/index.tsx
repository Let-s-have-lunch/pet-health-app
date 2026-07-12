import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert } from "react-native";

import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import petApi from "@/api/user/petApi";
import { RegisterPetInputType, registerPetSchema } from "@/schemas/user/pet/registerPetSchema";
import TextComponent from "@/components/common/text/TextComponent";

function PetCreatePage() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterPetInputType>({
        resolver: zodResolver(registerPetSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            species: "DOG",
            breed: "",
            birthdate: "",
            gender: "MALE",
            neutered: false,
            registrationNumber: "",
            profileImage: "",
        },
    });

    const onSubmit = async (data: RegisterPetInputType ) => {
        try {
            const payload = {
                ...data,
                birthdate: data.birthdate
                    ? `${data.birthdate.slice(0, 4)}-${data.birthdate.slice(4, 6)}-${data.birthdate.slice(6, 8)}`
                    : undefined,
            };

            console.log("보내는 데이터:", payload);
            await petApi.registerPet(payload);

            Alert.alert("등록 완료", "반려동물이 등록되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            console.log(error.response?.data.errors);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <Title title="반려동물 등록" showBackButton onBackPress={() => router.back()} />

            <ScrollView>
                <ContentContainer className="bg-transparent p-0">
                    <FormContainer>

                        {/* 프로필 이미지 */}
                        <View className="items-center mb-6">
                            <View className="w-32 h-32 rounded-xl bg-gray-200 justify-center items-center">
                                <TextComponent>사진 등록</TextComponent>
                            </View>

                            <Button
                                variant="outlined"
                                className="mt-3"
                                onPress={() => {
                                    // TODO : 이미지 선택
                                }}>
                                사진 선택
                            </Button>
                        </View>

                        {/* 이름 */}
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

                        {/* 동물종 */}
                        <Controller
                            control={control}
                            name="species"
                            render={({ field }) => (
                                <InputGroup
                                    id="species"
                                    label="동물종"
                                    placeholder="DOG 또는 CAT"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.species?.message}
                                />
                            )}
                        />

                        {/* 품종 */}
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

                        {/* 생년월일 */}
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

                        {/* 성별 */}
                        <TextComponent className="mt-5 mb-2 font-medium">성별</TextComponent>

                        {/* TODO : RadioButton으로 교체 */}
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <InputGroup
                                    id="gender"
                                    label="성별"
                                    value={field.value === "MALE" ? "수컷" : "암컷"}
                                    editable={false}
                                    // rightIcon="chevron-down"
                                    // onPress={() => setGenderModalVisible(true)}
                                    errorMessage={errors.gender?.message}
                                />
                            )}
                        />

                        {/* 중성화 */}
                        <TextComponent className="mt-5 mb-2 font-medium">중성화 여부</TextComponent>

                        {/* TODO : Switch 또는 RadioButton으로 교체 */}
                        <Controller
                            control={control}
                            name="neutered"
                            render={({ field }) => (
                                <Button
                                    variant="outlined"
                                    onPress={() => field.onChange(!field.value)}>
                                    {field.value ? "중성화 완료" : "중성화 미완료"}
                                </Button>
                            )}
                        />

                        {/* 등록번호 */}
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
                            <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                                등록하기
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default PetCreatePage;