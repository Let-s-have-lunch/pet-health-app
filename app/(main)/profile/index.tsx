import ContentContainer from "@/components/layouts/common/ContentContainer";
import Title from "@/components/common/title/Title";
import { useRouter } from "expo-router";
import FormContainer from "@/components/layouts/common/FormContainer";
import Button from "@/components/common/button/Button";
import { View, Image, Pressable, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import petApi from "@/api/user/petApi";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Pet } from "@/types/pet";

function MyProfilePage() {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);

    const { user, logout } = useAuthStore();

    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const getImageUrl = (path?: string | null) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    useEffect(() => {
        const loadPets = async () => {
            try {
                const result = await petApi.getMyPetList();
                setPets(result);
            } catch (error) {
                console.log(error);
            }
        };
        loadPets().then(() => {});
    }, []);

    return (
        <View className={"flex-1 bg-background-default"}>
            <Title
                title={"나의 정보"}
                showBackButton={true}
                onBackPress={() => router.back()}
                className={"bg-background-paper"}
            />
            <ScrollView>
                <ContentContainer className={"p-0"}>
                    <FormContainer className={"bg-background-default"}>
                        <Card className="flex flex-col items-center py-8 mb-6">
                            <View className="w-20 h-20 bg-success-main rounded-full mb-3 flex items-center justify-center">
                                <TextComponent className="text-3xl font-bold text-gray-500">
                                    {user?.nickname ? user.nickname.charAt(0) : "U"}
                                </TextComponent>
                            </View>

                            <View className="flex-row items-center justify-center mb-1">
                                <TextComponent className="text-xl font-bold mr-2">
                                    {user?.nickname}
                                </TextComponent>

                                <Pressable onPress={() => router.push("/profile/edit")}>
                                    <TextComponent className="text-lg">✏️</TextComponent>
                                </Pressable>
                            </View>

                            <TextComponent className="text-sm text-gray-500">
                                {user?.email}
                            </TextComponent>
                        </Card>

                        <TextComponent className="font-bold text-xl mb-3">
                            등록된 반려동물
                        </TextComponent>

                        <Card className={"overflow-hidden"}>
                            {pets.length === 0 ? (
                                <TextComponent className="text-center text-gray-500 py-4">
                                    등록된 반려동물이 없습니다.
                                </TextComponent>
                            ) : (
                                pets.map((pet, index) => {
                                    const isLast = index === pets.length - 1;

                                    return (
                                        <View
                                            key={pet.id}
                                            className={twMerge(
                                                "flex-row items-center",
                                                !isLast && "mb-4 pb-4 border-b border-divider",
                                            )}>
                                            {pet.profileImage ? (
                                                <Image
                                                    source={{
                                                        uri: getImageUrl(pet.profileImage) || "",
                                                    }}
                                                    className="w-14 h-14 rounded-full mr-4 bg-gray-200"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-14 h-14 rounded-full mr-4 bg-success-main" />
                                            )}

                                            <TextComponent className="text-base font-medium">
                                                {pet.name}
                                            </TextComponent>
                                        </View>
                                    );
                                })
                            )}
                        </Card>

                        <View className={twMerge("md:flex-row md:items-center mt-9 gap-3 mb-10")}>
                            <Button
                                wrap={true}
                                onPress={() => router.push("/profile/password")}
                                variant={"text"}
                                size={"large"}>
                                비밀번호 수정
                            </Button>
                            <Button
                                wrap={true}
                                size={"large"}
                                onPress={() => logout()}
                                variant={"text"}>
                                로그아웃
                            </Button>

                            <View className="flex-none mt-8 md:mt-0 md:flex-1">
                                <Button
                                    wrap={true}
                                    onPress={() => router.push("/profile/withdraw")}
                                    variant={"text"}
                                    size={"large"}
                                    textColor={"text-text-secondary"}>
                                    회원탈퇴
                                </Button>
                            </View>
                        </View>
                    </FormContainer>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}

export default MyProfilePage;
