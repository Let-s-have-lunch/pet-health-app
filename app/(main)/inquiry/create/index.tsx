import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InquiryInputType, inquirySchema } from "@/schemas/inquiry/inquirySchema";
import inquiryApi from "@/api/user/inquiryApi";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";

function MyInquiryCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(inquirySchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const onSubmit = async (input: InquiryInputType) => {
        try {
            await inquiryApi.createInquiry(input);

            if (Platform.OS === "web") {
                alert("문의글이 성공적으로 등록 되었습니다.");
                router.push("/inquiry");
            } else {
                Alert.alert("완료", "문의글이 성공적으로 등록되었습니다.", [
                    { text: "확인", onPress: () => router.push("/inquiry") },
                ]);
            }
        } catch (error) {
            console.log(error);
            setError("root", { message: "문의글 등록에 실패했습니다." });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <Title
                title={"문의글 등록"}
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
                                    placeholder={"문의글 제목을 입력해주세요."}
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
                                    placeholder={"문의글 상세 내용을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.content?.message}
                                />
                            );
                        }}
                    />

                    <View className={"md:flex-row mt-9 gap-3"}>
                        <Button
                            wrap={true}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            { isSubmitting? "등록중" : "등록"}
                        </Button>
                        <Button
                            variant={"outlined"}
                            wrap={true}
                            onPress={() => router.push("/inquiry")}>
                            취소
                        </Button>
                    </View>
                </FormContainer>
            </ContentContainer>
        </KeyboardAvoidingView>
    );
}

export default MyInquiryCreatePage;
