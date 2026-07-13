import { TextInput, TextInputProps } from "react-native";
import { StyleSizeType, INPUT_SIZE_STYLE } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function Input({
    hasError,
    size = "medium",
    className,
    placeholderClassName,
    ...props
}: InputProps) {
    return (
        <TextInput
            className={twMerge(
                "w-full bg-background-paper rounded-[10px] border-2 text-text-secondary",
                INPUT_SIZE_STYLE[size],
                hasError
                    ? "border-error-main"
                    : "border-primary-main focus:border-primary-main",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}></TextInput>
    );
}

export default Input;
