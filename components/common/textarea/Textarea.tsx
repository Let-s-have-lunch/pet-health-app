import { Platform, TextInput, TextInputProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function TextArea({
    hasError,
    size = "medium",
    placeholderClassName,
    className,
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

    // textAlignVertical : 안드로이드에서 TextInput에 입력하는 텍스트는 y축 중앙에 정렬됨
    return (
        <TextInput
            multiline={true}
            textAlignVertical={"top"}
            className={twMerge(
                ["w-full", "p-4", "min-h-32"],
                ["bg-background-paper", "rounded-[10px]", "border-2", "text-text-secondary"],
                getTextSizeClasses(),
                hasError ? "border-error-main" : "border-primary-main focus:border-primary-point",
                Platform.OS === "web" && "outline-none",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default TextArea;
