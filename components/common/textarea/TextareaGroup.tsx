import { StyleSizeType } from "@/types/style";
import { TextInputProps, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Textarea from "@/components/common/textarea/Textarea";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Label from "@/components/common/label/Label";

interface TextareaGroupProps extends TextInputProps {
    label?: string;
    errorMessage?: string;
    wrap?: boolean;
    size?: StyleSizeType;
}

function TextareaGroup({
    label,
    errorMessage,
    wrap,
    className,
    size = "medium",
    ...props
}: TextareaGroupProps) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && <Label size={size}>{label}</Label>}
            <Textarea hasError={!!errorMessage} size={size} {...props} />
            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default TextareaGroup;
