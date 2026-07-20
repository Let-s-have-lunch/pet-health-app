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
import { WeightLog } from "@/types/weightLog";

interface Props {
    history: WeightLog[];
}

function WeightLogChartSection({ history }: Props) {
    const [chartWidth, setChartWidth] = useState(300);

    const { chartData, yMax, yMin, dateRangeText } = useMemo(() => {
        if (!history || history.length === 0) {
            return { chartData: [], yMax: 10, yMin: 0, dateRangeText: "DATE -", latestWeight: 0 };
        }

        const recentLogs = [...history].slice(0, 7).reverse();

        const data = recentLogs.map(item => {
            const dateParts = item.recordDate.split(/[-/]/);
            let label = item.recordDate;

            // "YYYY-MM-DD" 에서 월과 일만 추출
            if (dateParts.length >= 3) {
                const month = parseInt(dateParts[1], 10);
                const day = parseInt(dateParts[2], 10);
                label = `${month}/${day}`;
            }

            return { x: label, y: item.weight };
        });

        const weights = data.map(d => d.y);
        const actualMax = Math.max(...weights);
        const actualMin = Math.min(...weights);

        const yMax = Math.ceil(actualMax + 2);
        const yMin = Math.max(0, Math.floor(actualMin - 2));

        const labels = data.map(d => d.x);
        const dateRangeText =
            labels.length === 1
                ? `DATE ${labels[0]}`
                : `DATE ${labels[0]} ~ ${labels[labels.length - 1]}`;

        const latestWeight = recentLogs.length > 0 ? recentLogs[recentLogs.length - 1].weight : 0;

        return { chartData: data, yMax, yMin, dateRangeText, latestWeight };
    }, [history]);

    return (
        <View className={twMerge("mb-10")}>
            <View className={twMerge("w-full mb-3")}>
                <View>
                    <TextComponent className={twMerge("text-[20px] font-bold")}>
                        몸무게 변화
                    </TextComponent>
                    <TextComponent className={twMerge("text-[12px] text-text-secondary mt-1")}>
                        {dateRangeText}
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
                {chartData.length > 0 ? (
                    <VictoryChart
                        width={chartWidth}
                        height={220}
                        domain={{ y: [yMin, yMax] }}
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
                            style={{
                                axis: { stroke: "transparent" },
                                tickLabels: { fill: "#888", fontSize: 12, padding: 15 },
                                grid: { stroke: "#D1D5DB", strokeDasharray: "4, 4" },
                            }}
                        />
                        <VictoryArea
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { fill: "rgba(233, 82, 68, 0.15)" } }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { stroke: "rgba(233, 82, 68, 0.3)", strokeWidth: 14 } }}
                        />
                        <VictoryLine
                            data={chartData}
                            interpolation="catmullRom"
                            style={{ data: { stroke: "#E95244", strokeWidth: 2 } }}
                        />
                        <VictoryScatter
                            data={chartData}
                            size={6}
                            style={{ data: { fill: "#E95244" } }}
                        />
                    </VictoryChart>
                ) : (
                    <View className="items-center justify-center py-10 h-[220px]">
                        <TextComponent className="text-sm text-text-secondary">
                            최근 몸무게 기록이 없습니다.
                        </TextComponent>
                    </View>
                )}
            </Card>
        </View>
    );
}

export default WeightLogChartSection;
