import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WithdrawUserInputType, withdrawUserSchema } from "@/schemas/user/withdrawUserSchema";
import userApi from "@/api/user/userApi";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";

function MyWithdrawPage() {
    const router = useRouter();
    const { logout } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<WithdrawUserInputType>({
        resolver: zodResolver(withdrawUserSchema),
        mode: "onTouched",
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = async (data: WithdrawUserInputType) => {
        try {
            await userApi.withdrawUser(data);
            logout();

            if (Platform.OS === "web") {
                alert("회원 탈퇴가  완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
                router.replace("/");
            } else {
                Alert.alert(
                    "탈퇴 완료",
                    "회원탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.",
                    [{ text: "확인", onPress: () => router.replace("/") }],
                );
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.message || "서버 요청 중 오류가 발생했습니다.";
                if (error.response.status === 400) {
                    if (errorMessage.includes("비밀번호")) {
                        setError("password", { message: errorMessage });
                        return;
                    }
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <Title
                        title={"회원탈퇴"}
                        showBackButton={true}
                        onBackPress={() => router.back()}
                    />
                    <TextComponent
                        className={twMerge("font-bold", "text-xl", "text-center", "mt-9")}>
                        정말 탈퇴하시겠습니까?
                    </TextComponent>

                    {/* 💡 사용자가 실수하지 않도록 경고 문구를 하나 추가했습니다. */}
                    <TextComponent className="text-center text-gray-500 mt-2 mb-6">
                        탈퇴 시 모든 반려동물 정보와 기록이 삭제되며{"\n"}
                        복구할 수 없습니다. 진행을 위해 비밀번호를 입력해주세요.
                    </TextComponent>

                    <FormContainer>
                        <Controller
                            control={control}
                            name={"password"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
                                        id={"password"}
                                        secureTextEntry={true}
                                        label={"비밀번호"}
                                        placeholder={"비밀번호를 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.password?.message}
                                    />
                                );
                            }}
                        />

                        {errors.root?.message && (
                            <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        <View className={"md:flex-row mt-9 gap-3"}>
                            <Button variant={"outlined"} wrap={true} onPress={() => router.back()}>
                                취소
                            </Button>
                            <Button
                                wrap={true}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                탈퇴하기
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default MyWithdrawPage;