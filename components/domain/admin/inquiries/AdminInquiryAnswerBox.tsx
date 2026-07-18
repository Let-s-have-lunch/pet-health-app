import { Inquiry } from "@/types/inquiry";
import { Dispatch, SetStateAction } from "react";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { Alert, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
}

function AdminInquiryAnswerBox({ inquiry, reload, setIsEdit }: Props) {
    const handleDeleteAnswer = async () => {
        const excuteDelete = async () => {
            try {
                await adminInquiryApi.deleteInquiryAnswer(inquiry.id);
                await reload();
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("관리자 답변 삭제 중 오류가 발생되었습니다.");
                } else {
                    Alert.alert("오류", "관리자 답변 삭제 중 오류가 발생되었습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 답변을 삭제하시겠습니까?")) {
                excuteDelete().then(() => {});
            }
        } else {
            Alert.alert("답변 삭제", "정말 답변을 삭제하시겠습니까?", [
                { text: "확인", style: "destructive", onPress: excuteDelete },
                { text: "취소", style: "cancel" },
            ]);
        }
    };

    return (
        <View>
            <View
                className={twMerge([
                    "md:flex-row",
                    "md:items-center",
                    "gap-1",
                    "md:justify-between",
                ])}>
                <TextComponent className={twMerge("text-base", "font-bold")}>
                    관리자 답변
                </TextComponent>
                <TextComponent className={"text-sm"}>
                    답변 일시 : {inquiry.answeredAt && inquiry.answeredAt.substring(0, 10)}
                </TextComponent>
            </View>
            <TextComponent
                className={"py-3 md:py-6 leading-relaxed whitespace-pre-wrap break-words"}>
                {inquiry.answer}
            </TextComponent>

            <View
                className={twMerge(
                    ["flex-row", "justify-end", "items-center"],
                    ["mt-10", "pt-6", "gap-3"],
                    ["border-divider", "border-t"],
                )}>
                <Button
                    size={"small"}
                    variant={"outlined"}
                    color={"error"}
                    onPress={handleDeleteAnswer}>
                    답변 삭제
                </Button>
                <Button size={"small"} variant={"contained"} onPress={() => setIsEdit(true)}>
                    답변 수정
                </Button>
            </View>
        </View>
    );
}

export default AdminInquiryAnswerBox;
