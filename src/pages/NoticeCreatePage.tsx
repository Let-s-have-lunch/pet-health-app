import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema, type NoticeFormData } from "@/schemas/noticeSchema"; // 절대경로 추천
import { noticeApi } from "@/api/user/noticeApi"; // 💡 여기서 { noticeApi } 로 불러와야 합니다!
import { PostContainer, PostTitle } from "@/components/post/post.style";
import { Input, TextArea, Select, ButtonGroup } from "@/styles/notice.style"; // 우리가 만든 스타일들
import Button from "@/components/common/button/Button"; // 아까 만든 공용 버튼

function NoticeCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoticeFormData>({
        resolver: zodResolver(noticeFormSchema),
    });

    const onSubmit = async (data: NoticeFormData) => {
        try {
            await noticeApi.createNotice(data);
            alert("🐾 공지사항이 등록되었습니다!");
            navigate("/notices");
        } catch (error) {
            console.error(error);
            alert("등록 중 문제가 발생했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostTitle>새 공지사항 작성 🐾</PostTitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* 제목 */}
                <Input
                    {...register("title")}
                    placeholder="제목을 입력하세요"
                    $error={!!errors.title}
                />
                {errors.title && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.title.message}</p>
                )}

                {/* 카테고리 */}
                <Select {...register("category")}>
                    <option value="general">일반</option>
                    <option value="maintenance">점검</option>
                    <option value="event">이벤트</option>
                </Select>

                {/* 고정 여부 */}
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                    }}>
                    <input type="checkbox" {...register("isPinned")} /> 상단 고정 📌
                </label>

                {/* 내용 */}
                <TextArea
                    {...register("content")}
                    placeholder="내용을 입력하세요"
                    $error={!!errors.content}
                />
                {errors.content && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.content.message}</p>
                )}

                {/* 버튼 그룹 (재사용 컴포넌트 활용) */}
                <ButtonGroup>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </Button>
                </ButtonGroup>
            </form>
        </PostContainer>
    );
}

export default NoticeCreatePage;
