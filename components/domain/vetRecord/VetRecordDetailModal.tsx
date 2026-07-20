import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Pressable, ScrollView, ActivityIndicator, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import axiosInstance from "@/api/axiosInstance";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { vetLogApi } from "@/api/user/vetLogApi";
import { VetRecord } from "@/types/vetRecord";
import TextComponent from "@/components/common/text/TextComponent";
import VetRecordLogUpdateModal from "@/components/domain/vetRecord/VetRecordLogUpdateModal";
import Button from "@/components/common/button/Button";

interface Props {
    visible: boolean;
    recordId: number | null;
    onClose: () => void;
    onUpdateComplete?: () => void;
}

export default function VetRecordDetailModal({
    visible,
    recordId,
    onClose,
    onUpdateComplete,
}: Props) {
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";
    const [record, setRecord] = useState<VetRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const getImageUrl = (path?: string | null) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const fetchRecord = useCallback(async () => {
        if (!recordId) return;
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/vet-records/${recordId}`, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            setRecord(res?.data?.data || res?.data);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [recordId]);

    useEffect(() => {
        if (visible && recordId) fetchRecord().then(() => {});
    }, [visible, recordId, fetchRecord]);

    const formatLongDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일 ${days[date.getDay()]}요일`;
    };

    const handleDelete = async () => {
        if (!recordId) return;
        try {
            await vetLogApi.delete(recordId);
            onClose();
            if (onUpdateComplete) onUpdateComplete();
        } catch (error) {
            console.log(error);
            Alert.alert("오류", "삭제에 실패했습니다.");
        }
    };

    const handleUpdateSuccess = async () => {
        await fetchRecord();
        if (onUpdateComplete) onUpdateComplete();
        setIsUpdateModalOpen(false);
    };

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={onClose}>
                <Pressable
                    className={twMerge("flex-1 bg-black/50 justify-center items-center p-5")}
                    onPress={onClose}>
                    <Pressable
                        className={twMerge(
                            "bg-background-paper w-full max-w-xl rounded-[24px] overflow-hidden max-h-[85%]",
                        )}
                        onPress={e => e.stopPropagation()}>
                        <View
                            className={twMerge(
                                "flex-row items-center justify-between px-6 pt-6 pb-2",
                            )}>
                            <TextComponent
                                className={twMerge("text-[20px] font-bold text-text-default")}>
                                {record?.visitPurpose || "상세 기록"}
                            </TextComponent>
                            <Pressable onPress={onClose} className={twMerge("p-1")}>
                                <Ionicons name="close" size={24} color="#2C2C2C" />
                            </Pressable>
                        </View>

                        {loading ? (
                            <View className="h-40 justify-center">
                                <ActivityIndicator />
                            </View>
                        ) : !record ? null : (
                            <ScrollView
                                className={twMerge("px-6 pb-6")}
                                showsVerticalScrollIndicator={false}>
                                <TextComponent
                                    className={twMerge(
                                        "text-[15px] text-text-default font-bold mb-4 text-right",
                                    )}>
                                    {formatLongDate(record.visitDate)}
                                </TextComponent>

                                {record.receiptImage ? (
                                    <Image
                                        source={{ uri: getImageUrl(record.receiptImage) || "" }}
                                        className={twMerge("w-full h-[300px] rounded-[16px] mb-6")}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View
                                        className={twMerge(
                                            "w-full h-[300px] rounded-[16px] mb-6 border-2 border-dashed border-divider items-center justify-center bg-bg-light",
                                        )}>
                                        <Ionicons name="image-outline" size={40} color="#7F8C8D" />
                                    </View>
                                )}

                                <View className={twMerge("gap-3 mb-6")}>
                                    <View className={twMerge("flex-row items-center gap-3")}>
                                        <View
                                            className={twMerge(
                                                "w-8 h-8 rounded-full bg-error-main items-center justify-center",
                                            )}>
                                            <Ionicons
                                                name="medkit-outline"
                                                size={18}
                                                color="#E95244"
                                            />
                                        </View>
                                        <TextComponent
                                            className={twMerge(
                                                "text-[16px] text-text-default font-medium",
                                            )}>
                                            {record.hospitalName}
                                        </TextComponent>
                                    </View>
                                    <View className={twMerge("flex-row items-center gap-3")}>
                                        <View
                                            className={twMerge(
                                                "w-8 h-8 rounded-full bg-success-main items-center justify-center",
                                            )}>
                                            <Ionicons
                                                name="cash-outline"
                                                size={18}
                                                color="#35B18C"
                                            />
                                        </View>
                                        <TextComponent
                                            className={twMerge(
                                                "text-[16px] text-text-default font-medium",
                                            )}>
                                            {record.cost?.toLocaleString()}원
                                        </TextComponent>
                                    </View>
                                </View>

                                <View className={twMerge("h-[1px] bg-divider mb-6")} />

                                <View
                                    className={twMerge(
                                        "bg-bg-light p-4 rounded-[16px] border border-divider mb-8",
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            "text-[13px] text-text-secondary font-bold mb-2",
                                        )}>
                                        메모
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            "text-[15px] text-text-default leading-6",
                                        )}>
                                        {record.memo || "작성된 메모가 없습니다."}
                                    </TextComponent>
                                </View>

                                <View className={twMerge("flex-row gap-3")}>
                                    <Button
                                        variant={"outlined"}
                                        onPress={handleDelete}
                                        className={twMerge(["flex-1"])}>
                                        삭제
                                    </Button>
                                    <Button
                                        className={twMerge(["flex-1"])}
                                        variant={"contained"}
                                        onPress={() => setIsUpdateModalOpen(true)}>
                                        수정
                                    </Button>
                                </View>
                            </ScrollView>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            <VetRecordLogUpdateModal
                visible={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                logId={recordId ?? undefined}
                reload={handleUpdateSuccess}
            />
        </>
    );
}
