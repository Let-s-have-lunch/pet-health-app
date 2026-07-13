// ✅ 1. React 임포트 추가!
import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import { View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import {
    VictoryArea,
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryScatter,
} from "victory-native";
import { WalkLogStats } from "@/types/walkLog";

interface Props {
    stats: WalkLogStats | null;
    last7Days: string[];
    displayDateRange: string;
}

function WalkLogChartSection({ stats, last7Days, displayDateRange }: Props) {
    const [chartWidth, setChartWidth] = useState(300);

    const { chartData, yMax, yTickValues } = useMemo(() => {
        const data = last7Days.map(dateStr => {
            const [, month, day] = dateStr.split("-");
            const label = `${parseInt(month, 10)}/${parseInt(day, 10)}`;
            // ✅ 2. graphData 뒤에도 ?를 붙여서 안전하게 접근
            const found = stats?.graphData?.find(d => d.date?.startsWith(dateStr));
            return { x: label, y: found ? found.duration : 0 };
        });

        const actualMax = Math.max(...data.map(d => d.y), 0);
        const max = Math.max(150, Math.ceil(actualMax / 30) * 30); // 최소 150분 보장
        const ticks = Array.from({ length: max / 30 + 1 }, (_, i) => i * 30);

        return { chartData: data, yMax: max, yTickValues: ticks };
    }, [stats, last7Days]);

    return (
        <View className={twMerge("mb-10")}>
            <View className={twMerge("w-full flex-row justify-between items-center mb-3")}>
                <View>
                    <TextComponent className={twMerge("text-[20px] font-bold")}>
                        최근 일주일 통계
                    </TextComponent>
                    <TextComponent className={twMerge("text-[12px] text-text-secondary mt-1")}>
                        DATE {displayDateRange}
                    </TextComponent>
                </View>
                <View className={twMerge("items-end")}>
                    {/* ✅ 3. summary 뒤에도 ?를 붙여서 에러 방지 */}
                    <TextComponent className={twMerge("text-sm font-bold text-[#e87c71]")}>
                        총 {stats?.summary?.totalWalks || 0}회
                    </TextComponent>
                    <TextComponent
                        className={twMerge("text-sm font-bold text-success-contrast mt-1")}>
                        총 {stats?.summary?.totalDuration || 0}분
                    </TextComponent>
                </View>
            </View>
            <Card
                shadow={"sm"}
                className={twMerge("w-full items-center")}
                onLayout={event => {
                    const { width } = event.nativeEvent.layout;
                    setChartWidth(width - 40);
                }}>
                {/* 차트 영역은 동일하게 유지 */}
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
                        style={{ data: { stroke: "rgba(232, 124, 113, 0.3)", strokeWidth: 14 } }}
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
            </Card>
        </View>
    );
}

export default WalkLogChartSection;
