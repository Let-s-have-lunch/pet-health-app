import React from "react";
import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Edit2, Plus, Trash2 } from "lucide-react-native";
import { format } from "date-fns";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Badge from "@/components/common/badge/Badge";
import { WalkLog } from "@/types/walkLog";

interface Props {
    history: WalkLog[];
    onAddPress: () => void;
    onEditPress: (id: number) => void;
    onDeletePress: (id: number) => void;
}

function HistorySection({ history, onAddPress, onEditPress, onDeletePress }: Props) {
    return (
        <View className={twMerge("mb-6")}>
            <View className={twMerge("flex-row justify-between items-center mb-4")}>
                <TextComponent className={twMerge("text-lg font-bold")}>History</TextComponent>
                <Button size={"small"} onPress={onAddPress}>
                    <Plus size={20} color="#4A5568" />
                </Button>
            </View>

            <View className={twMerge("gap-3")}>
                {history.length > 0 ? (
                    history.map(log => (
                        <Card
                            key={log.id}
                            shadow={"sm"}
                            className={twMerge(
                                "elevation-1 flex-row justify-between items-center",
                            )}>
                            <View className={twMerge("flex-row items-center gap-3")}>
                                <TextComponent
                                    className={twMerge("text-base font-bold text-gray-800")}>
                                    {log.duration}분
                                </TextComponent>
                                <Badge color={"error"}>
                                    <TextComponent
                                        className={twMerge("text-error-point text-xs font-bold")}>
                                        완료
                                    </TextComponent>
                                </Badge>
                            </View>

                            <View className={twMerge("flex-row items-center gap-4")}>
                                <TextComponent className={twMerge("text-xs text-gray-400")}>
                                    {format(new Date(log.walkDate), "yy.MM.dd")}
                                </TextComponent>
                                <View className={twMerge("flex-row gap-2")}>
                                    <TouchableOpacity
                                        className={twMerge("p-1")}
                                        onPress={() => onEditPress(log.id)}>
                                        <Edit2 size={16} color="#718096" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={twMerge("p-1")}
                                        onPress={() => onDeletePress(log.id)}>
                                        <Trash2 size={16} color="#F56565" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    ))
                ) : (
                    <Card
                        shadow={"sm"}
                        className={twMerge("text-center text-gray-400 py-6 text-sm")}>
                        기록된 산책이 없습니다.
                    </Card>
                )}
            </View>
        </View>
    );
}

export default HistorySection;
