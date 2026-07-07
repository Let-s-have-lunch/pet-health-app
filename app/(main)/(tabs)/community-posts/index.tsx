import { ScrollView } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";




function CommunityPostListPage() {
    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <TextComponent className={twMerge(["font-medium", "text-left", "p-4"])}>
                반려동물의 정보를 같이 공유하는 커뮤니티 입니다.
            </TextComponent>
        </ScrollView>
    )
}

export default CommunityPostListPage;