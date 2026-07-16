import React from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Edit2, Plus, Trash2 } from "lucide-react-native";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Badge from "@/components/common/badge/Badge"; // 👈 Badge 컴포넌트 추가
import { WeightLog } from "@/types/weightLog";
import { format } from "date-fns";
import { StyleColorType } from "@/types/style"; // 👈 타입 추가

interface Props {
    history: WeightLog[];
    onAddPress: () => void;
    onEditPress: (log: WeightLog) => void;
    onDeletePress: (id: number) => void;
}

function WeightLogHistorySection({ history, onAddPress, onEditPress, onDeletePress }: Props) {
    return (
        <View className={twMerge("mb-6 mt-2")}>
            <View className={twMerge("flex-row justify-between items-center mb-4")}>
                <TextComponent className={twMerge("text-xl font-bold")}>몸무게 기록</TextComponent>
                <Button
                    size={"small"}
                    onPress={onAddPress}
                    className={"px-0 py-0 w-[48px] h-[48px]"}>
                    <Plus size={20} color="#4A5568" />
                </Button>
            </View>

            <View className={twMerge("gap-3")}>
                {history.length > 0 ? (
                    history.map((log, index) => {
                        // 이전 기록과 비교하여 증감량 계산
                        let calcChange = log.change;
                        if (calcChange === undefined || calcChange === null) {
                            if (index === history.length - 1) {
                                calcChange = 0;
                            } else {
                                calcChange = Number(
                                    (log.weight - history[index + 1].weight).toFixed(1),
                                );
                            }
                        }

                        // 💡 Badge 컴포넌트에 넘겨줄 Props 세팅
                        let badgeColor: StyleColorType | undefined = undefined;
                        let badgeTextClass = "text-gray-500 font-bold";
                        let badgeCustomClass = "bg-gray-100 border-transparent"; // 변화량 0일 때 기본 배경
                        let changeLabel = "0.0";

                        if (calcChange > 0) {
                            badgeColor = "error"; // bg-error-main (#F2C6C2)
                            badgeTextClass = "text-text-default"; // 포인트 텍스트 (#E95244)
                            badgeCustomClass = "";
                            changeLabel = `+${calcChange}`;
                        } else if (calcChange < 0) {
                            badgeColor = "success"; // bg-success-main (#A3D9C9)
                            badgeTextClass = "text-text-default"; // 포인트 텍스트 (#35B18C)
                            badgeCustomClass = "";
                            changeLabel = `${calcChange}`;
                        }

                        return (
                            <Card
                                key={log.id}
                                shadow={"sm"}
                                className={twMerge("elevation-1 flex-col p-4")}>
                                <View className={twMerge("flex-row justify-between items-center")}>
                                    <View className="flex-row items-center gap-3">
                                        <TextComponent
                                            className={twMerge("text-lg font-bold text-gray-800")}>
                                            {log.weight}kg
                                        </TextComponent>

                                        {/* 💡 둥글게 깎기 위해 rounded-full 적용! */}
                                        <Badge
                                            color={badgeColor}
                                            className={twMerge("rounded-full", badgeCustomClass)}
                                            textClasses={badgeTextClass}>
                                            {changeLabel}
                                        </Badge>
                                    </View>

                                    <View className={twMerge("flex-row items-center gap-4")}>
                                        <TextComponent className={twMerge("text-xs text-gray-400")}>
                                            {format(new Date(log.recordDate), "yy.MM.dd")}
                                        </TextComponent>
                                        <View className={twMerge("flex-row gap-2")}>
                                            <Button
                                                variant={"icon"}
                                                onPress={() => onEditPress(log)}>
                                                <Edit2 size={16} color="#718096" />
                                            </Button>
                                            <Button
                                                variant={"icon"}
                                                onPress={() => onDeletePress(log.id)}>
                                                <Trash2 size={16} color="#F56565" />
                                            </Button>
                                        </View>
                                    </View>
                                </View>

                                {log.memo && (
                                    <TextComponent className="text-sm text-gray-500 mt-2">
                                        {log.memo}
                                    </TextComponent>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <Card
                        shadow={"sm"}
                        className={twMerge("text-center text-gray-400 py-6 text-sm")}>
                        <TextComponent>기록된 몸무게가 없습니다.</TextComponent>
                    </Card>
                )}
            </View>
        </View>
    );
}

export default WeightLogHistorySection;
