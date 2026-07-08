import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";

export default function Layout() {
    return (
        <LayoutContainer>
            <Header>
                <Link to="/">🐾 펫빌리지 공지사항</Link>
            </Header>

            <Main>
                <Outlet />
            </Main>

            <Footer>© 2026 PetVillage. All rights reserved.</Footer>
        </LayoutContainer>
    );
}

// 레이아웃 전용 스타일 (파일을 나누지 않고 여기서 관리)
const LayoutContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled.header`
    padding: 20px;
    border-bottom: 1px solid #eee;
    text-align: center;
    background-color: #fffef0;

    a {
        text-decoration: none;
        color: inherit;
        font-weight: bold;
        font-size: 1.5rem;
    }
`;

const Main = styled.main`
    flex: 1;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
`;

const Footer = styled.footer`
    padding: 20px;
    text-align: center;
    border-top: 1px solid #eee;
    font-size: 0.8rem;
    color: #888;
`;
