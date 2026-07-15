import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomerServiceScreen() {
    const router = useRouter();

    // 1. 목업 데이터 (완전 가상 정보로 변경 완료)
    const mockCompanyInfo = {
        name: "(주)가상컴퍼니",
        ceo: "홍길동",
        address: "서울특별시 가상구 더미대로 123길 45",
        email: "dummy_test@email.com",
        registrationNumber: "123-45-67890",
        reportNumber: "2026-가상구-0000"
    };

    const openKakaoChannel = () => {
        // 실제 카카오채널 링크로 변경하세요
        Linking.openURL('https://pf.kakao.com/_xxxxxx');
    };

    return (
        <View className="flex-1 bg-[var(--bg-default)]">
            {/* 헤더 */}
            <View className="flex-row items-center justify-between px-4 py-4 bg-[var(--bg-default)]">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <Ionicons name="chevron-back" size={28} color="#2C2C2C" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-[var(--text-default)]">고객센터</Text>
                <View className="w-9" />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
                {/* 메인 콘텐츠 카드 */}
                <View className="bg-[var(--bg-paper)] rounded-3xl p-8 items-center border border-[var(--divider)] shadow-sm">
                    <View className="w-16 h-16 bg-[var(--primary-main)] rounded-full items-center justify-center mb-6">
                        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
                    </View>

                    <Text className="text-lg font-bold text-[var(--text-default)] mb-3">무엇을 도와드릴까요?</Text>
                    <Text className="text-sm text-[var(--text-secondary)] text-center leading-6 mb-8">
                        문의사항이 있으실 경우,{'\n'}
                        카카오채널 "펫헬쓰앱"으로 남겨주시면{'\n'}
                        빠르게 답변드리겠습니다.
                    </Text>

                    <TouchableOpacity
                        onPress={openKakaoChannel}
                        className="bg-[var(--primary-main)] px-8 py-4 rounded-2xl w-full items-center"
                    >
                        <Text className="text-[var(--primary-contrast)] font-bold text-base">카카오채널 문의하기</Text>
                    </TouchableOpacity>
                </View>

                {/* 푸터 정보 (목업 데이터 바인딩) */}
                <View className="mt-8 p-6 rounded-3xl border border-[var(--divider)] bg-[var(--bg-paper)]">
                    <Text className="text-xs text-[var(--text-secondary)] leading-[22px]">
                        상호 : {mockCompanyInfo.name} | 대표자 : {mockCompanyInfo.ceo}{'\n'}
                        주소 : {mockCompanyInfo.address}{'\n'}
                        이메일 : {mockCompanyInfo.email}{'\n'}
                        사업자등록번호 : {mockCompanyInfo.registrationNumber}{'\n'}
                        통신판매업 신고번호 : {mockCompanyInfo.reportNumber}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

