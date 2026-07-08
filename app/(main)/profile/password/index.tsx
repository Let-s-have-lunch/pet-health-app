import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { UpdatePasswordInputType, updatePasswordSchema } from "@/schemas/user/updatePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import userApi from "@/api/user/userApi";
import { Alert, KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";

function MyPasswordPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onTouched",
        defaultValues: {
            prevPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: UpdatePasswordInputType) => {
        try {
            await userApi.updatePassword(data);

            if (Platform.OS === "web") {
                alert("비밀번호 수정이 완료되었습니다.");
                router.push("/profile");
            } else {
                Alert.alert("수정 완료", "비밀번호가 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.push("/profile") },
                ]);
            }
            reset({
                prevPassword: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 400) {
                    if (errorMessage.includes("비밀번호")) {
                        setError("root", { message: errorMessage });
                        return;
                    }
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
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <Title
                        title={"비밀번호 수정"}
                        showBackButton={true}
                        onBackPress={() => router.back()}
                    />
                    <TextComponent
                        className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                        나의 비밀번호를 변경합니다.
                    </TextComponent>
                    <FormContainer>
                        <Controller
                            control={control}
                            name={"prevPassword"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
                                        id={"prevPassword"}
                                        secureTextEntry={true}
                                        label={"현재 비밀번호"}
                                        placeholder={"현재 비밀번호를 입력하세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.prevPassword?.message}
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
                                        secureTextEntry={true}
                                        label={"변경할 비밀번호"}
                                        placeholder={"변경할 비밀번호를 입력해주세요."}
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
                                        label={"변경할 비밀번호 확인"}
                                        placeholder={"변경할 비밀번호를 다시 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.confirmPassword?.message}
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
                                비밀번호 변경
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default MyPasswordPage;
