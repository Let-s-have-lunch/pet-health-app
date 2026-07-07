import { useWindowDimensions, View } from "react-native";
import { Slot, useSegments } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";
import MainFooter from "@/components/layouts/main/MainFooter";
import { twMerge } from "tailwind-merge";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import MyPageHeader from "@/components/layouts/main/MyPageHeader";




function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const segments = useSegments();

    const isMyPage = segments[segments.length - 1] === "my";


    // const [list, setList] = useState<Category[]>([]);

    // useEffect(() => {
    //     const loadCategories = async () => {
    //         try {
    //             const result = await categoryApi.getCategoryList();
    //             setList(result);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     loadCategories().then(() => {});
    // }, []);

    // flex 안에서 배치를 바꿔주기 위해서는 부모메데 justify-content, align-items 를 사용했는데
    // 그렇다면 자식은 결코 위치를 바꿀 수 없는가?  그것은 아니다.
    //

    return (
        <View className={"flex-1"}>
            {isMyPage ? <MyPageHeader /> : <MainHeaderMobile />}
            <ContentContainer>
                <Slot />
            </ContentContainer>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
