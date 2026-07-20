import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import AdminInquiryAnswerBox from "@/components/domain/admin/inquiries/AdminInquiryAnswerBox";
import AdminInquiryAnswerForm from "@/components/domain/admin/inquiries/AdminInquiryAnswerForm";
import Button from "@/components/common/button/Button";

function AdminInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryUserItemType | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState(false);

    const loadInquiry = useCallback(async () => {
        try {
            const result = await adminInquiryApi.fetchInquiryById(inquiryId);
            setInquiry(result);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("문의글 정보를 불러오는데 실패했습니다.");
                router.push("/admin/inquiries");
            } else {
                Alert.alert("오류", "문의글 정보를 불러오는데 실패했습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/inquiries") },
                ]);
            }
        } finally {
            setLoading(false);
        }
    }, [inquiryId, router]);

    useEffect(() => {
        loadInquiry().then(() => {});
    }, [loadInquiry]);

    if (isLoading || !inquiry) {
        return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <View className={twMerge(["flex-1", "w-full"])}>
            <Title
                title={"문의글 상세"}
                description={"등록된 문의글의 내용을 확인합니다."}
                className={"mt-[-25px] px-0 mb-6"}
            />

            <ScrollView className={"flex-1"}>
                <Card>
                    <View className={twMerge(["border-b", "border-divider"], ["pb-4", "mb-6"])}>
                        <TextComponent className={twMerge("mb-1", ["text-xl", "font-bold"])}>
                            {inquiry.title}
                        </TextComponent>
                        <View className={twMerge("flex-row", "justify-between", "items-center")}>
                            <TextComponent className={twMerge("text-sm", "text-text-secondary")}>
                                {inquiry.user.nickname}
                            </TextComponent>
                            <TextComponent className={twMerge("text-sm", "text-text-secondary")}>
                                등록일 : {inquiry.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>
                    </View>

                    <View className={"min-h-60"}>
                        <TextComponent className={twMerge("leading-relaxed")}>
                            {inquiry.title}
                        </TextComponent>
                    </View>

                    <View className={"border-b border-divider"} />

                    <View
                        className={twMerge(
                            ["mt-8", "p-5", "md:p-6" , "bg-background-default"],
                            ["rounded-[28px]"],
                        )}>
                        {inquiry.answer && !isEdit ? (
                            <AdminInquiryAnswerBox inquiry={inquiry} reload={loadInquiry} setIsEdit={setIsEdit}/>
                        ) : (
                            <AdminInquiryAnswerForm
                                inquiry={inquiry}
                                reload={loadInquiry}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                            />
                        )}
                    </View>

                    <View className={twMerge(["mt-5 md:mt-10"], ["flex-row", "justify-end"])}>
                        <Button
                            size={"small"}
                            variant={"outlined"}
                            onPress={() => router.push("/admin/inquiries")}>
                            목록으로
                        </Button>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

export default AdminInquiryDetailPage;
