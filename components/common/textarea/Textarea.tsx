import { Platform, TextInput, TextInputProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
    textInputClassName?: string;
}

function TextArea({
    hasError,
    size = "medium",
    placeholderClassName,
    className,
    textInputClassName,
    ...props
}: TextAreaProps) {
    const getTextSizeClasses = () => {
        switch (size) {
            case "small":
                return `text-sm`;
            case "medium":
                return `text-lg`;
            case "large":
                return `text-xl`;
        }
    };

    return (
        <TextInput
            multiline={true}
            textAlignVertical={"top"}
            className={twMerge(
                ["w-full", "p-4", "min-h-32"],
                ["bg-background-paper", "rounded-[10px]", "border", "text-text-default"],
                getTextSizeClasses(),
                hasError ? "border-error-main" : "border-primary-main focus:border-primary-point",
                Platform.OS === "web" && "outline-none",
                className,
                textInputClassName,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default TextArea;
