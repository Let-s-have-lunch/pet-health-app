// import { useRouter } from "expo-router";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
// import { twMerge } from "tailwind-merge";
// import { isAxiosError } from "axios";
// import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
// import userApi from "@/api/user/userApi";
// import Card from "@/components/common/card/Card";
// import TextComponent from "@/components/common/text/TextComponent";
// import InputGroup from "@/components/common/input/InputGroup";
// import Button from "@/components/common/button/Button";
// import ErrorMessage from "@/components/common/label/ErrorMessage";
//
// function Register() {
//     // React에서는 useNavigate() 준비를 해뒀었는데, React-Native에서는 useRouter();
//     const router = useRouter();
//
//     const {
//         control,
//         handleSubmit,
//         setError,
//         formState: { errors, isSubmitting },
//     } = useForm<RegisterUserInputType>({
//         resolver: zodResolver(registerUserSchema),
//         mode: "onTouched",
//         defaultValues: {
//             password: "",
//             confirmPassword: "",
//             nickname: "",
//             email: "",
//             birthdate: "",
//         },
//     });
//
//     const onSubmit = async (data: RegisterUserInputType) => {
//         try {
//             const { confirmPassword, ...submitData } = data;
//
//             // 전 세계 컴퓨터들이 약속한 표준 날짜 형태(ISO 표준)이기 때문에,
//             // 백엔드나 데이터베이스(DB) 시스템이 "어? 이거 날짜 형식이네!" 하고 알아서 날짜 데이터로 찰떡같이 인식해 저장합니다.
//             // string에는 slice(시작인덱스, 끝 전 인덱스)
//             const formattedDate =
//                 data.birthdate && data.birthdate !== ""
//                     ? data.birthdate.slice(0, 4) +
//                       "-" +
//                       data.birthdate.slice(4, 6) +
//                       "-" +
//                       data.birthdate.slice(6, 8)
//                     : undefined;
//
//             const payload = {
//                 ...submitData,
//                 birthdate: formattedDate,
//             };
//             await userApi.registerUser(payload);
//
//             if (Platform.OS === "web") {
//                 window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
//                 router.push("/auth/login");
//             } else {
//                 // 모바일 환경일 대에는 Alert.alert(제목, 내용, 버튼설정Array) 으로 경고창 출력
//                 Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요.", [
//                     { text: "확인", onPress: () => router.push("/auth/login") },
//                 ]);
//             }
//         } catch (error) {
//             console.log(error);
//
//             if (isAxiosError(error) && error.response) {
//                 const errorMessage = error.response.data.message;
//                 if (error.response.status === 409) {
//                     if (errorMessage.includes("닉네임")) {
//                         setError("nickname", { message: errorMessage });
//                     } else if (errorMessage.includes("이메일")) {
//                         setError("email", { message: errorMessage });
//                     } else {
//                         setError("root", { message: errorMessage });
//                     }
//                     return;
//                 }
//                 setError("root", { message: errorMessage });
//             } else {
//                 setError("root", { message: "알수 없는 오류가 발생했습니다." });
//             }
//         }
//     };
//
//     // PC에서는 문제가 아닌데, 모바일에서는 키보드가 화면을 침범하게 됨
//     // 키보드가 화면 하단에서 올라오면 화면이 줄어들도록 적용해줘야 되는데 : KeyboardAvoidingView
//     // behavior 속성에 "지금 현재 플랫폼에 따라서 동작 방식을 달리 적용" 해줘야 함
//     // ios (아이폰)일 때는 padding을 통해 하단에 키보드가 올라갈 공간을 마련해 주는것
//     // aos (안드로이드)일 떄는 height를 통해 화면이 줄어들도록 적용해 주는것
//
//     // ScrollView 컴포넌트 : 화면이 넘어갈 만큼 넓거나, 길면 스크롤바를 만들어주는 녀석
//     // 모바일 앱은 ScrollView로 감싸주지 않으면 스크롤바가 안나옴. 그래서 ScrollView로 감싸주어야 함.
//     // 심지어 이 ScrollView는 패딩 영역을 주려면 className으로 주지 않고
//     // contentContainerClassName 이라는 속성으로 부여해야 함
//     // showsVerticalScrollIndicator 속성: 스크롤바를 보여줄지 여부를 결정하는 속성
//     // keyboardShouldPersistTaps 속성 : 터치 이벤트가 자식 컴포넌트로 전파되는지 여부를 결정하는 속성
//     //                                handled 값을 주지 않으면 키보드가 열려있는 상태에서 터치 시 키보드만 닫힘
//
//     // 모바일에서는 form과 같은 역할을 해주는게 없음
//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             className={twMerge("flex-1", "bg-background-paper")}>
//             <ScrollView
//                 contentContainerClassName={twMerge("p-5", "justify-center", "items-center")}
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps={"handled"}>
//                 <Card className={twMerge("w-full", "max-w-md", "my-8")}>
//                     <TextComponent
//                         className={twMerge("mb-6", ["text-2xl", "font-bold", "text-center"])}>
//                         회원가입
//                     </TextComponent>
//                     {/*
//                         react-hookform에서 register를 꺼내서 사용하는 방법은 편의기능
//                         Controller 컴포넌트는 react-hook-form에서 제공하는 컴포넌트로,
//                         폼 필드를 컨트롤할 수 있는 기능을 제공한다.
//                         render 속성은 Controller 컴포넌트의 필수 속성으로,
//                         폼 필드를 랜더링하는 함수를 지정한다.
//                         name 속성은 폼 필드의 이름을 지정한다.
//                         control 속성에는 react-hook-form에서 꺼내온 control을 넣어줌
//                     */}
//                     <Controller
//                         control={control}
//                         name={"nickname"}
//                         render={({ field: { onChange, onBlur, value } }) => {
//                             return (
//                                 <InputGroup
//                                     id={"nickname"}
//                                     label={"닉네임"}
//                                     placeholder={"2자 이상 10자 이내 닉네임을 입력해주세요."}
//                                     onBlur={onBlur}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     errorMessage={errors.nickname?.message}
//                                 />
//                             );
//                         }}
//                     />
//                     <Controller
//                         control={control}
//                         name={"password"}
//                         render={({ field: { onChange, onBlur, value } }) => {
//                             return (
//                                 <InputGroup
//                                     id={"password"}
//                                     secureTextEntry={true} // 비밀번호 마스킹 속성
//                                     label={"비밀번호"}
//                                     placeholder={"6자 이상 입력해주세요."}
//                                     onBlur={onBlur}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     errorMessage={errors.password?.message}
//                                 />
//                             );
//                         }}
//                     />
//                     <Controller
//                         control={control}
//                         name={"confirmPassword"}
//                         render={({ field: { onChange, onBlur, value } }) => {
//                             return (
//                                 <InputGroup
//                                     id={"confirmPassword"}
//                                     secureTextEntry={true}
//                                     label={"비밀번호 확인"}
//                                     placeholder={"비밀번호를 다시 입력해주세요."}
//                                     onBlur={onBlur}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     errorMessage={errors.confirmPassword?.message}
//                                 />
//                             );
//                         }}
//                     />
//                     <Controller
//                         control={control}
//                         name={"email"}
//                         render={({ field: { onChange, onBlur, value } }) => {
//                             return (
//                                 <InputGroup
//                                     id={"email"}
//                                     label={"이메일"}
//                                     placeholder={"이메일을 입력해주세요."}
//                                     keyboardType={"email-address"}
//                                     autoCapitalize={"none"} /* 첫글자 자동 대문자 전환 */
//                                     onBlur={onBlur}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     errorMessage={errors.email?.message}
//                                 />
//                             );
//                         }}
//                     />
//
//                     <Controller
//                         control={control}
//                         name={"birthdate"}
//                         render={({ field: { onChange, onBlur, value } }) => {
//                             return (
//                                 <InputGroup
//                                     id={"birthdate"}
//                                     label={"생년월일(선택)"}
//                                     placeholder={"YYYYMMDD"}
//                                     keyboardType={"number-pad"}
//                                     maxLength={8}
//                                     onBlur={onBlur}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     errorMessage={errors.birthdate?.message}
//                                 />
//                             );
//                         }}
//                     />
//
//                     {errors.root?.message && (
//                         <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
//                             {errors.root?.message}
//                         </ErrorMessage>
//                     )}
//
//                     <Button
//                         color={"primary"}
//                         variant={"contained"}
//                         size={"large"}
//                         fullWidth={true}
//                         className={"mt-4"}
//                         onPress={handleSubmit(onSubmit)}
//                         disabled={isSubmitting}>
//                         회원가입
//                     </Button>
//                     <Button
//                         color={"secondary"}
//                         variant={"outlined"}
//                         size={"large"}
//                         fullWidth={true}
//                         className={"mt-2"}
//                         onPress={() => router.push("/auth/login")}>
//                         로그인하러 가기
//                     </Button>
//                 </Card>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// }
//
// export default Register;
