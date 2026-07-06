import { useWindowDimensions, View } from "react-native";
import { Slot } from "expo-router";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";
import MainFooter from "@/components/layouts/main/MainFooter";
import { twMerge } from "tailwind-merge";




function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;


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
            <MainHeaderMobile />

            <View
                className={twMerge([
                    "flex-1",
                    "w-full",
                    "max-w-7xl",
                    "p-4",
                    "md:py-8",
                    "self-center",
                ])}>
                <Slot />
            </View>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
