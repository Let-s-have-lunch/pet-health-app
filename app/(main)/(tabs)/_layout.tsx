import { ScrollView, View } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainFooter from "@/components/layouts/main/MainFooter";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import ProfileHeader from "@/components/layouts/main/ProfileHeader";

function MainLayout() {
    const pathname = usePathname();
    const router = useRouter();

    const isDiaryListPage = pathname.includes("/diary/list");
    const isProfilePage = pathname.includes("/profile");

    return (
        <View className={"flex-1 bg-background-default"}>
            {isDiaryListPage ? (
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
