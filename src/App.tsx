import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. 기존 페이지들
import Login from "./pages/Login";
import CommunityList from "./pages/CommunityList";
import CommunityWrite from "./pages/CommunityWrite";
import InquiryForm from "./pages/InquiryForm";

// 2. 우리가 만든 공지사항 페이지들
import Layout from "./layouts/Layout"; // 공통 레이아웃
import NoticeListPage from "./pages/NoticeListPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import NoticeWritePage from "./pages/NoticeWritePage";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* 로그인 화면은 레이아웃 없이 단독으로 보여줄 때 */}
                <Route path="/login" element={<Login />} />

                {/* 나머지 페이지들은 Layout 안에 중첩(Nested Route)시켜서 헤더/푸터를 공유 */}
                <Route element={<Layout />}>
                    {/* 기존 페이지들 */}
                    <Route path="/community" element={<CommunityList />} />
                    <Route path="/community/write" element={<CommunityWrite />} />
                    <Route path="/inquiry" element={<InquiryForm />} />

                    {/* 우리 공지사항 파트 */}
                    <Route path="/notices" element={<NoticeListPage />} />
                    <Route path="/notice/:id" element={<NoticeDetailPage />} />
                    <Route path="/notice/write" element={<NoticeWritePage />} />
                </Route>
            </Routes>
        </Router>
    );
}
