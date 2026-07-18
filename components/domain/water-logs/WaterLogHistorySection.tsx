import { WaterIntakeLog } from "@/types/waterIntakeLog";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import { Edit2, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleColorType } from "@/types/style";
import Card from "@/components/common/card/Card";
import Badge from "@/components/common/badge/Badge";
import { format } from "date-fns";

interface Props {
    history: WaterIntakeLog[];
    onAddPress: () => void;
    onEditPress: (log: WaterIntakeLog) => void;
    onDeletePress: (id: number) => void;
}

function WaterLogHistorySection({ history, onAddPress, onEditPress, onDeletePress}: Props) {
    return (
        <View className={twMerge("mb-6 mt-2")}>
            <View className={twMerge("flex-row justify-between items-center mb-4")}>
                <TextComponent className={twMerge("text-xl font-bold")}>음수량 기록</TextComponent>
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
                        let calcChange = 0;

                        if (index < history.length - 1) {
                            calcChange = log.amount - history[index + 1].amount;
                        }

                        let badgeColor: StyleColorType | undefined = undefined;

                        let changeLabel = index === history.length - 1 ? "시작" : "0";

                        if (calcChange > 0) {
                            badgeColor = "success";
                            changeLabel = `+${calcChange}`;
                        } else if (calcChange < 0) {
                            badgeColor = "error";
                            changeLabel = `${calcChange}`;
                        } else if (calcChange === 0) {
                            badgeColor = "warning";
                            changeLabel = `${changeLabel}`;
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
                                            {log.amount}ml
                                        </TextComponent>

                                        <Badge color={badgeColor}>{changeLabel}</Badge>
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
                        <TextComponent>기록된 음수량이 없습니다.</TextComponent>
                    </Card>
                )}
            </View>
        </View>
    );
}

export default WaterLogHistorySection;