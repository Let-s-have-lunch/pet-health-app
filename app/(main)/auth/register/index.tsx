import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import userApi from "@/api/user/userApi";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import FormContainer from "@/components/layouts/common/FormContainer";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import ContentContainer from "@/components/layouts/common/ContentContainer";

function Register() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched",
        defaultValues: {
            password: "",
            confirmPassword: "",
            nickname: "",
            email: "",
            birthdate: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;

            const formattedDate =
                data.birthdate && data.birthdate !== ""
                    ? data.birthdate.slice(0, 4) +
                      "-" +
                      data.birthdate.slice(4, 6) +
                      "-" +
                      data.birthdate.slice(6, 8)
                    : undefined;

            const payload = {
                ...submitData,
                birthdate: formattedDate,
            };
            await userApi.registerUser(payload);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                // 모바일 환경일 대에는 Alert.alert(제목, 내용, 버튼설정Array) 으로 경고창 출력
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요.", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 409) {
                    if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else if (errorMessage.includes("이메일")) {
                        setError("email", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
                    return;
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <Title title={"회원가입"} showBackButton={true} onBackPress={() => router.push("/")} />
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <TextComponent
                        className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                        멍냥 나라에 오신것을 환영합니다.
                    </TextComponent>
                    <FormContainer>
                        <Controller
                            control={control}
                            name={"email"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
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
                            name={"nickname"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
                                        id={"nickname"}
                                        label={"닉네임"}
                                        placeholder={"닉네임을 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                        value={value}
                                        errorMessage={errors.nickname?.message}
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
                                        size={"small"}
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
                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
                                        id={"confirmPassword"}
                                        secureTextEntry={true}
                                        label={"비밀번호 확인"}
                                        placeholder={"비밀번호를 다시 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.confirmPassword?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"birthdate"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
                                        id={"birthdate"}
                                        label={"생년월일"}
                                        placeholder={"YYYYMMDD"}
                                        keyboardType={"number-pad"}
                                        maxLength={8}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.birthdate?.message}
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
                            <Button
                                wrap={true}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                회원가입
                            </Button>
                            <Button
                                variant={"outlined"}
                                wrap={true}
                                onPress={() => router.push("/auth/login")}>
                                로그인
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Register;
