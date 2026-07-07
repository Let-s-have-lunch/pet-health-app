import styled from "styled-components";

// 전체 게시글 컨테이너
export const PostContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #ffffff;
`;

// 상세 페이지 전체 감싸는 래퍼
export const DetailWrapper = styled.div`
    border: 1px solid #eee;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

// 헤더: 제목과 메타데이터
export const DetailHeader = styled.header`
    border-bottom: 2px solid #333;
    padding-bottom: 20px;
    margin-bottom: 30px;
`;

// 제목 스타일
export const DetailTitle = styled.h2`
    font-size: 28px;
    color: #222;
    margin: 10px 0;
    line-height: 1.3;
`;

// 작성일, 조회수 등 정보 영역
export const DetailInfo = styled.div`
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 14px;
`;

// 실제 본문 내용
export const DetailContent = styled.div`
    font-size: 16px;
    line-height: 1.8;
    color: #444;
    min-height: 300px;
    word-break: break-all;
`;

// 로딩 중일 때 표시할 텍스트
export const LoadingText = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: #666;
`;

