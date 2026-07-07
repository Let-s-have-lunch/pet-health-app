import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeFormSchema, type NoticeFormData } from "../../../schemas/noticeSchema.ts";
import noticeApi from "../../../api/admin/noticeApi.ts";
import { PostContainer, PostTitle } from "../../../components/post/post.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function NoticeWritePage() {
    const navigate = useNavigate();

    // Zod 스키마를 리액트 훅 폼과 연결
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
            alert("🐾 공지사항이 성공적으로 등록되었습니다!");
            navigate("/notices"); // 등록 후 목록으로 이동
        } catch (error) {
            alert("등록 중 문제가 발생했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostTitle>새 공지사항 작성 🐾</PostTitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* 제목 */}
                <input
                    {...register("title")}
                    placeholder="제목 (2글자 이상)"
                    className="border p-2 w-full"
                />
                {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}

                {/* 카테고리 */}
                <select {...register("category")} className="border p-2 w-full">
                    <option value="general">일반</option>
                    <option value="maintenance">점검</option>
                    <option value="event">이벤트</option>
                </select>

                {/* 고정글 */}
                <label>
                    <input type="checkbox" {...register("isPinned")} /> 상단 고정 📌
                </label>

                {/* 내용 */}
                <textarea
                    {...register("content")}
                    placeholder="내용을 입력하세요 (5글자 이상)"
                    className="border p-2 w-full h-[300px]"
                />
                {errors.content && <p style={{ color: "red" }}>{errors.content.message}</p>}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <Button type="button" color="secondary" onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </Button>
                </div>
            </form>
        </PostContainer>
    );
}

export default NoticeWritePage;
