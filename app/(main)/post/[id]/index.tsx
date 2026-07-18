import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useCallback, useEffect, useState } from "react";
import { PostListItemType } from "@/types/post";
import { Alert, Platform, ScrollView, View, TouchableOpacity } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import postApi from "@/api/user/postApi";
import replyApi from "@/api/user/replyApi";
import Button from "@/components/common/button/Button";
import { Ionicons } from "@expo/vector-icons";
import CommunityPostDetailReply from "@/components/domain/post/CommunityPostDetailReply";

function CommunityPostDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const { user } = useAuthStore();

    const [post, setPost] = useState<PostListItemType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [replyCount, setReplyCount] = useState<number>(0);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);

    const loadPostData = useCallback(async () => {
        if (!postId || isNaN(postId)) return; // postId가 유효하지 않으면 실행하지 않음

        try {
            setIsLoading(true);

            const postResult = await postApi.getPostById(postId);
            setPost(postResult);

            const replyResult = await replyApi.getRepliesByPostId(postId, 1, 10);

            if (replyResult) {
                setReplyCount(replyResult.total);
            } else {
                setReplyCount(0);
            }
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

    // 컴포넌트가 마운트되거나 postId가 바뀔 때 무조건 데이터를 새로 부릅니다.
    useEffect(() => {
        loadPostData().then(() => {});
    }, [postId, loadPostData]);

    // 모달창이 닫힐 때 하단 바 댓글 개수 동기화
    const handleModalClose = () => {
        setIsReplyModalOpen(false);
        if (postId && !isNaN(postId)) {
            replyApi.getRepliesByPostId(postId, 1, 10).then(res => {
                if (res) setReplyCount(res.total);
            });
        }
    };

    const isAuthor = post?.user.id === user?.id;

    const handleDelete = () => {
        if (replyCount > 0) {
            const blockMsg = "댓글이 있는 게시글은 삭제할 수 없습니다.";
            if (Platform.OS === "web") {
                alert(blockMsg);
            } else {
                Alert.alert("삭제 불가", blockMsg, [{ text: "확인" }]);
            }
            return;
        }

        const title = "게시글 삭제";
        const message = "정말로 이 게시글을 삭제하시겠습니까?";

        if (Platform.OS === "web") {
            const confirmDelete = window.confirm(message);
            if (confirmDelete) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert(title, message, [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    const executeDelete = async () => {
        try {
            setIsLoading(true);
            await postApi.deletePost(postId);
            router.push("/");
        } catch (error) {
            console.log(error);
            const errorMsg = "게시글 삭제에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(errorMsg);
            } else {
                Alert.alert("오류", errorMsg, [{ text: "확인" }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 로딩 중일 때는 로딩 스피너를 보여주어 0이 깜빡거리는 현상을 원천 차단합니다.
    if (isLoading || !post) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge(["flex-1", "bg-background-default"])}>
            <Title
                title={"커뮤니티"}
                showBackButton={true}
                onBackPress={() => router.push("/post")}
                className={"bg-background-paper"}
            />

            <View className="flex-1">
                <ScrollView className="flex-1">
                    <ContentContainer className={"p-0"}>
                        <View className={twMerge(["p-4"])}>
                            <Card shadow={"sm"} className="bg-background-paper">
                                <View>
                                    <TextComponent
                                        className={
                                            "text-text-default text-xl font-bold  mb-1 pb-4"
                                        }>
                                        {post.title}
                                    </TextComponent>
                                    <View className={"flex-row items-center pb-2 justify-between"}>
                                        <View className="flex-row items-center">
                                            <TextComponent
                                                className={
                                                    "text-sm font-semibold text-text-default"
                                                }>
                                                {post.user.nickname}
                                            </TextComponent>
                                        </View>
                                        <View className={"flex-row items-center"}>
                                            <TextComponent
                                                className={"text-sm text-text-secondary"}>
                                                등록 {post.createdAt.substring(0, 10)}
                                            </TextComponent>
                                            <TextComponent
                                                className={
                                                    "text-sm text- px-1.5 text-text-secondary"
                                                }>
                                                |
                                            </TextComponent>
                                            <TextComponent
                                                className={"text-sm text-text-secondary"}>
                                                조회 {post.views}
                                            </TextComponent>
                                        </View>
                                    </View>

                                    <View
                                        className={twMerge([
                                            "py-5",
                                            "min-h-48",
                                            "border-t",
                                            "border-background-default",
                                        ])}>
                                        <TextComponent
                                            className={twMerge([
                                                "text-base",
                                                "text-text-default",
                                                "leading-relaxed",
                                            ])}>
                                            {post.content}
                                        </TextComponent>
                                    </View>
                                </View>

                                <View
                                    className={
                                        "flex-row pt-6 gap-2 justify-end items-center border-t border-divider"
                                    }>
                                    <Button
                                        className={twMerge(
                                            ["flex-1", "md:flex-none"],
                                            ["min-w-20"],
                                        )}
                                        variant={"outlined"}
                                        size={"small"}
                                        onPress={() => router.push("/post")}>
                                        목록
                                    </Button>

                                    {isAuthor && (
                                        <>
                                            <Button
                                                className={twMerge(
                                                    ["flex-1", "md:flex-none"],
                                                    ["min-w-20"],
                                                )}
                                                variant={"contained"}
                                                size={"small"}
                                                color={"error"}
                                                onPress={handleDelete}>
                                                삭제
                                            </Button>
                                            <Button
                                                className={twMerge(
                                                    ["flex-1", "md:flex-none"],
                                                    ["min-w-20"],
                                                )}
                                                variant={"contained"}
                                                size={"small"}
                                                onPress={() =>
                                                    router.push(`/post/${postId}/update`)
                                                }>
                                                수정
                                            </Button>
                                        </>
                                    )}
                                </View>
                            </Card>
                        </View>
                    </ContentContainer>
                </ScrollView>
            </View>

            <View
                className={twMerge(
                    ["w-full", "max-w-7xl", "mx-auto"],
                    ["bg-background-paper border-t border-divider px-5 py-10 pb-6 rounded-t-[30px]"]
                )}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsReplyModalOpen(true)}
                    className="bg-gray rounded-xl p-3.5 flex-row items-center justify-between border border-secondary-main">
                    <View className="flex-row items-center gap-2 text-text-default">
                        <Ionicons name="chatbubble-ellipses-outline" size={18} />
                        <TextComponent className="text-sm font-medium">
                            댓글{" "}
                            <text className={twMerge(["text-success-point"])}>{replyCount}</text>
                        </TextComponent>
                    </View>
                    <Ionicons name="chevron-up" size={16} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <CommunityPostDetailReply
                postId={post.id}
                isOpen={isReplyModalOpen}
                onClose={handleModalClose}
                onTotalChange={setReplyCount}
            />
        </View>
    );
}

export default CommunityPostDetailPage;
