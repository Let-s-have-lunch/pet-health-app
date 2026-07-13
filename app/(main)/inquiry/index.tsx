import { InquiryUserItemType } from "@/types/inquiry";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/common/pagination/Pagination";
import Badge from "@/components/common/badge/Badge";
import inquiryApi from "@/api/user/inquiryApi";

function MyInquiryListPage() {
    const router = useRouter();
    const [list, setList] = useState<InquiryUserItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;
    const [total, setTotal] = useState(0);

    const loadInquiries = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                const result = await inquiryApi.fetchMyInquiryList(targetPage, targetSize);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("1:1 문의 목록을 불러오는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "1:1 문의 목록을 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        loadInquiries(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize, loadInquiries]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    if (isLoading) {
        return (
            <View className={"flex-1"}>
                <LoadingIndicator fullScreen={true} />
            </View>
        );
    }

    return (
        <View className={"flex-1 bg-background-default"}>
            <Title
                title="나의 1:1 문의 게시판"
                showBackButton={true}
                onBackPress={() => router.push("/my")}
                className={"bg-background-paper"}>
                <Button
                    size={"small"}
                    variant={"contained"}
                    onPress={() => router.push("/inquiry/create")}
                    className={"bg-primary-main"}>
                    + 문의글 등록
                </Button>
            </Title>

            <ContentContainer className={"overflow-hidden flex-1"}>
                <View
                    className={twMerge(
                        ["hidden", "md:flex"],
                        ["flex-row", "items-center", "px-4", "py-3"],
                        [
                            "border-divider",
                            "border-b",
                            "bg-background-default",
                            "border-divider",
                            "rounded-t-xl",
                        ],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2", ""],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        답변
                    </TextComponent>
                </View>

                <ScrollView className={"flex-1"}>
                    {isLoading && (
                        <View className={"py-20"}>
                            <LoadingIndicator />
                        </View>
                    )}
                    {list.length === 0 && (
                        <View className={twMerge("py-20", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                아직 작성된 문의글이 없습니다.
                            </TextComponent>
                        </View>
                    )}
                    {list.map((item, index) => (
                        <View
                            key={item.id}
                            className={twMerge(
                                ["my-1", "md:my-0"],
                                "flex-col",
                                "md:flex-row",
                                "md:items-center",
                                "px-4",
                                "py-3",
                                "transition-all",
                                "bg-background-paper",
                                ["border-b", "border-background-default"],
                                ["rounded-xl", "md:rounded-none"],
                                "hover:bg-background-default",
                                index === list.length - 1 && ["md:rounded-b-xl", "border-b-0"],
                            )}>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-12"],
                                    ["text-center", "text-text-secondary"],
                                )}>
                                {item.id}
                            </TextComponent>
                            <Pressable
                                className={twMerge("flex-1", "justify-center", "px-2")}
                                onPress={() => router.push(`/inquiry/${item.id}`)}>
                                <TextComponent
                                    className={twMerge([
                                        "font-medium",
                                        "transition-all",
                                        "hover:text-primary-main",
                                        ["pb-2", "md:pb-0"],
                                    ])}
                                    numberOfLines={1}>
                                    {item.title}
                                </TextComponent>
                            </Pressable>
                            <View
                                className={twMerge(
                                    "flex-row",
                                    "items-center",
                                    "justify-between",
                                )}>
                                <TextComponent
                                    className={twMerge("w-24", [
                                        "text-sm",
                                        "text-text-secondary",
                                        "text-center",
                                    ])}>
                                    {item.createdAt.substring(0, 10)}
                                </TextComponent>
                                <TextComponent
                                    className={twMerge("w-24", [
                                        "text-sm",
                                        "text-text-secondary",
                                        "text-center",
                                    ])}>
                                    <Badge color={item.answer ? "success" : "info"}>
                                        {item.answer ? "답변완료" : "답변대기"}
                                    </Badge>
                                </TextComponent>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </ContentContainer>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={newPage =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
            />
        </View>
    );
}

export default MyInquiryListPage;
