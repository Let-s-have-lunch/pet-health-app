import { View } from "react-native";
import Button from "@/components/common/button/Button";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function MyInfoPage() {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuthStore();

    // 1:1문의, 공지사항, 자주묻는 질문 탭이 나오게 해주세요.
    return (
        <View className={twMerge("gap-4")}>
            <Button
                variant={"text"}
                showChevron={true}
                size={"large"}
                onPress={() => router.push("/notices")}>
                공지사항
            </Button>
            <Button
                variant={"text"}
                showChevron={true}
                size={"large"}
                onPress={() => router.push("/inquiry")}>
                1:1 문의
            </Button>
            <Button variant={"text"} showChevron={true} size={"large"}>
                자주 묻는 질문(FAQ)
            </Button>
            {isLoggedIn ? (
                <Button size={"large"} onPress={() => logout()} className={twMerge(["bg-primary-light"])}>
                    로그아웃
                </Button>
            ) : (
                <Button
                    variant={"contained"}
                    size={"large"}
                    onPress={() => router.push("/auth/login")}>
                    로그인
                </Button>
            )}
        </View>
    );
}

export default MyInfoPage;
