import { useCallback, useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import { useLocalSearchParams, useRouter } from "expo-router";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Pagination";

function AdminNoticeListPage() {
    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                const result = await noticeApi.getNoticeList(targetPage, targetSize);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항 목록을 불러오는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "공지사항 목록을 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            }
        },
        [router],
    );

    useEffect(() => {
        loadNotices(currentPage, pageSize).then(() => {});
    }, [currentPage, loadNotices, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"공지사항 관리"}
                description={"서비스의 주요 소식 및 공지사항을 관리합니다."}
                className={"mt-[-20px] px-0 mb-6"}>
                <Button
                    size={"small"}
                    variant={"contained"}
                    onPress={() => router.push("/admin/notices/create")} className={"bg-primary-main"}>
                    + 공지사항 등록
                </Button>
            </Title>

            <Card className={"overflow-hidden p-0"}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-divider", "border-b", "bg-primary-main", "border-primary-main", "rounded-t-xl"],
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
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                </View>

                <ScrollView className={"flex-1"}>
                    {list.length === 0 && (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 공지사항이 없습니다.
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
                                onPress={() => router.push(`/admin/notices/${item.id}`)}>
                                <TextComponent
                                    className={twMerge([
                                        "font-bold",
                                        "transition-all",
                                        "hover:text-primary-main"
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
                                ])}>
                                {item.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>
                    ))}
                </ScrollView>
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

export default AdminNoticeListPage;
