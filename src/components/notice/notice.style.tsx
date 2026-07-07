import styled, { css } from "styled-components"; // 🐾 css 추가됨!

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

export const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;
    color: #333;

    &:focus {
        outline: none;
        border-color: #555;
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: #555;
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    height: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    box-sizing: border-box;
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: #555;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

export const Button = styled.button<{ $variant?: "outline" | "solid" }>`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    /* 1. 기본 스타일 (일반 검정색 버튼) - props를 안 쓰므로 에러 날 일이 없음 */
    background-color: #222;
    color: white;
    border: 1px solid #222;

    &:hover {
        background-color: #444;
    }

    /* 2. $variant가 "outline"일 때만 통째로 스타일 덮어쓰기 (props 딱 한 번만 평가) */
    ${(props: { $variant: string }) =>
        props.$variant === "outline" &&
        css`
            background-color: white;
            color: #333;
            border: 1px solid #ccc;

            &:hover {
                background-color: #f9f9f9;
            }
        `}
`;
