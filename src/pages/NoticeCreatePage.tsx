import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema, type NoticeFormData } from "@/schemas/noticeSchema";
import { noticeApi } from "@/api/user/noticeApi";
import { PostContainer, PostTitle } from "@/components/post/post.style";
import { Input, TextArea, Select, ButtonGroup } from "@/src/components/notice/notice.style";
import Button from "@/components/common/button/Button";

function NoticeCreatePage() {
    const navigate = useNavigate();

    // 1. 여기서 타입을 정확히 지정합니다.
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoticeFormData>({
        resolver: zodResolver(noticeFormSchema as any),
        defaultValues: {
            title: "",
            content: "",
            category: "general",
            isPinned: false,
        },
    });

    // 2. SubmitHandler 타입을 명시해서 handleSubmit이 data를 완벽히 이해하게 합니다.
    const onSubmit: SubmitHandler<NoticeFormData> = async data => {
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
                <Input
                    {...register("title")}
                    placeholder="제목을 입력하세요"
                    $error={!!errors.title}
                />
                {errors.title && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.title.message}</p>
                )}

                <Select {...register("category")}>
                    <option value="general">일반</option>
                    <option value="maintenance">점검</option>
                    <option value="event">이벤트</option>
                    <option value="adoption">입양</option>
                    <option value="missing">실종</option>
                </Select>

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                    }}>
                    <input type="checkbox" {...register("isPinned")} /> 상단 고정 📌
                </label>

                <TextArea
                    {...register("content")}
                    placeholder="내용을 입력하세요"
                    $error={!!errors.content}
                />
                {errors.content && (
                    <p style={{ color: "#ff4d4f", fontSize: "12px" }}>{errors.content.message}</p>
                )}

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
