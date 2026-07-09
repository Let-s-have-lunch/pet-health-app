import { useNavigate, useParams } from "react-router-dom";
import { useNoticeDetail } from "../hooks/useNoticeDetail";
import {
    DetailContent,
    DetailHeader,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style";
import Button from "../../../components/common/button/Button"; // 우리가 만든 재사용 버튼

function NoticeDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // 1. 훅에서 에러 상태까지 가져옵니다.
    const { notice, isLoading, deleteNotice, error } = useNoticeDetail(id);

    const categoryMap: Record<string, string> = {
        general: "🐾 일반 안내",
        maintenance: "🛠️ 서비스 점검",
        event: "🎉 이벤트",
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteNotice();
            alert("삭제되었습니다.");
            navigate("/notices");
        } catch (err) {
            alert("삭제에 실패했습니다.");
        }
    };

    // 2. 로딩 중
    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>소중한 정보를 불러오는 중입니다... 🐕</LoadingText>
            </PostContainer>
        );
    }

    // 3. 에러 발생 시 처리
    if (error) {
        return (
            <PostContainer>
                <p style={{ textAlign: "center", color: "#ff4d4f" }}>{error}</p>
                <Button variant="secondary" onClick={() => navigate("/notices")}>
                    목록으로 돌아가기
                </Button>
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
                    </div>
                    <DetailTitle>{notice.title}</DetailTitle>
                </DetailHeader>

                <DetailContent
                    style={{ whiteSpace: "pre-wrap", padding: "20px 0", minHeight: "300px" }}>
                    {notice.content}
                </DetailContent>

                {/* 4. 버튼 props 수정: variant를 사용합니다 */}
                <AdminButtonGroup>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        삭제하기
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
