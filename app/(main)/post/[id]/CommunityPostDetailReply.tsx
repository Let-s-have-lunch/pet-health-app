import { useCallback, useEffect, useState } from "react";
import { ReplyListItemType } from "@/types/reply";
import { useLocalSearchParams } from "expo-router";
import replyApi from "@/api/user/replyApi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyInputType, replySchema } from "@/schemas/reply/replySchema";
import { Alert, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";

interface Props {
    postId: number,
}

function PostDetailReplyList(props: {
    list: ReplyListItemType[];
    currentPage: number;
    pageSize: number;
    totalPage: number;
    isLoading: boolean;
    onRefresh: () => Promise<void>;
}) {
    return null;
}

function CommunityPostDetailReply({ postId }: Props) {
    const [list, setList] = useState<ReplyListItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size || 10);

    const loadReplies = useCallback(async () => {
        try {
            const result = await replyApi.getRepliesByPostId(postId, currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [postId, currentPage, pageSize]);

    useEffect(() => {
        loadReplies().then(() => {});
    }, [loadReplies]);

    const totalPage = Math.ceil(total / pageSize) || 1;

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

    const onSubmit = async (data: ReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
            loadReplies().then(() => {});
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
        <View className={twMerge(["mt-10", "pt-6"], ["border-t", "border-divider"])}>
            <View className={twMerge(["flex-row", "items-center", "gap-2"], "mb-4")}>
                <Ionicons name={"chatbubble-ellipses-outline"} size={20} colorf={"#1F2937"} />
                <TextComponent className={twMerge(["text-lg", "font-bold"])}>댓글</TextComponent>
            </View>

            <View className={twMerge(["mb-8"])}>
                <Controller
                    control={control}
                    name={"content"}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextareaGroup
                            placeholder={"타인을 존중하는 바른 말을 사용해주세요"}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.content?.message}
                        />
                    )}
                />
                <View className={twMerge(["flex-row", "justify-end", "mt-3"])}>
                    <Button
                        variant={"outlined"}
                        color={"primary"}
                        disabled={isSubmitting}
                        onPress={handleSubmit(onSubmit)}>
                        {isSubmitting ? "댓글 작성 중..." : "댓글작성"}
                    </Button>
                </View>
            </View>

            <PostDetailReplyList
                list={list}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPage={totalPage}
                isLoading={isLoading}
                onRefresh={loadReplies}
            />
        </View>
    );
}

export default CommunityPostDetailReply;