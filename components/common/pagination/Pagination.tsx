import React from "react";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisibleButtons?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisibleButtons = 5 }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        if (totalPages <= maxVisibleButtons) {

            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }


        let start = currentPage - Math.floor(maxVisibleButtons / 2);
        let end = currentPage + Math.floor(maxVisibleButtons / 2);


        if (start < 1) {
            start = 1;
            end = maxVisibleButtons;
        }


        if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisibleButtons + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 py-4 select-none">

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


            {pageNumbers.map(page => {
                const isActive = page === currentPage;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={twMerge(

                            "w-10 h-10 rounded-[10px] text-lg font-normal flex items-center justify-center border-2 transition-all duration-150 active:scale-95",

                            "bg-white border-text-secondary text-text-default",


                            isActive && "bg-secondary-main border-transparent font-semibold text-text-default",
                        )}>
                        {page}
                    </button>
                );
            })}


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
