import { Inquiry } from "@/types/inquiry";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { InquiryAnswerInputType, inquiryAnswerSchema } from "@/schemas/inquiry/inquiryAnswerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Platform, View } from "react-native";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { twMerge } from "tailwind-merge";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
    isEdit: boolean;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
}

function AdminInquiryAnswerForm({ inquiry, reload, isEdit, setIsEdit }: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
        mode: "onTouched",
        defaultValues: {
            answer: "",
        },
    });

    useEffect(() => {
        reset({ answer: inquiry.answer || "" });
    }, [inquiry.answer, reset]);

    const onSubmit = async (input: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.updateInquiryAnswer(inquiry.id, input);

            const actionText = isEdit ? "수정" : "등록";
            const successMessage = `답변을 성공적으로 ${actionText}했습니다.`;

            if (Platform.OS === "web") {
                alert(successMessage);
            } else {
                Alert.alert("완료", successMessage);
            }

            await reload();
            setIsEdit(false);
        } catch (error) {
            console.log(error);

            const actionText = isEdit ? "수정" : "등록";
            const errorMessage = `답변을 ${actionText}하는데 실패했습니다.`;

            if (Platform.OS === "web") {
                alert(errorMessage);
            } else {
                Alert.alert("오류", errorMessage);
            }
        }
    };

    return (
        <View className={"gap-1 md:gap-3"}>
            <Controller
                control={control}
                name={"answer"}
                render={({ field: { onChange, onBlur, value } }) => {
                    return (
                        <TextareaGroup
                            id={"answer"}
                            label={"관리자 답변 작성"}
                            placeholder={"사용자에게 전달할 답변을 상세히 작성해주세요."}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.answer?.message}
                        />
                    );
                }}
            />

            <View
                className={twMerge(["flex-row", "justify-end", "items-center", "gap-3"])}>
                {isEdit && (
                    <Button
                        size={"small"}
                        variant={"outlined"}
                        onPress={() => setIsEdit(false)}>
                        취소
                    </Button>
                )}

                <Button
                    size={"small"}
                    variant={"contained"}
                    color={"primary"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}>
                    {isEdit ? "답변 수정" : "답변 등록"}
                </Button>
            </View>
        </View>
    );
}

export default AdminInquiryAnswerForm;
