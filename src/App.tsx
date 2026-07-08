import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. 기존 페이지들
import Login from "./pages/Login";
import CommunityList from "./pages/CommunityList";
import CommunityWrite from "./pages/CommunityWrite";
import InquiryForm from "./pages/InquiryForm";

// 2. 공통 레이아웃
import Layout from "./layouts/Layout";

// 3. 공지사항 페이지들 (Lazy Loading을 위해 lazy 함수 사용)
const NoticeListPage = lazy(() => import("./pages/NoticeListPage"));
const NoticeDetailPage = lazy(() => import("./pages/NoticeDetailPage"));
const NoticeCreatePage = lazy(() => import("./pages/NoticeCreatePage"));
const NoticeEditPage = lazy(() => import("./pages/NoticeEditPage")); // 💡 추가됨!

export default function App() {
    return (
        <Router>
            {/* Suspense는 페이지 로딩 중에 보여줄 화면을 설정합니다. */}
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* 로그인 화면은 레이아웃 없이 단독으로 */}
                    <Route path="/login" element={<Login />} />

                    {/* 레이아웃 공유 페이지 */}
                    <Route element={<Layout />}>
                        {/* 기존 페이지들 */}
                        <Route path="/community" element={<CommunityList />} />
                        <Route path="/community/write" element={<CommunityWrite />} />
                        <Route path="/inquiry" element={<InquiryForm />} />

                        {/* 공지사항 라우팅 */}
                        <Route path="/notices" element={<NoticeListPage />} />
                        <Route path="/notice/:id" element={<NoticeDetailPage />} />
                        <Route path="/notice/create" element={<NoticeCreatePage />} />
                        {/* 💡 수정 페이지 경로 추가 */}
                        <Route path="/notice/edit/:id" element={<NoticeEditPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}
