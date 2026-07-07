import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import noticeApi from "../../../api/user/noticeApi.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function NoticeDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 반려동물 테마 카테고리 매핑
    const categoryMap: Record<string, string> = {
        general: "🐾 일반",
        maintenance: "🛠️ 점검",
        event: "🎉 이벤트",
    };

    useEffect(() => {
        const loadNotice = async () => {
            try {
                // 기존 강사님 API 호출 방식 유지
                const data = await noticeApi.getNoticeById(Number(id));
                setNotice(data);
            } catch (error) {
                console.log(error);
                alert("공지사항을 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotice();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>공지사항 내용을 불러오는 중입니다... 🐕</LoadingText>
            </PostContainer>
        );
    }

    if (!notice) return null;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    {/* 🐾 카테고리 및 고정글 뱃지 추가 */}
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "8px", color: "#f97316", fontWeight: "bold" }}>
                            {categoryMap[notice.category] || "🐾 일반"}
                        </span>
                        {notice.isPinned && (
                            <span
                                style={{
                                    background: "#fee2e2",
                                    color: "#ef4444",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                }}>
                                📌 필독
                            </span>
                        )}
                    </div>

                    <DetailTitle>{notice.title}</DetailTitle>

                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
                            <span style={{ marginLeft: "15px" }}>
                                조회수: {notice.views?.toLocaleString() || 0}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent style={{ whiteSpace: "pre-wrap" }}>{notice.content}</DetailContent>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
