import Title from "@/components/common/title/Title";
import { router } from "expo-router";

function ProfileHeader() {
    return (
        <Title
            title={"나의 정보"}
            showBackButton={true}
            onBackPress={() => router.back()}
            className={"bg-background-default"}
        />
    );
}

export default ProfileHeader;