import { ScrollView, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";




function CommunityPostListPage() {
    const router = useRouter();
    return (
        <ScrollView className={twMerge(["flex-1", "w-full"])}>
            <TextComponent className={twMerge(["font-medium", "text-left", "p-4"])}>
                반려동물의 정보를 같이 공유하는 커뮤니티 입니다.
            </TextComponent>
            <View className={twMerge(["p-0"])}>
                {/* 제목 줄 */}
                <View
                    className={twMerge(
                        ["hidden", "md:flex"],
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["w-16"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        번호
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1", "px-2"],
                            ["text-text-secondary", "font-bold"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-28"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        작성자
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-20"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        조회수
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["text-text-secondary", "font-bold", "text-center"],
                        )}>
                        작성일
                    </TextComponent>
                </View>
                {/* 내용 */}
                <View>
                    <View
                        className={twMerge(
                            ["flex-col", "md:flex-row", "md:items-center"],
                            ["px-4", "py-3", "md:px-4"],
                            ["transition-colors", "hover:bg-background-default"],
                            // isLast && ["border-b", "border-divider"],
                        )}>

                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default CommunityPostListPage;