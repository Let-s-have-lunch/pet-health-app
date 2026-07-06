import React from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface AuthContainerProps extends ViewProps {
    children: React.ReactNode;
}

function FormContainer({ children, className, ...props }: AuthContainerProps) {
    return (
        <View
            // flex-1: 화면 꽉 채우기, bg-white: 하얀 배경, px-5: 좌우 기본 패딩(20px)
            className={twMerge("flex-1 bg-background-paper p-[25px]", className)}
            {...props}>
            {children}
        </View>
    );
}

export default FormContainer;
