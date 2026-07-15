import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisibleButtons?: number;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisibleButtons = 5,
    className,
}: PaginationProps) {
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
        <View className="flex-row items-center justify-center gap-2 pt-4">
            {/* 이전 페이지 버튼 */}
            <TouchableOpacity
                onPress={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                activeOpacity={0.7}
                className={twMerge(
                    "w-8 h-10 flex items-center justify-center",
                    currentPage === 1 && "opacity-30",
                )}
                accessibilityLabel="이전 페이지">
                <Text className="text-lg font-medium text-gray-800">‹</Text>
            </TouchableOpacity>

            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(page => {
                const isActive = page === currentPage;
                return (
                    <TouchableOpacity
                        key={page}
                        onPress={() => onPageChange(page)}
                        activeOpacity={0.7}
                        className={twMerge(
                            "w-10 h-10 rounded-[10px] border flex items-center justify-center",
                            "bg-white border-text-secondary",
                            isActive && "bg-primary-main border-transparent",
                            className,
                        )}>
                        <Text
                            className={twMerge(
                                "text-lg font-normal text-text-default",
                                isActive && "font-semibold",
                            )}>
                            {page}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            {/* 다음 페이지 버튼 */}
            <TouchableOpacity
                onPress={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                activeOpacity={0.7}
                className={twMerge(
                    "w-8 h-10 flex items-center justify-center",
                    currentPage === totalPages && "opacity-30",
                )}
                accessibilityLabel="다음 페이지">
                <Text className="text-lg font-medium text-gray-800">›</Text>
            </TouchableOpacity>
        </View>
    );
}
