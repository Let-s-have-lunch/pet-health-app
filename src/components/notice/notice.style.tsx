import styled, { css } from "styled-components";

export const NoticeContainer = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

export const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #222;
    padding-bottom: 10px;
`;

// 💡 공통 입력창 스타일을 위한 믹스인 (중복 코드 제거)
const inputStyle = css<{ $error?: boolean }>`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid ${({ $error }) => ($error ? "#ff4d4f" : "#ccc")}; // 에러 시 빨간색 테두리
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ $error }) => ($error ? "#ff4d4f" : "#555")};
    }
`;

export const Select = styled.select<{ $error?: boolean }>`
    ${inputStyle}
`;

export const Input = styled.input<{ $error?: boolean }>`
    ${inputStyle}
`;

export const TextArea = styled.textarea<{ $error?: boolean }>`
    ${inputStyle}
    height: 300px;
    resize: none;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;
