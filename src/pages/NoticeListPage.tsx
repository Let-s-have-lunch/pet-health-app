import { Link, useSearchParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import noticeApi from "../../api/user/noticeApi.ts";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../components/post/post.style.tsx";
import Pagination from "../../components/common/Pagination/Pagination.tsx";
import Button from "../../components/common/button/Button.tsx"; // 공통 버튼 사용
import type { Notice } from "../../types/notice.type.ts";

function NoticeListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = 10; // 페이지당 글 개수 고정

    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState(""); // 1. 검색 기능용 상태

    const totalPage = Math.ceil(total / size);

    // 2. 삭제 기능 (관리자 페이지라면 필수)
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await noticeApi.deleteNotice(id);
            alert("삭제되었습니다.");
            await loadList(); // 삭제 후 목록 새로고침
        } catch (error) {
            alert("삭제 실패");
        }
    };

    // 3. 목록 불러오기 로직 분리 (재사용성)
    const loadList = useCallback(async (currentPage: number, currentSize: number) => {
        setLoading(true);
        try {
            const data = await noticeApi.getNoticeList(currentPage, currentSize);
            // 중요: 고정글(isPinned)이 먼저 오도록 정렬
            const sortedList = [...data.list].sort(
                (a, b) => Number(b.isPinned) - Number(a.isPinned),
            );
            setList(sortedList);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        loadList(page, size)
    }, [loadList,page, size]);

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>공지사항 관리 ({total}건)</PostTitle>
                {/* 4. 상단 검색바 예시 영역 */}
                <input placeholder="제목 검색..." onChange={e => setKeyword(e.target.value)} />
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>불러오는 중...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"10%"}>번호</BoardTh>
                                <BoardTh $width={"50%"}>제목</BoardTh>
                                <BoardTh $width={"20%"}>작성일</BoardTh>
                                <BoardTh $width={"20%"}>관리</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(item => (
                                <tr
                                    key={item.id}
                                    style={{ background: item.isPinned ? "#fdf6f2" : "" }}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd>
                                        <Link to={`/notice/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </BoardTd>
                                    <BoardTd>
                                        {/* 5. 관리자 전용 삭제 버튼 */}
                                        <Button
                                            size="small"
                                            color="danger"
                                            onClick={() => handleDelete(item.id)}>
                                            삭제
                                        </Button>
                                    </BoardTd>
                                </tr>
                            ))}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            <Pagination
                currentPage={page}
                totalPage={totalPage}
                onPageChange={(page: { toString: () => any }) =>
                    setSearchParams({ page: page.toString() })
                }
            />
        </PostContainer>
    );
}

export default NoticeListPage;
