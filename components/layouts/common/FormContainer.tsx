import React from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface AuthContainerProps extends ViewProps {
    children: React.ReactNode;
}

function FormContainer({ children, className, ...props }: AuthContainerProps) {
    return (
        <View

            className={twMerge("flex-1 bg-background-paper p-[25px]", className)}
            {...props}>
            {children}
        </View>
    );
}

export default FormContainer;
