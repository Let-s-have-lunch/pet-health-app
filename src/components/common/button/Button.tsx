import React from "react";
import styled from "styled-components";

// 1. 스타일 정의 (버튼의 모양을 결정합니다)
const StyledButton = styled.button<{ $color?: "primary" | "secondary" }>`
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    /* 색상 테마 설정 */
    background-color: ${({ $color }: { $color?: string }) => ($color === "secondary" ? "#f0f0f0" : "#ffde59")};
    color: ${({ $color }: { $color?: string }) => ($color === "secondary" ? "#666" : "#333")};

    &:hover {
        background-color: ${({ $color }: { $color?: string }) => ($color === "secondary" ? "#e0e0e0" : "#ffc837")};
        transform: translateY(-1px);
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
    }
`;

// 2. 타입 정의 (Button 컴포넌트가 받을 수 있는 데이터 형태)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "primary" | "secondary";
    children: React.ReactNode;
}

// 3. 컴포넌트 구현
export default function Button({ color = "primary", children, ...props }: ButtonProps) {
    return (
        <StyledButton $color={color} {...props}>
            {children}
        </StyledButton>
    );
}
