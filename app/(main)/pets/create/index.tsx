import Title from "@/components/common/title/Title";
import { useRouter } from "expo-router";

function PetCreatePage() {
    const router = useRouter();
    return (
        <>
            <Title title={"반려동물 등록"} showBackButton={true} onBackPress={() => router.push("/")}></Title>
        </>
    );
}

export default PetCreatePage;