import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Pagination";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Badge from "@/components/common/badge/Badge";

function AdminInquiryListPage() {
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
                const result = await adminInquiryApi.fetchInquiryList(targetPage, targetSize);
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

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"1:1 문의 관리"}
                description={"사용자의 문의글을 관리합니다."}
                className={"mt-[-20px] px-0 mb-6"}
                innerClassName={"px-0"}></Title>

            <Card className={"overflow-hidden p-0"}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        [
                            "border-divider",
                            "border-b",
                            "bg-primary-main",
                            "border-primary-main",
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
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        작성일
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        작성자
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        상태
                    </TextComponent>
                </View>

                <View>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <ScrollView className={"flex-1"}>
                            {list.length === 0 && (
                                <View
                                    className={twMerge("py-10", "justify-center", "items-center")}>
                                    <TextComponent className={"text-text-secondary"}>
                                        등록된 문의글이 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {list.map((item, index) => (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        "flex-row",
                                        "items-center",
                                        "px-4",
                                        "py-3",
                                        "transition-all",
                                        "border-b",
                                        "border-primary-light",
                                        "hover:bg-primary-light",
                                        index === list.length - 1 && ["rounded-b-xl", "border-b-0"],
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
                                        onPress={() => router.push(`/admin/inquiries/${item.id}`)}>
                                        <TextComponent
                                            className={twMerge([
                                                "font-bold",
                                                "transition-all",
                                                "hover:text-success-point",
                                            ])}
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                    </Pressable>
                                    <TextComponent
                                        className={twMerge("w-24", [
                                            "text-sm",
                                            "text-text-secondary",
                                            "text-center",
                                            "hidden",
                                            "md:flex",
                                        ])}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge("w-24", [
                                            "text-sm",
                                            "text-text-secondary",
                                            "text-center",
                                        ])}>
                                        {item.user.nickname}
                                    </TextComponent>
                                    <View
                                        className={twMerge(
                                            "w-24",
                                            "items-center",
                                            "justify-center",
                                            ["text-sm", "text-text-secondary", "text-center"],
                                        )}>
                                        <Badge color={item.answer ? "success" : "info"}>
                                            {item.answer ? "답변완료" : "답변대기"}
                                        </Badge>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Card>
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

export default AdminInquiryListPage;
