import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema } from "@/schemas/noticeSchema"; // 아까 정의한 스키마
import { NoticeFormData } from "@/api/user/noticeApi"; // 타입 재사용
import Button from "./Button"; // 방금 수정하신 버튼!
import styled from "styled-components";

interface NoticeFormProps {
    onSubmit: (data: NoticeFormData) => void;
    defaultValues?: NoticeFormData; // 수정 페이지에서 쓸 때를 대비해 기본값도 받습니다.
}

const NoticeForm = ({ onSubmit, defaultValues }: NoticeFormProps) => {
    // 1. useForm 설정 (검증 로직 포함)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NoticeFormData>({
        resolver: zodResolver(noticeFormSchema),
        defaultValues: defaultValues,
    });

    return (
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
            {/* 제목 필드 */}
            <InputGroup>
                <input {...register("title")} placeholder="제목을 입력하세요" />
                {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            </InputGroup>

            {/* 내용 필드 */}
            <InputGroup>
                <textarea {...register("content")} placeholder="내용을 입력하세요" rows={10} />
                {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
            </InputGroup>

            {/* 재사용 가능한 버튼 컴포넌트 사용 */}
            <Button type="submit">등록하기</Button>
        </FormContainer>
    );
};

// 간단한 스타일링
const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const ErrorMessage = styled.span`
    color: #ff4d4f;
    font-size: 12px;
`;

export default NoticeForm;
