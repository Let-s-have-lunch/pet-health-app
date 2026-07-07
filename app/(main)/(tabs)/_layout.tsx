import { useWindowDimensions, View } from "react-native";
import { Slot, useSegments } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";
import MainFooter from "@/components/layouts/main/MainFooter";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import MyPageHeader from "@/components/layouts/main/MyPageHeader";




function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const segments = useSegments();

    const isMyPage = segments[segments.length - 1] === "my";

    return (
        <View className={"flex-1"}>
            {isMyPage ? <MyPageHeader /> : <MainHeaderMobile />}
            <ContentContainer>
                <Slot />
            </ContentContainer>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
