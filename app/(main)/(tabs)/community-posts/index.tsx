import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isLoading } from "expo-font";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { useCallback, useEffect, useState } from "react";
import postApi from "@/api/user/postApi";
import Button from "@/components/common/button/Button";
import { Feather, Ionicons } from "@expo/vector-icons";
import { PostListItemType } from "@/types/post";
import Pagination from "@/components/common/pagination/Pagination";

function CommunityPostListPage() {
    const router = useRouter();
    const { id, page, size } = useLocalSearchParams<{ id: string; page: string; size: string }>();
    const categoryId = Number(id);
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const [list, setList] = useState<PostListItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await postApi.getPostList(currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            const msg = "게시글 목록을 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        loadPosts().then(() => {});
    }, [loadPosts]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className={twMerge(["flex-1", "w-full"])}>
            <ScrollView className={twMerge(["flex-1", "w-full"])}>
                <TextComponent className={twMerge(["font-medium", "text-left", "p-4"])}>
                    반려동물의 정보를 같이 공유하는 커뮤니티 입니다.
                </TextComponent>
                <View className={twMerge(["p-0"])}>
                    {/* 제목 줄 */}
                    <View
                        className={twMerge(
                            ["hidden", "md:flex"],
                            ["flex-row", "items-center", "px-4", "py-3"],
                            ["border-b", "border-divider", "bg-[#FFFFFF]/30", "rounded-t-xl"],
                        )}>
                        <TextComponent
                            className={twMerge(
                                ["w-16"],
                                ["text-text-secondary", "font-bold", "text-center"],
                            )}>
                            번호
                        </TextComponent>
                        <TextComponent
                            className={twMerge(
                                ["flex-1", "px-2"],
                                ["text-text-secondary", "font-bold"],
                            )}>
                            제목
                        </TextComponent>
                        <TextComponent
                            className={twMerge(
                                ["w-28"],
                                ["text-text-secondary", "font-bold", "text-center"],
                            )}>
                            작성자
                        </TextComponent>
                        <TextComponent
                            className={twMerge(
                                ["w-20"],
                                ["text-text-secondary", "font-bold", "text-center"],
                            )}>
                            조회수
                        </TextComponent>
                        <TextComponent
                            className={twMerge(
                                ["w-24"],
                                ["text-text-secondary", "font-bold", "text-center"],
                            )}>
                            작성일
                        </TextComponent>
                    </View>
                    {/* 내용 */}
                    <View>
                        {isLoading && (
                            <View className={"py-20"}>
                                <LoadingIndicator />
                            </View>
                        )}
                        {!isLoading && list.length === 0 && (
                            <View className={twMerge(["py-20", "justify-center", "items-center"])}>
                                <TextComponent className={"text-text-secondary"}>
                                    등록된 게시글이 없습니다.
                                </TextComponent>
                            </View>
                        )}
                        {list.map((item, index) => {
                            const isLast = index === list.length - 1;

                            return (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        [
                                            "flex-col",
                                            "md:flex-row",
                                            "md:items-center",
                                            "bg-background-paper",
                                        ],
                                        ["px-4", "py-4", "md:px-4"],
                                        ["my-1", "md:my-0"],
                                        ["transition-colors", "hover:bg-background-default"],
                                        ["border-b", "border-background-default"],
                                        ["rounded-xl", "md:rounded-none"],
                                        isLast && ["md:rounded-b-xl"],
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "justify-center", "w-16"],
                                            ["text-text-secondary"],
                                        )}>
                                        {item.id}
                                    </TextComponent>
                                    <Pressable
                                        className={twMerge(
                                            ["flex-1", "flex-row", "items-center", "gap-2"],
                                            ["md:px-2", "mb-1.5", "md:mb-0"],
                                        )}
                                        onPress={() => router.push(`/post/${item.id}`)}>
                                        <TextComponent
                                            className={twMerge(
                                                [
                                                    "font-medium",
                                                    "hover:text-primary-main",
                                                    "transition-colors",
                                                ],
                                                ["pb-2", "md:pb-0"],
                                            )}
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                    </Pressable>

                                    <View
                                        className={twMerge([
                                            "flex-row",
                                            "items-center",
                                            "gap-2",
                                            "md:gap-0",
                                        ])}>
                                        <TextComponent
                                            className={twMerge(
                                                ["text-xs", "md:text-sm"],
                                                ["text-text-secondary", "md:text-text-default"],
                                                ["md:w-28", "md:text-center"],
                                            )}>
                                            {item.user?.nickname}
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                "md:hidden",
                                                "text-xs",
                                                "text-divider",
                                            )}>
                                            |
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                ["text-xs", "md:text-sm"],
                                                ["text-text-secondary", "md:text-text-default"],
                                                ["md:w-20", "md:text-center"],
                                            )}>
                                            <TextComponent
                                                className={twMerge(
                                                    "md:hidden",
                                                    "text-xs",
                                                    "text-text-secondary",
                                                )}>
                                                조회 :{" "}
                                            </TextComponent>
                                            {item.views}
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                "md:hidden",
                                                "text-xs",
                                                "text-divider",
                                            )}>
                                            |
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                ["text-xs", "md:text-sm"],
                                                ["text-text-secondary", "md:text-text-default"],
                                                ["md:w-24", "md:text-center"],
                                            )}>
                                            {item.createdAt.substring(0, 10)}
                                        </TextComponent>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={newPage =>
                        router.setParams({ page: String(newPage), size: String(pageSize) })
                    }
                />
            </ScrollView>
            <Button
                isFloating
                isCircle
                className={twMerge([
                    "absolute",
                    "bottom-6",
                    "right-6",
                    "z-50",
                    "bg-success-main",
                    "shadow-lg",
                ])}
                onPress={() => router.push("/post/create")}>
                <Feather name={"edit-3"} size={22} className={"text-success-contrast"} />
            </Button>
        </View>
    );
}

export default CommunityPostListPage;
