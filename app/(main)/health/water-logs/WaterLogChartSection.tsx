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

    // 💡 팀원분이 작성하신 로직을 그대로 유지했습니다. 안전하고 잘 짜여진 코드입니다.
    const { chartData, yMax, yTickValues, dateRangeText } = useMemo(() => {
        if (!historyData || historyData.length === 0) {
            return {
                chartData: [],
                yMax: 150,
                yTickValues: [0, 50, 100, 150],
                dateRangeText: "DATE -",
            };
        }

        const groupedByDate: Record<string, number> = {};

        historyData.forEach(log => {
            const dateStr = log.recordDate.split("T")[0];
            groupedByDate[dateStr] = (groupedByDate[dateStr] || 0) + log.amount;
        });

        const sortedDates = Object.keys(groupedByDate)
            .sort((a, b) => b.localeCompare(a))
            .slice(0, 7)
            .reverse();

        const data = sortedDates.map(date => {
            const parts = date.split("-");
            const label =
                parts.length >= 3 ? `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}` : date;
            return { x: label, y: groupedByDate[date] };
        });

        const dateText =
            data.length > 0 ? `DATE ${data[0].x} ~ ${data[data.length - 1].x}` : "DATE -";

        const actualMax = Math.max(...data.map(d => d.y), 0);
        const step = actualMax > 200 ? 100 : 50;
        const max = Math.max(150, Math.ceil(actualMax / step) * step);
        const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);

        return { chartData: data, yMax: max, yTickValues: ticks, dateRangeText: dateText };
    }, [historyData]);

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
                        {/* 🎨 색상을 파란색 계열로 수정했습니다. */}
                        <VictoryArea
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { fill: "rgba(169, 198, 217, 0.15)" } }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{
                                data: { stroke: "rgba(169, 198, 217, 0.3)", strokeWidth: 14 },
                            }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { stroke: "#A9C6D9", strokeWidth: 2 } }}
                        />
                        <VictoryScatter
                            data={chartData}
                            size={6}
                            style={{ data: { fill: "#A9C6D9" } }}
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
