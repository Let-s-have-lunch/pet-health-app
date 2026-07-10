import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { PostInputType, postSchema } from "@/schemas/post/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import postApi from "@/api/user/postApi";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TextComponent from "@/components/common/text/TextComponent";
import FormContainer from "@/components/layouts/common/FormContainer";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function UpdateCommunityPostPage() {
    const router = useRouter();
    const { id: postId } = useLocalSearchParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PostInputType>({
        resolver: zodResolver(postSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const loadPost = useCallback(async () => {
        if (!postId) return;
        try {
            const result = await postApi.getPostById(Number(postId));
            reset({
                title: result.title,
                content: result.content,
            });
        } catch (error) {
            console.error(error);
            const msg = "게시글 정보를 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg, [{ text: "확인", onPress: () => router.back() }]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [postId, reset, router]);

    useEffect(() => {
        loadPost().then(() => {});
    }, [loadPost])

    const onSubmit = async (data: PostInputType) => {
        try {
            await postApi.updatePost(Number(postId), data);
            router.replace(`/post/${postId}`);
        } catch (error) {
            console.log(error);
            const msg = "게시글 수정에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-paper")}>
            <Title
                title={"수정"}
                showBackButton={true}
                onBackPress={() => router.push(`/post/${postId}`)}
            />
            <ScrollView>
                <ContentContainer className={"bg-transparent p-0"}>
                    <TextComponent
                        className={twMerge("font-medium", "text-xl", "text-center", "mt-9")}>
                        내용을 수정해주세요
                    </TextComponent>
                    <FormContainer>
                        <Controller
                            control={control}
                            name={"title"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        size={"small"}
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
                                        size={"small"}
                                        id={"content"}
                                        label={"내용"}
                                        placeholder={"내용을 수정해주세요"}
                                        autoCapitalize={"none"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.content?.message}
                                    />
                                );
                            }}
                        />

                        <View className={twMerge(["md:flex-row", "mt-9", "gap-3"])}>
                            <Button
                                variant={"outlined"}
                                onPress={() => router.push(`/post/${postId}`)}>
                                취소
                            </Button>
                            <Button
                                variant={"contained"}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {isSubmitting ? "수정 중..." : "수정하기"}
                            </Button>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default UpdateCommunityPostPage;
