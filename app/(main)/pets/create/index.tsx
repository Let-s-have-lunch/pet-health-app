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
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import petApi from "@/api/user/petApi";
import { RegisterPetInputType, registerPetSchema } from "@/schemas/pet/registerPetSchema";
import TextComponent from "@/components/common/text/TextComponent";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";
import { twMerge } from "tailwind-merge";

// 기존 사진을 보여주기 위해 BASE_URL 추가
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

function PetCreatePage() {
    const router = useRouter();
    const { petId } = useLocalSearchParams<{ petId: string }>();
    const isEditMode = !!petId;

    const {
        control,
        handleSubmit,
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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [image, setImage] = useState<ImagePickerAsset | string | null>(null);

    const handleDelete = async () => {
        if (!petId) return;
        setIsDeleting(true);

        try {
            await petApi.deletePet(Number(petId));
            setDeleteModalVisible(false);
            router.replace("/");
        } catch (error) {
            console.log(error);
            Alert.alert("삭제 실패", "반려동물 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    useEffect(() => {
        if (!petId) return;

        const loadPet = async () => {
            if (!isEditMode) return;

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

                if (pet.profileImage) {
                    setImage(`${BASE_URL}${pet.profileImage}`);
                }
            } catch (error) {
                console.log(error);
            }
        };
        loadPet().then(() => {});
    }, [isEditMode, petId, reset]);

    const onSubmit = async (data: RegisterPetInputType) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("species", data.species);
            formData.append("gender", data.gender);
            formData.append("neutered", String(data.neutered));

            if (data.breed) {
                formData.append("breed", data.breed);
            }

            if (data.birthdate) {
                formData.append(
                    "birthdate",
                    `${data.birthdate.slice(0, 4)}-${data.birthdate.slice(4, 6)}-${data.birthdate.slice(6, 8)}`,
                );
            }

            if (data.registrationNumber?.trim()) {
                formData.append("registrationNumber", data.registrationNumber);
            }

            if (image && typeof image !== "string") {
                if (Platform.OS === "web") {
                    if (image.file) {
                        console.log(image.file);
                        formData.append("profileImage", image.file);
                    }
                } else {
                    formData.append("profileImage", {
                        uri: image.uri,
                        name: image.fileName ?? "pet.jpg",
                        type: image.mimeType ?? "image/jpeg",
                    } as any);
                }
            }

            console.log("여기까지 옴");
            if (isEditMode) {
                await petApi.updatePet(Number(petId), formData);
            } else {
                await petApi.registerPet(formData);
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
            <Title
                title={isEditMode ? "반려동물 수정" : "반려동물 등록"}
                showBackButton
                onBackPress={() => router.replace("/")}
            />

            <ScrollView>
                <ContentContainer className="bg-transparent p-0">
                    <FormContainer>
                        <View className="mb-8 mt-2">
                            <TextComponent className="text-[18px] font-bold mb-3">
                                반려동물 사진
                            </TextComponent>

                            <Pressable
                                onPress={handlePickImage}
                                className={twMerge(
                                    ["h-[230px]"],
                                    ["items-center", "justify-center"],
                                    ["rounded-[28px]"],
                                    ["border", "border-dashed", "border-primary-main"],
                                    ["bg-white"],
                                    ["overflow-hidden"],
                                )}>
                                {image ? (
                                    <Image
                                        source={{
                                            uri: typeof image === "string" ? image : image.uri,
                                        }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <>
                                        <Ionicons name="image-outline" size={44} color="#999" />
                                        <TextComponent className="mt-4 text-text-default">
                                            사진 선택
                                        </TextComponent>
                                    </>
                                )}
                            </Pressable>
                        </View>

                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <InputGroup
                                    id="name"
                                    label="이름 *"
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
                            name="birthdate"
                            render={({ field }) => (
                                <InputGroup
                                    id="birthdate"
                                    label="생년월일"
                                    placeholder="생년월일 예) 20260101"
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
                                            label="성별 *"
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
                            name="species"
                            render={({ field }) => (
                                <InputGroup
                                    id="species"
                                    label="어떤 동물을 키우시나요? *"
                                    placeholder="예)강아지, 고양이, 토끼 등"
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
                                    placeholder="예) 강아지: 푸들"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.breed?.message}
                                />
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
                                            label="중성화 수술은 했나요?"
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
                                    label="인식표가 있다면 번호를 알려주세요"
                                    placeholder="12자리 또는 15자리"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChangeText={field.onChange}
                                    errorMessage={errors.registrationNumber?.message}
                                />
                            )}
                        />
                        {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}

                        <View className="mt-8 flex-row gap-3">
                            {isEditMode && (
                                <Button
                                    variant="outlined"
                                    className="flex-1"
                                    onPress={() => setDeleteModalVisible(true)}>
                                    삭제
                                </Button>
                            )}

                            <Button
                                className="flex-1"
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {isEditMode ? "수정" : "등록"}
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>

            <Modal visible={genderModalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center white bg-black/40">
                    <View className="w-80 rounded-[28px] bg-white p-5">
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
                    <View className="w-80 rounded-[28px] bg-white p-5">
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
            <Modal visible={deleteModalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-80 rounded-2xl bg-white">
                        <View className="px-5 py-4 border-b border-gray-200 flex-row justify-between items-center">
                            <TextComponent className="text-lg font-semibold">
                                반려동물 삭제
                            </TextComponent>

                            <Pressable onPress={() => setDeleteModalVisible(false)}>
                                <TextComponent className="text-xl">✕</TextComponent>
                            </Pressable>
                        </View>

                        <View className="py-10 items-center">
                            <TextComponent className="text-error-point text-center text-[17px]">
                                정말로{"\n"} 삭제하시겠습니까?
                            </TextComponent>
                        </View>

                        <View className="flex-row gap-3 px-5 pb-5">
                            <Button
                                variant="outlined"
                                className="flex-1"
                                onPress={() => setDeleteModalVisible(false)}>
                                취소
                            </Button>

                            <Button
                                variant="contained"
                                className="flex-1 bg-error-main border-none"
                                onPress={handleDelete}
                                disabled={isDeleting}>
                                삭제
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

export default PetCreatePage;
