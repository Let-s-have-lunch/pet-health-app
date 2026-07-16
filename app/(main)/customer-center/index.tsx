import React from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 💡 직접 만드신 커스텀 컴포넌트들을 임포트합니다.
import Title from "@/components/common/title/Title";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import FormContainer from "@/components/layouts/common/FormContainer";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";

export default function CustomerServiceScreen() {
    const router = useRouter();

    const mockCompanyInfo = {
        name: "(주)가상컴퍼니",
        ceo: "홍길동",
        address: "서울특별시 가상구 더미대로 123길 45",
        email: "dummy_test@email.com",
        registrationNumber: "123-45-67890",
        reportNumber: "2026-가상구-0000",
    };

    return (
        <View className="flex-1 bg-background-default">
            {/* 1. 커스텀 Title 컴포넌트 적용 */}
            <Title
                title="고객센터"
                showBackButton={true}
                onBackPress={() => router.push("/home")}
                className="bg-background-paper"
            />

            <ScrollView>
                {/* 2. MyProfilePage와 동일한 레이아웃 컨테이너 구조 적용 */}
                <ContentContainer className="p-0">
                    <FormContainer className="bg-background-default">
                        {/* 3. 메인 콘텐츠: 커스텀 Card 컴포넌트 활용 */}
                        <Card className="flex flex-col items-center py-10 mb-6 shadow-sm">
                            <View className="w-16 h-16 bg-primary-main rounded-full items-center justify-center mb-6">
                                <Ionicons name="chatbubble-ellipses" size={30} color="white" />
                            </View>

                            <TextComponent className="text-lg font-bold mb-3">
                                무엇을 도와드릴까요?
                            </TextComponent>

                            <TextComponent className="text-sm text-text-secondary text-center leading-6">
                                문의사항이 있으실 경우,{"\n"}
                                카카오채널 "펫헬쓰앱"으로 남겨주시면{"\n"}
                                빠르게 답변드리겠습니다.
                            </TextComponent>
                            {/* 💡 (요청 반영) 개발 단계이므로 카카오채널 이동 버튼은 제거했습니다. */}
                        </Card>

                        {/* 4. 푸터 정보: 커스텀 Card 컴포넌트 활용 */}
                        <Card className="border border-divider bg-background-paper pt-6 pb-6">
                            <TextComponent className="text-xs text-text-secondary leading-[22px]">
                                상호 : {mockCompanyInfo.name} | 대표자 : {mockCompanyInfo.ceo}
                                {"\n"}
                                주소 : {mockCompanyInfo.address}
                                {"\n"}
                                이메일 : {mockCompanyInfo.email}
                                {"\n"}
                                사업자등록번호 : {mockCompanyInfo.registrationNumber}
                                {"\n"}
                                통신판매업 신고번호 : {mockCompanyInfo.reportNumber}
                            </TextComponent>
                        </Card>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}
