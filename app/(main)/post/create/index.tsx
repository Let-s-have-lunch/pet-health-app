import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { PostInputType, postSchema } from "@/schemas/post/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import postApi from "@/api/user/postApi";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useEffect } from "react";

function CreateCommunityPostPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        if (!isLoggedIn) {
            const msg = "로그인이 필요한 서비스입니다.";
            if (Platform.OS === "web") {
                alert(msg);
                router.replace("/auth/login");
            } else {
                Alert.alert("안내", msg, [
                    { text: "확인", onPress: () => router.replace("/auth/login") },
                ]);
            }
        }
    }, [isLoggedIn, router]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostInputType>({
        resolver: zodResolver(postSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const onSubmit = async (data: PostInputType) => {
        if (!isLoggedIn) return;
        try {
            const result = await postApi.createPost(data);
            router.replace(`/post/${result.id}`);
        } catch (error) {
            console.log(error);
            const msg = "게시글 작성에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };
    if (!isLoggedIn) {
        return null;
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <Title title={"등록"} showBackButton={true} onBackPress={() => router.push("/post")} />
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <TextComponent
                        className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                        내용을 작성해주세요
                    </TextComponent>
                    <FormContainer>
                        <Controller
                            control={control}
                            name={"title"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        id={"title"}
                                        label={"제목"}
                                        placeholder={"제목을 입력해주세요"}
                                        autoCapitalize={"none"}
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
                                        placeholder={"자유롭게 작성해주세요."}
                                        autoCapitalize={"none"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.content?.message}
                                    />
                                );
                            }}
                        />

                        <View className={twMerge(["flex-row", "gap-2", "justify-end"])}>
                            <Button
                                className={twMerge(["min-w-20", "flex-1", "md:flex-none"])}
                                variant={"outlined"}
                                size={"small"}
                                onPress={() => router.push("/post")}>
                                취소
                            </Button>
                            <Button
                                className={twMerge(["min-w-20", "flex-1", "md:flex-none"])}
                                size={"small"}
                                variant={"contained"}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {isSubmitting ? "등록 중..." : "등록"}
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default CreateCommunityPostPage;