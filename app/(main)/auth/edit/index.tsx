import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { UpdateUserInputType, updateUserSchema } from "@/schemas/user/updateUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";
import { useEffect } from "react";

function MyInfoEditPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserInputType>({
        resolver: zodResolver(updateUserSchema),
        mode: "onTouched",
        defaultValues: {
            nickname: "",
            birthdate: "",
        },
    });

    useEffect(() => {
        if (user) {
            let formattedBirthdate = "";
            if (user.birthdate) {
                formattedBirthdate = user.birthdate.substring(0, 10).replace(/-/g, "");
            } else {
                formattedBirthdate = "";
            }
            reset({
                nickname: user.nickname,
                birthdate: formattedBirthdate,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UpdateUserInputType) => {
        try {
            const { nickname, birthdate } = data;
            let formattedBirthdate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);

                formattedBirthdate = `${year}-${month}-${day}T00:00:00Z`;
            } else {
                formattedBirthdate = undefined;
            }

            const result = await userApi.updateUser({ nickname, birthdate: formattedBirthdate });
            useAuthStore.setState({ user: result });

            if (Platform.OS === "web") {
                alert("회원정보가 성공적으로 수정되었습니다.");
                router.push("/my");
            } else {
                Alert.alert("수정 완료", "회원정보가 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.push("/my") },
                ]);
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 409) {
                    if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
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
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <Title
                        title={"회원정보 수정"}
                        showBackButton={true}
                        onBackPress={() => router.push("/my")}
                    />
                    <TextComponent
                        className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                        나의 정보를 변경합니다.
                    </TextComponent>
                    <FormContainer>
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
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.nickname?.message}
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
                                수정하기
                            </Button>
                            <Button
                                variant={"outlined"}
                                wrap={true}
                                onPress={() => router.push("/my")}>
                                수정취소
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default MyInfoEditPage;
