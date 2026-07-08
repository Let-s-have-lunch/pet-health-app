import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import ContentContainer from "@/components/layouts/common/ContentContainer";

function NoticeDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNotice = async () => {
            try {
                const result = await noticeApi.getNoticeById(noticeId);
                setNotice(result);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항 정보를 불러오는데 실패했습니다.");
                    router.push("/admin/notices");
                } else {
                    Alert.alert("오류", "공지사항 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/notices") },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [noticeId, router]);

    if (isLoading || !notice) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "bg-background-default")}>
            <Title
                title={"공지사항 상세"}
                showBackButton={true}
                onBackPress={() => router.push("/notices")}
                className={"bg-background-paper"}
            />

            <ScrollView className={"flex-1"}>
                <ContentContainer className={"overflow-hidden flex-1"}>
                    <Card>
                        <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                            <TextComponent className={twMerge("mb-1", ["text-xl", "font-bold"])}>
                                {notice.title}
                            </TextComponent>
                            <View
                                className={twMerge("flex-row", "justify-between", "items-center")}>
                                <TextComponent
                                    className={twMerge("text-sm", "text-text-secondary")}>
                                    관리자
                                </TextComponent>
                                <TextComponent
                                    className={twMerge("text-sm", "text-text-secondary")}>
                                    등록일 : {notice.createdAt.substring(0, 10)}
                                </TextComponent>
                            </View>
                        </View>

                        <View className={"min-h-60"}>
                            <TextComponent className={twMerge("leading-relaxed")}>
                                {notice.content}
                            </TextComponent>
                        </View>

                        <View
                            className={twMerge(
                                ["flex-row", "justify-end", "items-center"],
                                ["mt-10", "pt-6"],
                                ["border-divider", "border-t"],
                            )}>
                            <Button
                                size={"small"}
                                variant={"outlined"}
                                onPress={() => router.push("/notices")}>
                                목록으로
                            </Button>
                        </View>
                    </Card>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}

export default NoticeDetailPage;
