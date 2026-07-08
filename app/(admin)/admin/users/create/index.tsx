import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@/types/user";
import {
    AdminCreateUserInputType,
    adminCreateUserSchema,
} from "@/schemas/user/adminCreateUserSchema";
import adminUserApi from "@/api/admin/adminUserApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import { isAxiosError } from "axios";
import InputGroup from "@/components/common/input/InputGroup";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import SelectGroup from "@/components/common/select/SelectGroup";

function AdminCreateUserPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminCreateUserSchema),
        mode: "onTouched",
        defaultValues: {
            password: "",
            nickname: "",
            email: "",
            birthdate: "",
            role: Role.USER,
        },
    });

    const onSubmit = async (data: AdminCreateUserInputType) => {
        try {
            const { birthdate, ...prevInput } = data;
            let formattedBirthdate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);

                formattedBirthdate = `${year}-${month}-${day}`;
            } else {
                formattedBirthdate = undefined;
            }

            await adminUserApi.createUser({
                ...prevInput,
                birthdate: formattedBirthdate,
            });

            if (Platform.OS === "web") {
                alert("유저가 성공적으로 생성되었습니다.");
                router.push("/admin/users");
            } else {
                Alert.alert("생성 완료", "유저가 성공적으로 생성되었습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/users") },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 409) {
                   if (errorMessage.includes("이메일")) {
                        setError("email", { message: errorMessage });
                    } else if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
                    return;
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"유저 생성"}
                description={"새로운 관리자 또는 일반 유저를 등록합니다."}
                className={"mt-[-25px] px-0 mb-6"}
            />
            <ScrollView className={"flex-1"}>
                <Card>
                    <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                        계정정보
                    </TextComponent>

                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"password"}
                                    label={"비밀번호"}
                                    placeholder={"6자 이상 입력해주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    secureTextEntry={true}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"email"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    id={"email"}
                                    label={"이메일"}
                                    placeholder={"이메일을 입력해주세요."}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            );
                        }}
                    />

                    <View className={twMerge("border-b", "border-divider", "my-6")}></View>

                    <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                        개인 정보
                    </TextComponent>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name={"nickname"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        wrap={true}
                                        id={"nickname"}
                                        label={"닉네임"}
                                        placeholder={"서비스에서 사용할 닉네임 2~10자"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.nickname?.message}
                                    />
                                );
                            }}
                        />
                    </View>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name={"birthdate"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        wrap={true}
                                        id={"birthdate"}
                                        label={"생년월일 (선택)"}
                                        placeholder={"YYYYMMDD (예: 19951225)"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType={"number-pad"}
                                        maxLength={8}
                                        errorMessage={errors.birthdate?.message}
                                    />
                                );
                            }}
                        />
                    </View>

                    <View className={twMerge("border-t", "border-divider", "my-6")}>
                        <TextComponent className={twMerge("mt-4", ["text-lg", "font-bold"])}>
                            권한
                        </TextComponent>
                    </View>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name="role"
                            render={({ field: { onChange, value } }) => {
                                return (
                                    <SelectGroup
                                        options={[
                                            { label: "관리자 (ADMIN)", value: "ADMIN" },
                                            { label: "사용자 (USER)", value: "USER" },
                                        ]}
                                        label="권한 설정"
                                        placeholder="권한을 선택해주세요"
                                        value={value}
                                        onSelect={onChange}
                                        errorMessage={errors.role?.message}
                                        wrap={true}
                                    />
                                );
                            }}
                        />
                    </View>

                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("mt-2", "text-center")}>
                            {errors.root?.message}
                        </ErrorMessage>
                    )}

                    <View
                        className={twMerge("mt-10", [
                            "flex-row",
                            "justify-end",
                            "items-center",
                            "gap-3",
                        ])}>
                        <Button
                            size={"small"}
                            color={"secondary"}
                            variant={"outlined"}
                            onPress={() => router.push("/admin/users")}>
                            취소
                        </Button>
                        <Button
                            size={"small"}
                            color={"primary"}
                            variant={"contained"}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            {isSubmitting ? "등록 중..." : "등록"}
                        </Button>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

export default AdminCreateUserPage;