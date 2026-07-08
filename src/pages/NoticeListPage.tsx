import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router"; // 💡 핵심: expo-router 사용
import { noticeApi } from "../../api/user/noticeApi";
import { PostContainer, PostTitle } from "../../components/post/post.style";
import Button from "../../components/common/button/Button"; // 네이티브용 버튼으로 가정

function NoticeListPage() {
    const router = useRouter();
    const params = useLocalSearchParams(); // 💡 URL 쿼리 파라미터 가져오기

    // params.page가 undefined일 수 있으므로 처리
    const page = Number(params.page) || 1;
    const keyword = (params.keyword as string) || "";

    const [list, setList] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const size = 10;

    const loadList = useCallback(async (currentPage: number) => {
        setLoading(true);
        try {
            const data = await noticeApi.getNoticeList(currentPage, size);
            // 정렬 로직 (네이티브에서도 동일)
            const sortedList = [...data.list].sort(
                (a, b) => Number(b.isPinned) - Number(a.isPinned),
            );
            setList(sortedList);
            setTotal(data.total);
        } catch (error) {
            console.error("목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadList(page);
    }, [loadList, page]);

    // 검색 시 URL 파라미터 변경
    const handleSearch = (text: string) => {
        router.push({
            pathname: "/notices" as any,
            params: { page: "1", keyword: text },
        });
    };

    const handleDelete = async (id: number) => {
        // 네이티브에선 window.confirm 대신 Alert 사용
        try {
            await noticeApi.deleteNotice(id);
            loadList(page);
        } catch (error) {
            console.error("삭제 실패");
        }
    };

    return (
        <PostContainer>
            <PostTitle>공지사항 ({total}건)</PostTitle>

            <TextInput
                placeholder="제목 검색..."
                onChangeText={handleSearch}
                defaultValue={keyword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={list}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 }}>
                            <Text style={{ flex: 1 }}>{item.id}</Text>
                            <Link href={`/notice/${item.id}`as any} style={{ flex: 3 }}>
                                <Text>{item.title}</Text>
                            </Link>
                            <Button onPress={() => handleDelete(item.id)}>삭제</Button>
                        </View>
                    )}
                />
            )}
        </PostContainer>
    );
}

export default NoticeListPage;
