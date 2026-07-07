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

    const categoryMap: Record<string, string> = {
        general: "🐾 일반 안내",
        maintenance: "🛠️ 서비스 점검",
        event: "🎉 이벤트",
    };

    useEffect(() => {
        const loadNotice = async () => {
            if (!id) return;
            try {
                const data = await noticeApi.getNoticeById(Number(id));
                setNotice(data);
            } catch (error) {
                console.error("공지사항 로딩 실패:", error);
                alert("해당 공지사항을 찾을 수 없습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotice();
    }, [id, navigate]);

    // 🐾 날짜 포맷팅 안전장치 (데이터 오류 방지)
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "날짜 정보 없음"
            : date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              });
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>소중한 정보를 불러오는 중입니다... 🐕</LoadingText>
            </PostContainer>
        );
    }

    if (!notice) return null;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <div
                        style={{
                            marginBottom: "15px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}>
                        <span style={{ color: "#f97316", fontWeight: "bold", fontSize: "0.9rem" }}>
                            {categoryMap[notice.category] || "🐾 일반"}
                        </span>
                        {notice.isPinned && (
                            <span
                                style={{
                                    background: "#fee2e2",
                                    color: "#ef4444",
                                    padding: "3px 10px",
                                    borderRadius: "15px",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                }}>
                                📌 필독
                            </span>
                        )}
                    </div>

                    <DetailTitle>{notice.title}</DetailTitle>

                    <DetailInfo>
                        <div className={"left-info"}>
                            {/* 안전하게 포맷팅된 날짜 출력 */}
                            <span>{formatDate(notice.createdAt)}</span>
                            <span style={{ marginLeft: "15px", color: "#888" }}>
                                조회수 {notice.views?.toLocaleString() || 0}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                {/* 본문 내용의 가독성을 위해 여백 조절 */}
                <DetailContent
                    style={{ whiteSpace: "pre-wrap", padding: "20px 0", minHeight: "300px" }}>
                    {notice.content}
                </DetailContent>

                <AdminButtonGroup
                    style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
