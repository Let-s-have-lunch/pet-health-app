import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import {
    VictoryArea,
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryScatter,
} from "victory-native";
import { WaterIntakeLog } from "@/types/waterIntakeLog";

interface WaterLogChartSectionProps {
    historyData: WaterIntakeLog[];
}

export default function WaterLogChartSection({ historyData }: WaterLogChartSectionProps) {
    const [chartWidth, setChartWidth] = useState(300);

    // 💡 부모에서 넘어온 데이터를 가공하여 차트에 필요한 상태값 반환
    const { chartData, yMax, yTickValues, dateRangeText } = useMemo(() => {
        if (!historyData || historyData.length === 0) {
            return {
                chartData: [],
                yMax: 150,
                yTickValues: [0, 50, 100, 150],
                dateRangeText: "DATE -",
            };
        }

        // 1. 날짜별로 데이터 합산하기 (Grouping & Sum)
        const groupedByDate: Record<string, number> = {};

        historyData.forEach(log => {
            // "2026-07-13T14:30:00Z" 같은 형식이 올 수 있으므로 날짜 부분만 추출
            const dateStr = log.recordDate.split("T")[0];

            if (groupedByDate[dateStr]) {
                groupedByDate[dateStr] += log.amount; // 이미 있으면 누적합!
            } else {
                groupedByDate[dateStr] = log.amount; // 없으면 초기값 세팅!
            }
        });

        // 2. 날짜 최신순 정렬 후 최근 7일 자르고 차트 방향(과거->최신)으로 뒤집기
        const sortedDates = Object.keys(groupedByDate)
            .sort((a, b) => b.localeCompare(a)) // 최신 날짜가 맨 앞으로
            .slice(0, 7) // 최근 7일(7개)만 추출
            .reverse(); // 과거가 왼쪽, 최신이 오른쪽으로 가도록 뒤집기

        // 3. 차트 라이브러리 포맷({x, y})에 맞게 매핑
        const data = sortedDates.map(date => {
            const parts = date.split("-");
            const label =
                parts.length >= 3 ? `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}` : date;
            return { x: label, y: groupedByDate[date] }; // 합산된 y값 적용
        });

        const dateText =
            data.length > 0 ? `DATE ${data[0].x} ~ ${data[data.length - 1].x}` : "DATE -";

        const actualMax = Math.max(...data.map(d => d.y), 0);
        const step = actualMax > 200 ? 100 : 50;
        const max = Math.max(150, Math.ceil(actualMax / step) * step);
        const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);

        return { chartData: data, yMax: max, yTickValues: ticks, dateRangeText: dateText };
    }, [historyData]);

    // ... 아래 렌더링 로직(return 부분)은 기존과 완전히 동일합니다!
    return (
        <View className={twMerge("mb-6")}>
            <View className={twMerge("w-full mb-3")}>
                <TextComponent className={twMerge("text-[20px] font-bold")}>
                    음수량 변화
                </TextComponent>
                <TextComponent className={twMerge("text-[12px] text-text-secondary mt-1")}>
                    {dateRangeText}
                </TextComponent>
            </View>

            <Card
                shadow={"sm"}
                className={twMerge("w-full items-center bg-background-paper p-2")}
                onLayout={event => {
                    const { width } = event.nativeEvent.layout;
                    setChartWidth(width - 40);
                }}>
                {chartData.length > 0 ? (
                    <VictoryChart
                        width={chartWidth}
                        height={220}
                        domain={{ y: [0, yMax] }}
                        padding={{ top: 20, bottom: 30, left: 35, right: 20 }}>
                        <VictoryAxis
                            style={{
                                axis: { stroke: "#D1D5DB" },
                                tickLabels: { fill: "#888", fontSize: 12, padding: 10 },
                                grid: { stroke: "transparent" },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickValues={yTickValues}
                            style={{
                                axis: { stroke: "transparent" },
                                tickLabels: { fill: "#888", fontSize: 12, padding: 15 },
                                grid: { stroke: "#D1D5DB", strokeDasharray: "4, 4" },
                            }}
                        />
                        <VictoryArea
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { fill: "rgba(232, 124, 113, 0.15)" } }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{
                                data: { stroke: "rgba(232, 124, 113, 0.3)", strokeWidth: 14 },
                            }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { stroke: "#e87c71", strokeWidth: 2 } }}
                        />
                        <VictoryScatter
                            data={chartData}
                            size={6}
                            style={{ data: { fill: "#e87c71" } }}
                        />
                    </VictoryChart>
                ) : (
                    <View className="h-[220px] justify-center items-center">
                        <TextComponent className="text-center text-text-secondary">
                            기록이 없습니다.
                        </TextComponent>
                    </View>
                )}
            </Card>
        </View>
    );
}
