import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import { useLocalSearchParams, useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { useCallback, useEffect, useState } from "react";
import postApi from "@/api/user/postApi";
import Button from "@/components/common/button/Button";
import { Feather } from "@expo/vector-icons";
import { PostListItemType } from "@/types/post";
import Pagination from "@/components/common/pagination/Pagination";
import PostPageHeader from "@/components/layouts/main/PostPageHeader";
import MainFooter from "@/components/layouts/main/MainFooter";
import ContentContainer from "@/components/layouts/common/ContentContainer";

function CommunityPostListPage() {
    const router = useRouter();
    const { page, size } = useLocalSearchParams<{ id: string; page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

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
        <View className={twMerge(["flex-1", "bg-background-default"])}>
            <PostPageHeader />

            <ContentContainer className={"overflow-hidden flex-1 pt-0"}>
                <ScrollView className={"flex-1"}>
                    <View className={twMerge(["overflow-hidden", "flex-1", "pt-[25px]"])}>
                        <View
                            className={twMerge(
                                ["hidden", "md:flex"],
                                ["flex-row", "items-center", "px-4", "py-3"],
                                [
                                    "border-b",
                                    "border-divider",
                                    "bg-background-light",
                                    "rounded-t-xl",
                                ],
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
                        <View>
                            {isLoading && (
                                <View className={"py-20"}>
                                    <LoadingIndicator />
                                </View>
                            )}
                            {!isLoading && list.length === 0 && (
                                <View
                                    className={twMerge([
                                        "py-20",
                                        "justify-center",
                                        "items-center",
                                    ])}>
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
                                            ["transition-colors", "hover:bg-background-light"],
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
                                        <TouchableOpacity
                                            className={twMerge(
                                                ["flex-1", "flex-row", "items-center", "gap-2"],
                                                ["md:px-2", "mb-1.5", "md:mb-0"],
                                            )}
                                            disabled={isLoading}
                                            activeOpacity={0.6}
                                            hitSlop={10}
                                            onPress={() => router.push(`/post/${item.id}`)}>
                                            <TextComponent
                                                className={twMerge(
                                                    [
                                                        "font-bold",
                                                        "transition-all",
                                                        "hover:text-primary-main",
                                                    ],
                                                    ["pb-2", "md:pb-0"],
                                                )}
                                                numberOfLines={1}>
                                                {item.title}
                                            </TextComponent>
                                        </TouchableOpacity>

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
                </ScrollView>
                <Button
                    color={"error"}
                    isFloating
                    isCircle
                    onPress={() => router.push("/post/create")}>
                    <Feather name={"plus"} size={22} />
                </Button>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPage}
                        onPageChange={newPage =>
                            router.setParams({ page: String(newPage), size: String(pageSize) })
                        }
                    />
            </ContentContainer>
            <MainFooter />
        </View>
    );
}

export default CommunityPostListPage;
