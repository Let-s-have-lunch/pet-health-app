import { ScrollView, View } from "react-native";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainFooter from "@/components/layouts/main/MainFooter";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import MyPageHeader from "@/components/layouts/main/MyPageHeader";
import Title from "@/components/common/title/Title";

function MainLayout() {
    const segments = useSegments();
    const pathname = usePathname();
    const router = useRouter();

    const currentSegment = segments[segments.length - 1];
    const isMyPage = currentSegment === "my";
    const isDiaryListPage = pathname.includes("/diary/list");

    return (
        <View className={"flex-1 bg-background-default"}>
            {isMyPage ? (
                <MyPageHeader />
            ) : isDiaryListPage ? (
                <Title
                    title="일기 목록"
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="bg-white"
                />
            ) : (
                <MainHeaderMobile />
            )}
            <ScrollView>
                <ContentContainer>
                    <Slot />
                </ContentContainer>
            </ScrollView>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
