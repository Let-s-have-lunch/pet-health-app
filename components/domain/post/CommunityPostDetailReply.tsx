import { useCallback, useEffect, useState } from "react";
import { ReplyListItemType } from "@/types/reply";
import replyApi from "@/api/user/replyApi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyInputType, replySchema } from "@/schemas/reply/replySchema";
import {
    Alert,
    Platform,
    View,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";

import { ReplyItem } from "./CommunityPostDetailReplyListPage";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";

interface Props {
    postId: number;
    isOpen: boolean;
    onClose: () => void;
    onTotalChange?: (total: number) => void;
}

function CommunityPostDetailReply({ postId, isOpen, onClose, onTotalChange }: Props) {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();
    const [list, setList] = useState<ReplyListItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 15;

    const loadFirstReplies = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await replyApi.getRepliesByPostId(postId, 1, pageSize);
            setList(result.list);
            setTotal(result.total);
            setPage(1);
            setHasMore(result.list.length < result.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    const loadMoreReplies = async () => {
        if (isFetchingMore || !hasMore) return;

        try {
            setIsFetchingMore(true);
            const nextPage = page + 1;
            const result = await replyApi.getRepliesByPostId(postId, nextPage, pageSize);

            if (result.list && result.list.length > 0) {
                setList(prev => [...prev, ...result.list]);
                setPage(nextPage);
                setHasMore(list.length + result.list.length < result.total);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("추가 댓글 로드 실패:", error);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadFirstReplies().then(() => {});
        }
    }, [isOpen, loadFirstReplies]);

    useEffect(() => {
        if (!isLoading && onTotalChange) {
            onTotalChange(total);
        }
    }, [total, isLoading, onTotalChange]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(replySchema),
        mode: "onTouched",
        defaultValues: {
            content: "",
        },
    });

    const handleRequireLogin = () => {
        onClose();

        setTimeout(() => {
            if (Platform.OS === "web") {
                window.alert("로그인 후 댓글을 남길 수 있습니다.");
                router.push("/auth/login");
            } else {
                Alert.alert("알림", "로그인 후 댓글을 남길 수 있습니다.", [
                    { text: "취소", style: "cancel" },
                    { text: "로그인하기", onPress: () => router.push("/auth/login") },
                ]);
            }
        }, 100);
    };

    const onSubmit = async (data: ReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
            await loadFirstReplies();
        } catch (error) {
            console.error(error);
            const msg = "댓글 등록에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View className="flex-1 bg-transparent">
                <TouchableOpacity
                    className="h-[30%] bg-transparent"
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View
                    className={twMerge(
                        ["h-[70%] bg-background-paper rounded-t-[30px] overflow-hidden shadow-2xl"],
                        ["border-t border-divider"],
                        ["mx-auto", "w-full", "max-w-7xl"],
                    )}
                    style={Platform.select({
                        ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: -6 },
                            shadowOpacity: 0.08,
                            shadowRadius: 10,
                        },
                        android: {
                            elevation: 20,
                        },
                    })}>
                    <SafeAreaView className="flex-1" edges={["bottom"]}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            className="flex-1"
                            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onClose}
                                className="w-full items-center pt-3 pb-1 bg-background-paper">
                                <View className="w-12 h-1.5 bg-background-default rounded-full" />
                            </TouchableOpacity>

                            <View className="flex-row items-center justify-between px-5 pt-2 pb-4 border-b border-background-default bg-background-paper">
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons
                                        name="chatbubble-ellipses-outline"
                                        size={20}
                                        color="#1F2937"
                                    />
                                    <TextComponent className="text-base font-semibold text-text-default">
                                        댓글{" "}
                                        <TextComponent className={"text-success-point"}>
                                            {total}
                                        </TextComponent>
                                    </TextComponent>
                                </View>

                                <TouchableOpacity
                                    onPress={onClose}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Ionicons name="close" size={24} color="#4B5563" />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={list}
                                keyExtractor={item => item.id.toString()}
                                contentContainerStyle={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    flexGrow: 1,
                                }}
                                renderItem={({ item, index }) => (
                                    <ReplyItem
                                        item={item}
                                        onRefresh={loadFirstReplies}
                                        isLast={index === list.length - 1}
                                    />
                                )}
                                ListEmptyComponent={
                                    !isLoading ? (
                                        <View className="flex-1 justify-center items-center py-24">
                                            <TextComponent className="text-text-secondary text-base font-semibold text-center leading-6">
                                                댓글이 없습니다.{"\n"}댓글을 작성해주세요
                                            </TextComponent>
                                        </View>
                                    ) : null
                                }
                                onEndReached={loadMoreReplies}
                                onEndReachedThreshold={0.2}
                                ListFooterComponent={
                                    isFetchingMore ? (
                                        <View className="py-4">
                                            <ActivityIndicator size="small" color="#BCCDCB" />
                                        </View>
                                    ) : null
                                }
                            />

                            <View className="p-5 border-t border-background-default bg-background-paper">
                                {isLoggedIn ? (
                                    <>
                                        <Controller
                                            control={control}
                                            name="content"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextareaGroup
                                                    placeholder="타인을 존중하는 바른 말을 사용해주세요"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    errorMessage={errors.content?.message}
                                                    textInputClassName="min-h-[60px] bg-background-paper border border-primary-main rounded-[28px] p-5 text-sm"
                                                />
                                            )}
                                        />

                                        <View className="mt-2.5">
                                            <Button
                                                className="w-full"
                                                variant="contained"
                                                disabled={isSubmitting}
                                                onPress={handleSubmit(onSubmit)}>
                                                {isSubmitting ? "등록 중..." : "등록"}
                                            </Button>
                                        </View>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={handleRequireLogin}
                                        className="min-h-[60px] bg-background-default border border-divider rounded-xl p-3 justify-center">
                                        <TextComponent className="text-sm text-text-secondary">
                                            로그인 후 댓글을 남길 수 있습니다.
                                        </TextComponent>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
}

export default CommunityPostDetailReply;
