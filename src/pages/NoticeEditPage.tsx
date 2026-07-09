import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema, type NoticeFormData } from "@/schemas/noticeSchema"; // 경로 확인!
import { noticeApi } from "@/api/user/noticeApi"; // 💡 destructuring import
import { PostContainer, PostTitle } from "@/components/post/post.style";
import { Input, TextArea, Select } from "@/src/components/notice/notice.style"; // 우리가 만든 스타일들
import { AdminButtonGroup } from "@/components/admin/admin.style"; // 스타일 통일
import Button from "@/components/common/button/Button"; // 공용 버튼

function NoticeEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NoticeFormData>({
        resolver: zodResolver(noticeFormSchema as any),
    });

    useEffect(() => {
        const fetchNotice = async () => {
            if (!id) return;
            try {
                // API 결과값이 { success: true, data: ... } 형태라면 data.data를 사용하세요!
                const response = await noticeApi.getNoticeById(Number(id));
                const data = response.data;
                reset({
                    title: data.title,
                    content: data.content,
                    category: data.category,
                    isPinned: data.isPinned,
                });
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                alert("데이터를 불러올 수 없습니다.");
            }
        };
        void fetchNotice();
    }, [id, reset]);

    const onSubmit = async (data: NoticeFormData) => {
        try {
            await noticeApi.updateNotice(Number(id), data);
            alert("🐾 공지사항이 성공적으로 수정되었습니다!");
            navigate("/notices");
        } catch (error) {
            alert("수정 중 문제가 발생했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostTitle>공지사항 수정 🐾</PostTitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* 제목: 에러 시 빨간 테두리 적용 ($error) */}
                <Input {...register("title")} placeholder="제목" $error={!!errors.title} />
                {errors.title && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.title.message}</p>
                )}

                {/* 카테고리 */}
                <Select {...register("category")}>
                    <option value="general">일반</option>
                    <option value="maintenance">점검</option>
                    <option value="event">이벤트</option>
                </Select>

                {/* 고정글 */}
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                    }}>
                    <input type="checkbox" {...register("isPinned")} /> 상단 고정 📌
                </label>

                {/* 내용: 에러 시 빨간 테두리 적용 ($error) */}
                <TextArea {...register("content")} placeholder="내용" $error={!!errors.content} />
                {errors.content && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.content.message}</p>
                )}

                {/* 버튼 그룹: AdminButtonGroup과 공용 Button 재사용 */}
                <AdminButtonGroup>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button type="submit" disabled={isSubmitting} variant="primary">
                        {isSubmitting ? "수정 중..." : "수정 완료"}
                    </Button>
                </AdminButtonGroup>
            </form>
        </PostContainer>
    );
}

export default NoticeEditPage;
