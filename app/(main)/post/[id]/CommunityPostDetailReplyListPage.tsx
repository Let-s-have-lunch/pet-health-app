import { ReplyListItemType } from "@/types/reply";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "@/components/common/pagination/Pagination";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import TextComponent from "@/components/common/text/TextComponent";

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
                <View className={twMerge(["justify-center", "items-center"], ["py-18"])}>
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
                    key={index}
                    item={reply}
                    onRefresh={onRefresh}
                    isLast={index === list.length - 1}>
                </ReplyItem>
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

    return <></>;
}