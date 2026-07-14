import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Image,
    Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

import { vetLogSchema, VetLogFormValues } from "@/schemas/vetLog/vetLogSchema";
import { vetLogApi } from "@/api/user/vetLogApi";
import { usePetStore } from "@/stores/usePetStore";

import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import axiosInstance from "@/api/axiosInstance";

export default function VetLogUpdatePage() {
    const params = useLocalSearchParams();
    const id = params.id;

    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const {
        control,
        handleSubmit,
        reset, // reset 추가
        formState: { errors, isSubmitting },
    } = useForm<VetLogFormValues>({
        resolver: zodResolver(vetLogSchema),
        defaultValues: {
            hospitalName: "",
            visitPurpose: "",
            visitDate: new Date().toISOString().split("T")[0],
            cost: "",
            memo: "",
        },
    });

    const [image, setImage] = useState<string | null>((params.receiptImage as string) || null);

    const loadVetRecord = useCallback(async () => {
        try {
            const result = await vetLogApi.getById(Number(id));
            reset({
                hospitalName: result.hospitalName,
                visitPurpose: result.visitPurpose,
                visitDate: result.visitDate,
                cost: result.cost ? String(result.cost) : "",
                memo: result.memo,
            });
            setImage(result.receiptImage ?? null);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (id) {
            loadVetRecord().then(() => {});
            console.log(image);
        }
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmit = async (data: VetLogFormValues) => {
        try {
            const formData = new FormData();

            // 텍스트 데이터 추가
            formData.append("hospitalName", data.hospitalName);
            formData.append("visitPurpose", data.visitPurpose);
            formData.append("visitDate", data.visitDate);
            formData.append("cost", String(Number(data.cost) || 0));
            formData.append("memo", data.memo || "");

            // 이미지 파일 처리
            if (image && !image.startsWith("http")) {
                if (Platform.OS === "web") {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    formData.append(
                        "image",
                        new File([blob], "receipt.jpg", { type: "image/jpeg" }),
                    );
                } else {
                    formData.append("image", {
                        uri: image,
                        name: "receipt.jpg",
                        type: "image/jpeg",
                    } as any);
                }
            }

            await axiosInstance.put(`/vet-records/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Alert.alert("성공", "기록이 수정되었습니다.", [
                { text: "확인", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            console.error("수정 실패:", error.response?.data || error);
            Alert.alert("오류", "수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <ScrollView>
                <ContentContainer className="bg-transparent p-0">
                    <Title
                        title="병원 기록 수정"
                        showBackButton={true}
                        onBackPress={() => router.back()}
                    />

                    <FormContainer>
                        {/* 이미지 선택 */}
                        <TextComponent className="text-sm mb-2 text-text-primary">
                            반려동물 사진
                        </TextComponent>
                        {image ? (
                            <View className="relative mb-4">
                                <Image
                                    source={{
                                        uri: image.startsWith("/uploads") ? BACKEND_URL + image : image
                                    }}
                                    className="w-full h-48 rounded-lg"
                                />
                                <Pressable
                                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                                    onPress={() => setImage(null)}>
                                    <Ionicons name="close" size={20} color="white" />
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                className="border border-dashed border-divider p-8 rounded-lg mb-4 items-center"
                                onPress={pickImage}>
                                <Ionicons name="camera-outline" size={32} color="#7F8C8D" />
                                <TextComponent className="text-text-secondary mt-2">
                                    사진 선택
                                </TextComponent>
                            </Pressable>
                        )}

                        <Controller
                            control={control}
                            name="hospitalName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="병원 이름"
                                    placeholder="병원 이름을 입력해주세요."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.hospitalName?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="visitPurpose"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="방문 목적"
                                    placeholder="방문 목적을 입력해주세요."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.visitPurpose?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="visitDate"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="방문 날짜"
                                    placeholder="YYYY-MM-DD"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.visitDate?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="cost"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="진료 비용"
                                    placeholder="숫자만 입력"
                                    keyboardType="number-pad"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.cost?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="memo"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="메모"
                                    placeholder="특이사항을 입력해주세요."
                                    multiline
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.memo?.message}
                                />
                            )}
                        />

                        <View className="flex-row gap-3 mt-4">
                            <Button
                                wrap={true}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                수정하기
                            </Button>
                            <Button variant="outlined" wrap={true} onPress={() => router.back()}>
                                취소
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
