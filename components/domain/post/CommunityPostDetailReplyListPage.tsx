import { ReplyListItemType } from "@/types/reply";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { Alert, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/common/pagination/Pagination";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import TextComponent from "@/components/common/text/TextComponent";
import { useState } from "react";
import Button from "@/components/common/button/Button";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import replyApi from "@/api/user/replyApi";

interface Props {
    list: ReplyListItemType[];
    currentPage: number;
    pageSize: number;
    totalPage: number;
    isLoading: boolean;
    onRefresh: () => void;
}

function CommunityPostDetailReplyListPage({
    list,
    currentPage,
    pageSize,
    totalPage,
    isLoading,
    onRefresh,
}: Props) {
    const router = useRouter();

    if (isLoading && list.length === 0) {
        return <LoadingIndicator />;
    }

    return (
        <View className="py-2">
            {list.map((reply, index) => (
                <ReplyItem
                    key={reply.id || index}
                    item={reply}
                    onRefresh={onRefresh}
                    isLast={index === list.length - 1}
                />
            ))}

            {totalPage > 1 && (
                <View className="py-4 mt-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPage}
                        onPageChange={newPage => {
                            router.setParams({
                                page: String(newPage),
                                size: String(pageSize),
                            });
                        }}
                    />
                </View>
            )}
        </View>
    );
}

export default CommunityPostDetailReplyListPage;

interface ReplyItemProps {
    item: ReplyListItemType;
    onRefresh: () => void;
    isLast: boolean;
}

export function ReplyItem({ item, onRefresh, isLast }: ReplyItemProps) {
    const { user } = useAuthStore();
    const isAuthor = item.user.id === user?.id;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(item.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        if (!editContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await replyApi.updateReply(item.id, editContent);
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            const msg = "댓글 수정에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        const title = "댓글 삭제";
        const message = "정말로 이 댓글을 삭제하시겠습니까?";

        if (Platform.OS === "web") {
            if (window.confirm(message)) executeDelete().then(() => {});
        } else {
            Alert.alert(title, message, [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    const executeDelete = async () => {
        try {
            await replyApi.deleteReply(item.id);
            onRefresh();
        } catch (error) {
            console.error(error);
            const msg = "댓글 삭제에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };

    return (
        <View className={twMerge(["py-4"], !isLast && ["border-b", "border-background-default"])}>
            <View className="flex-row justify-between items-center mb-1.5">
                <View className="flex-row items-center gap-2">
                    <TextComponent className="font-semibold text-sm text-text-secondary">
                        {item.user.nickname}
                    </TextComponent>
                    <TextComponent className="text-xs text-text-secondary">
                        {item.createdAt.substring(0, 10)}
                    </TextComponent>
                </View>

                {isAuthor && !isEditing && (
                    <View className="flex-row gap-1.5">
                        <Button
                            className={"border-error-main"}
                            textColor={"text-error-point"}
                            variant={"outlined"}
                            size={"mini"}
                            color={"error"}
                            onPress={handleDelete}>
                            삭제
                        </Button>
                        <Button
                            className={"border-success-main"}
                            textColor={"text-success-point"}
                            variant={"outlined"}
                            size={"mini"}
                            onPress={() => setIsEditing(true)}>
                            수정
                        </Button>
                    </View>
                )}
            </View>

            {isEditing ? (
                <View className="mt-2">
                    <TextareaGroup
                        value={editContent}
                        onChangeText={setEditContent}
                        placeholder="수정할 내용을 입력하세요"
                        textInputClassName="min-h-[60px] bg-white border border-gray-200 rounded-xl p-2.5 text-sm"
                    />
                    <View className="flex-row justify-end gap-2 mt-2">
                        <Button
                            variant={"outlined"}
                            size={"mini"}
                            onPress={() => setIsEditing(false)}>
                            취소
                        </Button>
                        <Button
                            variant={"outlined"}
                            size={"mini"}
                            className={"border-success-main"}
                            textColor={"text-success-point"}
                            disabled={isSubmitting}
                            onPress={handleUpdate}>
                            {isSubmitting ? "저장 중.." : "저장"}
                        </Button>
                    </View>
                </View>
            ) : (
                <TextComponent className="text-sm text-gray-700 leading-5 px-0.5">
                    {item.content}
                </TextComponent>
            )}
        </View>
    );
}
