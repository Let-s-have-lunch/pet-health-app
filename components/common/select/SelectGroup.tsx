import Select, { SelectOptionType } from "@/components/common/select/Select";
import { StyleSizeType } from "@/types/style";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Label from "@/components/common/label/Label";

interface SelectGroupProps {
    label?: string;
    errorMessage?: string;
    options: SelectOptionType[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    placeholder?: string;
    wrap?: boolean;
    size?: StyleSizeType;
    className?: string;
}

function SelectGroup({
    label,
    errorMessage,
    options,
    value,
    onSelect,
    placeholder,
    wrap,
    size = "medium",
    className,
}: SelectGroupProps) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && <Label size={size}>{label}</Label>}
            <Select
                options={options}
                onSelect={onSelect}
                value={value}
                placeholder={placeholder}
                hasError={!!errorMessage}
                size={size}
            />
            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default SelectGroup;
