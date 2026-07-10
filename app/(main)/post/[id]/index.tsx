import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useCallback, useEffect, useState } from "react";
import { Post, PostListItemType } from "@/types/post";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import postApi from "@/api/user/postApi";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/button/Button";

function CommunityPostDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const { user } = useAuthStore();

    const [post, setPost] = useState<PostListItemType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadPost = useCallback(async () => {
        try {
            const result = await postApi.getPostById(postId);
            setPost(result);
        } catch (error) {
            console.log(error);
            const msg = "게시글 정보를 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg, [{ text: "확인", onPress: () => router.back() }]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [postId, router]);

    useEffect(() => {
        loadPost().then(() => {});
    }, [loadPost]);

    // const isAuthor = post?.user.id === user?.id;

    if (isLoading || !post) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge(["flex-1", "bg-background-default"])}>
            <Title
                title={"커뮤니티 내용"}
                showBackButton={true}
                onBackPress={() => router.push("/community-posts")}
                className={"bg-background-paper"}
            />
            <ScrollView>
                <ContentContainer className={"p-0"}>
                    <View className={twMerge(["p-6"])}>
                        <Card>
                            <TextComponent
                                className={twMerge(
                                    ["text-text-default"],
                                    ["pb-4", "px-4"],
                                    ["text-xl", "font-bold"],
                                )}>
                                {post.title}
                            </TextComponent>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "border-b",
                                    "border-divider",
                                    "items-center",
                                    "pb-2",
                                    "px-4",
                                ])}>
                                <View
                                    className={twMerge([
                                        "flex-row",
                                        "items-center",
                                        "gap-1",
                                        "py-2",
                                    ])}>
                                    <View
                                        className={twMerge([
                                            "flex-row",
                                            "w-6",
                                            "h-6",
                                            "rounded-full",
                                            "bg-success-main",
                                            "items-center",
                                            "justify-center",
                                        ])}>
                                        <Feather name={"user"} size={14} />
                                    </View>

                                    <TextComponent
                                        className={twMerge(["text-sm", "pr-3", "font-bold"])}>
                                        {post.user.nickname}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge([
                                            "text-xs",
                                            "text-text-secondary",
                                            "pr-3",
                                        ])}>
                                        {post.createdAt.substring(0, 10)}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(["text-xs", "text-text-secondary"])}>
                                        조회 : {post.views}
                                    </TextComponent>
                                </View>
                            </View>

                            <View className={twMerge(["p-4"])}>
                                <TextComponent
                                    className={twMerge(["text-lg", "text-text-default"])}>
                                    {post.content}
                                </TextComponent>
                            </View>
                        </Card>
                    </View>
                </ContentContainer>
                <View className={twMerge(["flex-row"])}>
                    <Button>목록으로</Button>
                    <Button>수정</Button>
                    <Button>삭제</Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default CommunityPostDetailPage;
