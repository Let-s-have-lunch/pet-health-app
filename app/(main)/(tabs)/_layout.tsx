import { ScrollView, View } from "react-native";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainFooter from "@/components/layouts/main/MainFooter";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import PostPageHeader from "@/components/layouts/main/PostPageHeader";
import Title from "@/components/common/title/Title";
import ProfileHeader from "@/components/layouts/main/ProfileHeader";

function MainLayout() {
    const segments = useSegments();
    const pathname = usePathname();
    const router = useRouter();

    const currentSegment = segments[segments.length - 1];
    const isPostsPage = currentSegment === "posts";
    const isDiaryListPage = pathname.includes("/diary/list");
    const isProfilePage = pathname.includes("/profile");

    return (
        <View className={"flex-1 bg-background-default"}>
            {isPostsPage ? (
                <PostPageHeader />
            ) : isDiaryListPage ? (
                <Title
                    title="일기 목록"
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="bg-white"
                />
            ) : isProfilePage ? (
                <ProfileHeader />
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
