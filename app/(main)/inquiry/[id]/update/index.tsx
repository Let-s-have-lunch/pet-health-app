import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InquiryInputType, inquirySchema } from "@/schemas/inquiry/inquirySchema";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import inquiryApi from "@/api/user/inquiryApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import FormContainer from "@/components/layouts/common/FormContainer";
import ErrorMessage from "@/components/common/label/ErrorMessage";

function MyInquiryUpdatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(inquirySchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await inquiryApi.getMyInquiryById(inquiryId);
                reset({
                    ...result,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("문의글을 불러오는 중에 오류가 발생했습니다.");
                    router.push(`/inquiry/${id}`);
                } else {
                    Alert.alert("오류", "문의글을 불러오는 중에 오류가 발생했습니다.", [
                        { text: "확인", onPress: () => router.push(`/inquiry/${id}`) },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadData().then(() => {});
    }, [id, inquiryId, reset, router]);

    const onSubmit = async (input: InquiryInputType) => {
        try {
            await inquiryApi.updateInquiry(inquiryId, input);
            if (Platform.OS === "web") {
                alert("문의글이 성공적으로 수정 되었습니다.");
                router.push(`/inquiry/${id}`);
            } else {
                Alert.alert("완료", "문의글이 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.push(`/inquiry/${id}`) },
                ]);
            }
        } catch (error) {
            console.log(error);
            setError("root", { message: "문의글 수정에 실패했습니다." });
        }
    }

    if (isLoading) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <Title
                title={"문의글 수정"}
                showBackButton={true}
                onBackPress={() => router.push("/inquiry")}
            />
            <ContentContainer className={"bg-transparent p-0"}>
                <FormContainer>
                    <Controller
                        control={control}
                        name={"title"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"title"}
                                    label={"제목"}
                                    placeholder={"변경할 제목을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.title?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"content"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextareaGroup
                                    id={"content"}
                                    label={"내용"}
                                    placeholder={"변경할 상세 내용을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.content?.message}
                                />
                            );
                        }}
                    />

                    {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}

                    <View className={"md:flex-row mt-9 gap-3"}>
                        <Button
                            wrap={true}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            {isSubmitting ? "수정중" : "수정"}
                        </Button>
                        <Button
                            variant={"outlined"}
                            wrap={true}
                            onPress={() => router.push(`/inquiry/${id}`)}>
                            취소
                        </Button>
                    </View>
                </FormContainer>
            </ContentContainer>
        </KeyboardAvoidingView>
    );
}

export default MyInquiryUpdatePage;