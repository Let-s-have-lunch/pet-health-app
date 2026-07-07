import { Outlet } from "react-router-dom";

// 간단하게 스타일을 입힌 레이아웃 컴포넌트입니다.
export default function Layout() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* 상단 헤더 */}
            <header
                style={{
                    padding: "20px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    backgroundColor: "#fffef0",
                }}>
                <h1>🐾 펫빌리지 공지사항</h1>
            </header>

            {/* 메인 콘텐츠 영역: Outlet이 핵심! */}
            <main
                style={{
                    flex: 1,
                    padding: "20px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                }}>
                <Outlet />
            </main>

            {/* 하단 푸터 */}
            <footer
                style={{
                    padding: "20px",
                    textAlign: "center",
                    borderTop: "1px solid #eee",
                    fontSize: "0.8rem",
                    color: "#888",
                }}>
                © 2026 PetVillage. All rights reserved.
            </footer>
        </div>
    );
}
