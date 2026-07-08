import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/notice/noticeSchema";
import { useLocalSearchParams, useRouter } from "expo-router";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import adminNoticeApi from "@/api/admin/adminNoticeApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";

function AdminNoticeUpdatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminNoticeSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await noticeApi.getNoticeById(noticeId);
                reset({
                    ...result,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항을 불러오는 중에 오류가 발생했습니다.");
                    router.push("/admin/notices");
                } else {
                    Alert.alert("오류", "공지사항을 불러오는 중에 오류가 발생했습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/notices") },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadData().then(() => {});
    }, [noticeId, reset, router]);

    const onSubmit = async (input: AdminNoticeInputType) => {
        try {
            await adminNoticeApi.updateNotice(noticeId, input);

            if (Platform.OS === "web") {
                alert("공지사항이 성공적으로 수정 되었습니다.");
                router.push("/admin/notices");
            } else {
                Alert.alert("완료", "공지사항이 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/notices") },
                ]);
            }
        } catch (error) {
            console.log(error);
            setError("root", { message: "공지사항 수정에 실패했습니다." });
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"공지사항 수정"}
                description={"기존에 등록된 공지사항을 수정합니다."}
                className={"mt-[-25px] px-0 mb-6"}
            />
            <ScrollView className={"flex-1"}>
                <Card>
                    <Controller
                        control={control}
                        name={"title"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"title"}
                                    label={"제목"}
                                    placeholder={"공지사항 제목을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.title?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"content"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextareaGroup
                                    id={"content"}
                                    label={"내용"}
                                    placeholder={"공지사항 상세 내용을 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.content?.message}
                                />
                            );
                        }}
                    />

                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("mt-2", "text-center")}>
                            {errors.root.message}
                        </ErrorMessage>
                    )}

                    <View
                        className={twMerge("mt-10", [
                            "flex-row",
                            "justify-end",
                            "items-center",
                            "gap-3",
                        ])}>
                        <Button
                            size={"small"}
                            variant={"outlined"}
                            color={"secondary"}
                            onPress={() => router.push("/admin/notices")}>
                            취소
                        </Button>
                        <Button
                            size={"small"}
                            variant={"contained"}
                            color={"primary"}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            {isSubmitting ? "수정중..." : "수정"}
                        </Button>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeUpdatePage;
