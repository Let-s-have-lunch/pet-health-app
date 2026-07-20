import { BUTTON_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { FlatList, Modal, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export interface SelectOptionType {
    label: string;
    value: string | number;
}

interface SelectProps {
    options: SelectOptionType[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    placeholder?: string;
    hasError?: boolean;
    size?: StyleSizeType;
    className?: string;
}

function Select({
    options,
    value,
    onSelect,
    placeholder = "선택해주세요",
    hasError,
    size = "medium",
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(option => option.value === value);

    return (
        <>
            <Pressable
                className={twMerge(
                    "w-full flex-row justify-between items-center",
                    "rounded-[28px] border bg-background-paper",
                    BUTTON_SIZE_STYLE[size],
                    hasError ? "border-error-main" : "border-primary-main",
                    className,
                )}
                onPress={() => setIsOpen(!isOpen)}>
                <TextComponent
                    className={selectedOption ? "text-text-default" : "text-secondary-main"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </TextComponent>
                <Ionicons name={"chevron-down"} size={16} className={"text-secondary-main"} />
            </Pressable>

            {isOpen && (
                <Modal
                    visible={isOpen}
                    transparent={true}
                    animationType={"fade"}
                    onRequestClose={() => setIsOpen(false)}>
                    <Pressable
                        className={"flex-1 justify-center items-center px-5"}
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        onPress={() => setIsOpen(false)}>
                        <Pressable
                            className="w-full max-w-sm bg-background-paper rounded-xl overflow-hidden max-h-[60%]"
                            onPress={event => {
                                event.stopPropagation();
                            }}>
                            <FlatList
                                data={options}
                                keyExtractor={item => String(item.value)}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            onSelect(item.value);
                                            setIsOpen(false);
                                        }}
                                        className={twMerge(
                                            "px-5 py-4 border-b border-divider flex-row justify-between",
                                            item.value === value && "bg-primary-main/10",
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-base",
                                                item.value === value
                                                    ? "text-primary-main font-bold"
                                                    : "text-text-default",
                                            )}>
                                            {item.label}
                                        </TextComponent>
                                        {item.value === value && (
                                            <Ionicons
                                                name={"checkmark"}
                                                size={20}
                                                className={"text-primary-main"}
                                            />
                                        )}
                                    </Pressable>
                                )}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

export default Select;
