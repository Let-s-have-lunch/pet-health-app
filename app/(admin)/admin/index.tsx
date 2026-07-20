import { Alert, Platform, ScrollView, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { PostListItemType } from "@/types/post";
import { InquiryUserItemType } from "@/types/inquiry";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import adminDashboardApi from "@/api/admin/adminDashboardApi";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Badge from "@/components/common/badge/Badge";
import { Feather } from "@expo/vector-icons";

function AdminDashboard() {
    const router = useRouter();
    const [summary, setSummary] = useState<{
        users: User[];
        posts: PostListItemType[];
        inquiries: InquiryUserItemType[];
    } | null>(null);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const result = await adminDashboardApi.fetchDashboardSummary();
                setSummary(result);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("관리자 페이지를 조회하는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "관리자 페이지를 조회하는데 실패했습니다.");
                }
            }
        };
        loadSummary().then(() => {});
    }, []);

    if (!summary) return null;

    return (
        <ScrollView className={twMerge("flex-1", "w-full")}>
            <View className={"gap-8"}>
                <View>
                    <TextComponent className={"font-bold text-lg mb-2"}>
                        최근 가입한 사용자 목록
                    </TextComponent>
                    <Card className={"overflow-hidden p-0"}>
                        <View
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3"],
                                [
                                    "border-divider",
                                    "border-b",
                                    "bg-primary-main",
                                    "border-primary-main",
                                    "rounded-t-xl",
                                ],
                            )}>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-16", "pl-2"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                번호
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-24", "flex-1", "md:flex-none"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                닉네임
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["flex-1", "hidden", "md:flex"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                이메일
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-28"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                가입일
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-24", "pl-5"],
                                    ["font-bold", "text-text-secondary", "text-right"],
                                )}>
                                생일
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-20"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                관리
                            </TextComponent>
                        </View>

                        <View className={"flex-1"}>
                            {summary.users.length === 0 && (
                                <View
                                    className={twMerge("py-10", "justify-center", "items-center")}>
                                    <TextComponent className={"text-text-secondary"}>
                                        아직 가입한 사용자가 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {summary.users.map((item, index) => (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        "flex-row",
                                        "items-center",
                                        "px-4",
                                        "py-3",
                                        "transition-all",
                                        "border-b",
                                        "border-primary-light",
                                        index === summary.users.length - 1 && [
                                            "rounded-b-xl",
                                            "border-b-0",
                                        ],
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-16", "pl-3"],
                                            ["text-center", "text-text-secondary"],
                                        )}>
                                        {item.id}
                                    </TextComponent>
                                    <TextComponent
                                        numberOfLines={1}
                                        className={twMerge(
                                            ["w-24","flex-1", "md:flex-none"],
                                            ["font-bold", "text-text-secondary", "px-2"],
                                        )}>
                                        {item.nickname}
                                    </TextComponent>
                                    <TextComponent
                                        numberOfLines={1}
                                        className={twMerge(
                                            ["flex-1", "hidden", "md:flex"],
                                            ["font-bold", "text-text-secondary", "px-2"],
                                        )}>
                                        {item.email}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["w-28"],
                                            ["font-bold", "text-text-secondary", "text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-24"],
                                            ["font-bold", "text-text-secondary", "text-right"],
                                        )}>
                                        {item.birthdate?.substring(0, 10) || "-"}
                                    </TextComponent>
                                    <View
                                        className={twMerge([
                                            "w-20",
                                            "flex-row",
                                            "justify-center",
                                            "items-center",
                                            "gap-3",
                                        ])}>
                                        <Pressable
                                            className={"p-1"}
                                            onPress={() => router.push(`/admin/users/${item.id}`)}>
                                            <Feather
                                                name={"edit-2"}
                                                size={18}
                                                className={
                                                    "text-text-secondary hover:text-primary-main transition-all"
                                                }
                                            />
                                        </Pressable>
                                        <Pressable
                                            className={"p-1"}
                                            onPress={() => {
                                                Alert.alert(
                                                    "알림",
                                                    "회원 관리 페이지에서 삭제를 진행해주세요.",
                                                );
                                            }}>
                                            <Feather
                                                name={"trash-2"}
                                                size={18}
                                                className={"text-error-main transition-all"}
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card>
                </View>

                <View>
                    <TextComponent className={"font-bold text-lg mb-2"}>
                        최근 등록된 게시글 목록
                    </TextComponent>
                    <Card className={"overflow-hidden p-0"}>
                        <View
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3"],
                                [
                                    "border-divider",
                                    "border-b",
                                    "bg-primary-main",
                                    "border-primary-main",
                                    "rounded-t-xl",
                                ],
                            )}>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-16", "pl-2"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                번호
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-28"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                작성자
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["flex-1"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                제목
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-28"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                작성일
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-24"],
                                    ["font-bold", "text-text-secondary", "text-right", "pl-4"],
                                )}>
                                조회수
                            </TextComponent>
                        </View>

                        <View className={"flex-1"}>
                            {summary.posts.length === 0 && (
                                <View
                                    className={twMerge("py-10", "justify-center", "items-center")}>
                                    <TextComponent className={"text-text-secondary"}>
                                        아직 작성된 게시글이 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {summary.posts.map((item, index) => (
                                <Pressable
                                    key={item.id}
                                    className={twMerge(
                                        "flex-row",
                                        "items-center",
                                        "px-4",
                                        "py-3",
                                        "transition-all",
                                        "border-b",
                                        "border-primary-light",
                                        "hover:bg-primary-light",
                                        index === summary.posts.length - 1 && [
                                            "rounded-b-xl",
                                            "border-b-0",
                                        ],
                                    )}
                                >
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-16", "pl-3"],
                                            ["text-center", "text-text-secondary"],
                                        )}>
                                        {item.id}
                                    </TextComponent>

                                    <View
                                        className={twMerge([
                                            "w-28",
                                            "px-2",
                                            "justify-center",
                                            "flex-col",
                                        ])}>
                                        <TextComponent
                                            numberOfLines={1}
                                            className={"font-bold text-text-secondary"}>
                                            {item.user.nickname}
                                        </TextComponent>
                                        <TextComponent
                                            numberOfLines={1}
                                            className={
                                                "text-xs text-text-secondary font-normal mt-0.5"
                                            }>
                                            {item.user.email}
                                        </TextComponent>
                                    </View>

                                    <TextComponent
                                        numberOfLines={1}
                                        className={twMerge(
                                            ["flex-1"],
                                            ["font-bold", "text-text-secondary", "px-2"],
                                        )}>
                                        {item.title}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["w-28"],
                                            ["font-bold", "text-text-secondary", "text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-24", "pl-10"],
                                            ["font-bold", "text-text-secondary", "text-right"],
                                        )}>
                                        {item.views}
                                    </TextComponent>
                                </Pressable>
                            ))}
                        </View>
                    </Card>
                </View>

                <View>
                    <TextComponent className={"font-bold text-lg mb-2"}>
                        최근 등록된 문의글 목록
                    </TextComponent>
                    <Card className={"overflow-hidden p-0"}>
                        <View
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3"],
                                [
                                    "border-divider",
                                    "border-b",
                                    "bg-primary-main",
                                    "border-primary-main",
                                    "rounded-t-xl",
                                ],
                            )}>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-16", "pl-2"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                번호
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-28"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                작성자
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["flex-1"],
                                    ["font-bold", "text-text-secondary", "px-2"],
                                )}>
                                제목
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-28"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                작성일
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-24", "pl-3"],
                                    ["font-bold", "text-text-secondary", "text-right"],
                                )}>
                                답변상태
                            </TextComponent>
                        </View>

                        <View className={"flex-1"}>
                            {summary.inquiries.length === 0 && (
                                <View
                                    className={twMerge("py-10", "justify-center", "items-center")}>
                                    <TextComponent className={"text-text-secondary"}>
                                        아직 작성된 문의글이 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {summary.inquiries.map((item, index) => (
                                <Pressable
                                    key={item.id}
                                    className={twMerge(
                                        "flex-row",
                                        "items-center",
                                        "px-4",
                                        "py-3",
                                        "transition-all",
                                        "border-b",
                                        "border-primary-light",
                                        "hover:bg-primary-light",
                                        index === summary.inquiries.length - 1 && [
                                            "rounded-b-xl",
                                            "border-b-0",
                                        ],
                                    )}
                                    onPress={() => router.push(`/admin/inquiries/${item.id}`)}>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-16", "pl-3"],
                                            ["text-center", "text-text-secondary"],
                                        )}>
                                        {item.id}
                                    </TextComponent>

                                    <View
                                        className={twMerge([
                                            "w-28",
                                            "px-2",
                                            "justify-center",
                                            "flex-col",
                                        ])}>
                                        <TextComponent
                                            numberOfLines={1}
                                            className={"font-bold text-text-secondary"}>
                                            {item.user.nickname}
                                        </TextComponent>
                                        <TextComponent
                                            numberOfLines={1}
                                            className={
                                                "text-xs text-text-secondary font-normal mt-0.5"
                                            }>
                                            {item.user.email}
                                        </TextComponent>
                                    </View>

                                    <TextComponent
                                        numberOfLines={1}
                                        className={twMerge(
                                            ["flex-1"],
                                            ["font-bold", "text-text-secondary", "px-2"],
                                        )}>
                                        {item.title}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            ["w-28"],
                                            ["font-bold", "text-text-secondary", "text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                    <View
                                        className={twMerge([
                                            "hidden",
                                            "md:flex",
                                            "w-24",
                                            "items-end",
                                            "justify-center",
                                            "pr-4",
                                        ])}>
                                        <Badge color={item.answer ? "success" : "info"}>
                                            {item.answer ? "답변 완료" : "답변 대기"}
                                        </Badge>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </Card>
                </View>
            </View>
        </ScrollView>
    );
}

export default AdminDashboard;
