import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import inquiryApi from "@/api/user/inquiryApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Card from "@/components/common/card/Card";
import Button from "@/components/common/button/Button";

function MyInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryUserItemType | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadInquiry = async () => {
            try {
                const result = await inquiryApi.getMyInquiryById(inquiryId);
                setInquiry(result);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("문의글 정보를 불러오는데 실패했습니다.");
                    router.push("/inquiry");
                } else {
                    Alert.alert("오류", "문의글 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.push("/inquiry") },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };
        loadInquiry().then(() => {});
    }, [inquiryId, router]);

    const handleDeleteInquiry = async () => {
        const excuteDelete = async () => {
            try {
                await inquiryApi.deleteInquiry(inquiryId);

                if (Platform.OS === "web") {
                    alert("문의글이 삭제되었습니다.");
                    router.push("/inquiry");
                } else {
                    Alert.alert("완료", "문의글이 삭제되었습니다.", [
                        { text: "확인", onPress: () => router.push("/inquiry") },
                    ]);
                }
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("문의글 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "문의글 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 문의글을 삭제하시겠습니까?")) {
                excuteDelete().then(() => {});
            } else {
                Alert.alert("문의글 삭제", "정말 이 문의글을 삭제하시겠습니까?", [
                    { text: "확인", style: "destructive", onPress: excuteDelete },
                    { text: "취소", style: "cancel" },
                ]);
            }
        }
    };

    if (isLoading || !inquiry) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "bg-background-default")}>
            <Title
                title={"문의글 상세"}
                showBackButton={true}
                onBackPress={() => router.push("/inquiry")}
                className={"bg-background-paper"}
            />

            <ScrollView className={"flex-1"}>
                <ContentContainer className={"overflow-hidden flex-1"}>
                    <Card>
                        <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                            <TextComponent className={twMerge("mb-1", ["text-xl", "font-bold"])}>
                                {inquiry.title}
                            </TextComponent>
                            <TextComponent className={twMerge("text-sm", "text-text-secondary")}>
                                등록일 : {inquiry.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>

                        <View className={"min-h-60"}>
                            <TextComponent className={twMerge("leading-relaxed")}>
                                {inquiry.content}
                            </TextComponent>
                        </View>

                        {inquiry.answer && (
                            <View
                                className={twMerge(
                                    "mt-10 p-6 rounded-lg border",
                                    "bg-bg-default border-divider",
                                )}>
                                <View
                                    className={twMerge(
                                        "flex-row justify-between items-center",
                                        "border-b pb-4 border-divider",
                                    )}>
                                    <TextComponent
                                        className={twMerge("font-bold", "text-base")}>
                                        관리자 답변
                                    </TextComponent>

                                    <TextComponent
                                        className={twMerge("text-sm text-text-secondary")}>
                                        {inquiry.answeredAt &&
                                            new Date(inquiry.answeredAt).toLocaleString()}
                                    </TextComponent>
                                </View>

                                <View className={twMerge("pt-4")}>
                                    <TextComponent className="text-base text-text-default">
                                        {inquiry.answer}
                                    </TextComponent>
                                </View>
                            </View>
                        )}

                        <View
                            className={twMerge(
                                ["flex-row", "justify-between", "items-center"],
                                ["mt-10", "pt-6"],
                                ["border-divider", "border-t"],
                            )}>
                            <Button
                                size={"small"}
                                variant={"outlined"}
                                onPress={() => router.push("/inquiry")}>
                                목록으로
                            </Button>

                            <View className={twMerge("flex-row", "gap-3")}>
                                <Button
                                    size={"small"}
                                    variant={"outlined"}
                                    onPress={handleDeleteInquiry}>
                                    삭제
                                </Button>
                                <Button
                                    size={"small"}
                                    variant={"contained"}
                                    color={"warning"}
                                    onPress={() =>
                                        router.push(`/inquiry/${inquiry.id}/update`)
                                    }
                                    className={"bg-primary-main border-primary-main"}>
                                    수정
                                </Button>
                            </View>
                        </View>
                    </Card>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}

export default MyInquiryDetailPage;
