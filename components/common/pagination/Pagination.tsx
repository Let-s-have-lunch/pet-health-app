import React from "react";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
    currentPage: number; // 현재 페이지 (1부터 시작)
    totalPages: number; // 전체 페이지 수
    onPageChange: (page: number) => void; // 페이지 변경 함수
    maxVisibleButtons?: number; // 화면에 보여질 페이지 버튼 수
}

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisibleButtons = 5 }: PaginationProps) {
    // 💡 핵심: 현재 페이지가 항상 중앙에 오도록 시작/끝 페이지 계산하는 알고리즘
    const getPageNumbers = () => {
        if (totalPages <= maxVisibleButtons) {
            // 전체 페이지가 5개 이하면 그냥 다 보여줌
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // 기본적으로 현재 페이지를 중앙에 두기 위한 시작점 계산
        let start = currentPage - Math.floor(maxVisibleButtons / 2); // currentPage - 2
        let end = currentPage + Math.floor(maxVisibleButtons / 2); // currentPage + 2

        // 앞부분 예외 처리 (1, 2 페이지일 때 왼쪽으로 넘어가지 않게 고정)
        if (start < 1) {
            start = 1;
            end = maxVisibleButtons;
        }

        // 뒷부분 예외 처리 (마지막 페이지 근처일 때 오른쪽으로 넘어가지 않게 고정)
        if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisibleButtons + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 py-4 select-none">
            {/* 이전 페이지 버튼 */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={twMerge(
                    "w-8 h-10 flex items-center justify-center text-lg font-medium transition-colors",
                    "text-gray-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none",
                )}
                aria-label="이전 페이지">
                ‹
            </button>

            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(page => {
                const isActive = page === currentPage;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={twMerge(
                            // 공통 스타일 (image_b25601.png 기반 둥근 모서리 및 폰트 크기)
                            "w-10 h-10 rounded-[10px] text-lg font-normal flex items-center justify-center border-2 transition-all duration-150 active:scale-95",

                            // 비활성화 상태 (기본 하얀 바탕 + 회색 테두리)
                            "bg-white border-text-secondary text-text-default",

                            // 💡 활성화 상태 (푸른색 배경 + 두꺼운 글씨 + 테두리 제거)
                            isActive && "bg-secondary-main border-transparent font-semibold text-text-default",
                        )}>
                        {page}
                    </button>
                );
            })}

            {/* 다음 페이지 버튼 */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={twMerge(
                    "w-8 h-10 flex items-center justify-center text-lg font-medium transition-colors",
                    "text-gray-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none",
                )}
                aria-label="다음 페이지">
                ›
            </button>
        </div>
    );
}
