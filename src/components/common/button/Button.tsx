import React from "react";
import styled, { css } from "styled-components";

// 1. 스타일 변수 객체로 관리 (유지보수가 쉽습니다)
const variants = {
    primary: css`
        background-color: #ffde59;
        color: #333;
        &:hover {
            background-color: #ffc837;
        }
    `,
    secondary: css`
        background-color: #f0f0f0;
        color: #666;
        &:hover {
            background-color: #e0e0e0;
        }
    `,
    danger: css`
        background-color: #ff4d4f;
        color: white;
        &:hover {
            background-color: #d9363e;
        }
    `,
};

// 2. 스타일 정의
const StyledButton = styled.button<{
    $variant: keyof typeof variants;
    $fullWidth?: boolean;
}>`
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    /* fullWidth 옵션 처리 */
    width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

    /* variant(색상 테마) 적용 */
    ${(props) => variants[props.$variant]}

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
    }
`;

// 3. 타입 정의
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    children: React.ReactNode;
}

// 4. 컴포넌트 구현
export default function Button({
    variant = "primary",
    fullWidth = false,
    children,
    ...props
}: ButtonProps) {
    return (
        <StyledButton $variant={variant} $fullWidth={fullWidth} {...props}>
            {children}
        </StyledButton>
    );
};