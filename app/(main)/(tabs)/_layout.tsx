import { ScrollView, useWindowDimensions, View } from "react-native";
import { Slot, useSegments } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainFooter from "@/components/layouts/main/MainFooter";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import MyPageHeader from "@/components/layouts/main/MyPageHeader";
import PostPageHeader from "@/components/layouts/main/PostPageHeader";

function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const segments = useSegments();

    const currentSegment = segments[segments.length - 1];
    const isMyPage = currentSegment === "my";
    const isPostsPage = currentSegment === "posts";

    return (
        <View className={"flex-1 bg-background-default"}>
            {isPostsPage ? <PostPageHeader /> : isMyPage ? <MyPageHeader /> : <MainHeaderMobile />}
            <ScrollView>
                <ContentContainer >
                    <Slot />
                </ContentContainer>
            </ScrollView>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
