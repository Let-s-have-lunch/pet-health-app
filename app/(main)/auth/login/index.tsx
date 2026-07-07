import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import userApi from "@/api/user/userApi";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { isAxiosError } from "axios";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ContentContainer from "@/components/layouts/common/ContentContainer";


function AuthLoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginUserInputType>({
        resolver: zodResolver(loginUserSchema),
        mode: "onTouched",
        defaultValues: {
            password: "",
            email: "",
        },
    });

    const onSubmit = async (data: LoginUserInputType) => {
        try {
            const result = await userApi.login(data);

            if (result.user && result.token) {
                login(result.user, result.token);
            }

            router.push("/");
        } catch (error) {
            console.log(error);
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <ContentContainer className={"bg-transparent p-0"}>
                <Title title={"로그인"} showBackButton={true} onBackPress={() => router.push("/")} />
                <TextComponent className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                    멍냥 나라에 오신것을 환영합니다.
                </TextComponent>
                <FormContainer>
                    <Controller
                        control={control}
                        name={"email"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"email"}
                                    label={"이메일"}
                                    placeholder={"이메일을 입력해주세요."}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"} /* 첫글자 자동 대문자 전환 */
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"password"}
                                    secureTextEntry={true} // 비밀번호 마스킹 속성
                                    label={"비밀번호"}
                                    placeholder={"6자 이상 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            );
                        }}
                    />

                    <View className={"md:flex-row mt-9 gap-3"}>
                        <Button wrap={true} onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>로그인</Button>
                        <Button
                            variant={"outlined"}
                            wrap={true}
                            onPress={() => router.push("/auth/register")}>
                            회원가입
                        </Button>
                    </View>
                </FormContainer></ContentContainer>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
