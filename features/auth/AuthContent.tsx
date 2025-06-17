import { Flex } from "@ui/Flex";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, View } from "react-native";
import Logo from "./Logo";
import TextC from "@ui/TextC";
import { TextInput } from "react-native-gesture-handler";
import { Button, Icon } from "react-native-paper";
import { useState } from "react";
import useAuthStore from "stores/useAuthStore";
import { router } from "expo-router";

const AuthContent = () => {
 const [usernameOrEmail, setUsernameOrEmail] = useState("");
 const [password, setPassword] = useState("");
 const [errors, setErrors] = useState({});
 const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

 const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);
 const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

 const {
  user,
  loading,
  error,
  login,
  logout,
  isAuthenticated,
  checkAuthStatus,
 } = useAuthStore();

 const handleLogin = async () => {
  try {
   const response = await login(usernameOrEmail, password);
   console.log(response);

   if (response.success) {
    router.replace("/profile");
   }
  } catch (err) {
   if (err instanceof Error) {
    Alert.alert("Ошибка", err.message || "Произошла ошибка при входе");
   } else {
    console.error("Login error:", err);
   }
  }
 };
 const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

 return (
  <LinearGradient
   colors={["#14141f", "#222232"]}
   start={{ x: 0, y: 0 }}
   end={{ x: 0, y: 1 }}
   style={{ flex: 1 }}
  >
   <Flex direction="column" align="center" className="m-8 mt-10" gap={30}>
    <Flex direction="column" align="center" gap={15} className="w-full">
     <Logo />
     <View className="w-full ">
      <TextC size={22} className="w-full" weight="bold">
       Вход в аккаунт
      </TextC>
      <TextC size={12} className="opacity-75 w-full" weight="bold">
       Войдите в K-Коннект для доступа к своему профилю
      </TextC>
     </View>
    </Flex>

    <Flex direction="column" gap={30} className="w-full">
     <TextInput
      value={usernameOrEmail}
      onChangeText={(text) => setUsernameOrEmail(text)}
      placeholder="Имя пользователя или Email"
      placeholderTextColor="#ffffff75"
      className="w-full bg-transparent border-[1px] border-[#343442] rounded-3xl p-4 text-white"
     />
     <View className="w-full">
      <TextInput
       value={password}
       onChangeText={(text) => setPassword(text)}
       placeholder="Пароль"
       placeholderTextColor="#ffffff75"
       secureTextEntry={!passwordVisible}
       className="w-full bg-transparent border-[1px] border-[#343442] rounded-3xl p-4 text-white"
      />
      <Button
       compact
       onPress={togglePasswordVisibility}
       style={{
        position: "absolute",
        top: "50%",
        right: 10,
        transform: [{ translateY: -20 }],
       }}
      >
       <Icon
        source={!passwordVisible ? "eye-off" : "eye"}
        size={24}
        color="#ffffff75"
       />
      </Button>
     </View>
     <View className="w-full">
      <Button
       onPress={() => {
        if (!loading && password && usernameOrEmail) {
         handleLogin();
        } else if (!password || !usernameOrEmail) {
         Alert.alert("Не оставляйте поля пустыми");
        }
       }}
       textColor="#191621"
       className="w-full"
       contentStyle={{ backgroundColor: "#cab5fd" }}
       style={{ padding: 2 }}
       loading={loading}
       disabled={loading}
      >
       <TextC size={16} color="#191621s" weight="bold">
        Войти
       </TextC>
      </Button>
     </View>
     <Flex align="center" gap={4} justify="center" className="w-full">
      <TextC>Ещё нет аккаунта?</TextC>
      <TextC color="#d0bcff">Зарегистрироваться</TextC>
     </Flex>
    </Flex>
   </Flex>
  </LinearGradient>
 );
};

export default AuthContent;
