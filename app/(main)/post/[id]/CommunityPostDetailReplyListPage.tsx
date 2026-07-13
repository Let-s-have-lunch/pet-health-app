import { ReplyListItemType } from "@/types/reply";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { Alert, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
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
        <View
            className={twMerge(
                ["bg-background-paper", "p-4"],
                ["rounded-xl", "border", "border-divider"],
            )}>
            {list.length === 0 && (
                <View className={twMerge(["justify-center", "items-center"], ["py-10"])}>
                    <Ionicons
                        name={"chatbox-outline"}
                        size={32}
                        color={"#9CA3AF"}
                        className={"mb-2"}
                    />
                    <TextComponent className={twMerge(["mt-2", "text-text-secondary"])}>
                        아직 등록된 댓글이 없습니다.
                    </TextComponent>
                </View>
            )}

            {list.map((reply, index) => (
                <ReplyItem
                    key={reply.id || index} // 고유 key 권장
                    item={reply}
                    onRefresh={onRefresh}
                    isLast={index === list.length - 1}
                />
            ))}

            {totalPage > 1 && (
                <View className={twMerge(["py-4", "mt-2"])}>
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

function ReplyItem({ item, onRefresh, isLast }: ReplyItemProps) {
    const { user } = useAuthStore();
    const isAuthor = item.user.id === user?.id; // 본인 확인

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(item.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 댓글 수정 처리
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

    // 댓글 삭제 alert 창
    const handleDelete = () => {
        const title = "댓글 삭제";
        const message = "정말로 이 댓글을 삭제하시겠습니까?";

        if (Platform.OS === "web") {
            if (window.confirm(message)) executeDelete().then(() =>{});
        } else {
            Alert.alert(title, message, [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    // 댓글 삭제 실행
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
        <View className={twMerge(["py-4"], !isLast && ["border-b", "border-divider"])}>
            {/* 유저 정보 및 날짜 */}
            <View className={twMerge(["flex-row", "justify-between", "items-center", "mb-2"])}>
                <View className={twMerge(["flex-row", "items-center", "gap-2"])}>
                    <TextComponent className={twMerge(["font-bold", "text-sm"])}>
                        {item.user.nickname}
                    </TextComponent>
                    <TextComponent className={twMerge(["text-xs", "text-text-secondary"])}>
                        {item.createdAt.substring(0, 10)}
                    </TextComponent>
                </View>

                {/* 본인 댓글일 때만 수정/삭제 버튼 노출 */}
                {isAuthor && !isEditing && (
                    <View className={twMerge(["flex-row", "gap-2"])}>
                        <Button variant={"contained"} size="small"  onPress={() => setIsEditing(true)}>
                            수정
                        </Button>
                        <Button variant={"contained"} size="small" color={"error"} onPress={handleDelete}>
                            삭제
                        </Button>
                    </View>
                )}
            </View>

            {/* 댓글 본문 / 수정 모드 분기 */}
            {isEditing ? (
                <View className={twMerge(["mt-2"])}>
                    <TextareaGroup
                        value={editContent}
                        onChangeText={setEditContent}
                        placeholder="수정할 내용을 입력하세요"
                    />
                    <View className={twMerge(["flex-row", "justify-end", "gap-2", "mt-2"])}>
                        <Button variant="outlined" size="small" onPress={() => setIsEditing(false)}>
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={isSubmitting}
                            onPress={handleUpdate}>
                            {isSubmitting ? "저장 중.." : "저장"}
                        </Button>
                    </View>
                </View>
            ) : (
                <TextComponent className={twMerge(["text-base", "text-text-default", "px-1"])}>
                    {item.content}
                </TextComponent>
            )}
        </View>
    );
}
