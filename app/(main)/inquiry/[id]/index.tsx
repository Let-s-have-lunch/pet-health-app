import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";

function MyInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryUserItemType | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    return <TextComponent>detail</TextComponent>;
}

export default MyInquiryDetailPage;
