import { useCallback, useEffect, useState } from "react";
import { ReplyListItemType } from "@/types/reply";
import { useLocalSearchParams } from "expo-router";
import replyApi from "@/api/user/replyApi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyInputType, replySchema } from "@/schemas/reply/replySchema";
import { Alert, Platform, View, TouchableOpacity, LayoutAnimation } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";

// 완성한 리스트 컴포넌트 임포트
import CommunityPostDetailReplyListPage from "./CommunityPostDetailReplyListPage";

interface Props {
    postId: number;
    onTotalChange?: (total: number) => void;
}

function CommunityPostDetailReply({ postId, onTotalChange }: Props) {
    const [list, setList] = useState<ReplyListItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 페이지 열었을 때 처음부터 목록은 숨김 처리
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size || 10);

    const loadReplies = useCallback(async () => {
        try {
            setIsLoading(true);
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

    // total 값이 바뀔 때마다 상위 부모 컴포넌트에 댓글 수를 전달
    useEffect(() => {
        if (onTotalChange) {
            onTotalChange(total);
        }
    }, [total, onTotalChange]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    // 접고 펼 때 자연스러운 애니메이션 효과 적용
    const toggleExpand = () => {
        if (Platform.OS !== "web") {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setIsExpanded(!isExpanded);
    };

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
            await loadReplies();
            // 댓글을 새로 등록하면 내용을 바로 확인할 수 있게 목록을 펼쳐줍니다.
            if (!isExpanded) setIsExpanded(true);
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
        <View className={twMerge(["mt-4", "p-6"], ["border-t", "border-divider"])}>
            <View>
                <TextComponent className={twMerge([""])}>
                    댓글
                </TextComponent>
            </View>

            <View className={twMerge(["mb-6"])}>
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
                            textInputClassName={"min-h-2"}
                        />
                    )}
                />

                <View className={twMerge(["w-24"])}>
                    <Button
                        className={twMerge(["flex-1", "rounded-0"])}
                        variant={"contained"}
                        color={"primary"}
                        size={"small"}
                        disabled={isSubmitting}
                        onPress={handleSubmit(onSubmit)}>
                        {isSubmitting ? "댓글 작성 중..." : "댓글작성"}
                    </Button>
                </View>
            </View>

            {!isLoading && total === 0 ? (
                <View
                    className={twMerge([
                        "p-8",
                        "rounded-xl",
                        "border",
                        "border-divider",
                        "justify-center",
                        "items-center",
                        "bg-[#FFFFFF]/30",
                    ])}>
                    <Ionicons
                        name={"chatbox-outline"}
                        size={32}
                        color={"#9CA3AF"}
                        className={"mb-2"}
                    />
                    <TextComponent className={twMerge(["mt-2", "text-text-secondary", "text-sm"])}>
                        아직 등록된 댓글이 없습니다.
                    </TextComponent>
                </View>
            ) : (
                <View className={twMerge(["bg-background-paper", "rounded-xl"])}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={toggleExpand}
                        className={twMerge([
                            "flex-row",
                            "justify-between",
                            "items-center",
                            "py-3",
                            "px-4",
                        ])}>
                        <View className={twMerge(["flex-row", "items-center", "gap-1.5"])}>
                            <TextComponent
                                className={twMerge([
                                    "text-base",
                                    "font-semibold",
                                    "text-text-default",
                                ])}>
                                전체 댓글
                            </TextComponent>
                            <TextComponent
                                className={twMerge([
                                    "text-base",
                                    "font-bold",
                                    "text-primary-main",
                                ])}>
                                {total}
                            </TextComponent>
                        </View>

                        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} />
                    </TouchableOpacity>

                    {isExpanded && (
                        <View className={twMerge(["transition-all", "duration-300"])}>
                            <CommunityPostDetailReplyListPage
                                list={list}
                                currentPage={currentPage}
                                pageSize={pageSize}
                                totalPage={totalPage}
                                isLoading={isLoading}
                                onRefresh={loadReplies}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default CommunityPostDetailReply;