import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import Logo from "./Logo";

const RegisterContent = () => {
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [name, setName] = useState("");
 const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
 const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
 const [settingsVisible, setSettingsVisible] = useState(false);

 const {
  user,
  loading,
  error,
  register,
  isAuthenticated,
 } = useAuthStore();

 const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

 useEffect(() => {
  setIsLoadingButton(loading);
 }, [loading]);

 const validateForm = () => {
  const newErrors: { username?: string; email?: string; password?: string } = {};

  // Username validation: 3-30 chars, letters, digits, underscore
  if (!username || username.length < 3 || username.length > 30) {
   newErrors.username = "Имя пользователя должно быть от 3 до 30 символов";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
   newErrors.username = "Имя пользователя может содержать только буквы, цифры и подчеркивание";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
   newErrors.email = "Введите корректный email";
  }

  // Password validation: min 8 chars
  if (!password || password.length < 8) {
   newErrors.password = "Пароль должен содержать минимум 8 символов";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleRegister = async () => {
  if (!validateForm()) {
   return;
  }

  try {
   setIsLoadingButton(true);
   const response = await register(username, email, password);
   console.log(response);

   if (response.success) {
    Alert.alert("Успех", response.message || "Регистрация успешна. Проверьте email для подтверждения.", [
     {
      text: "OK",
      onPress: () => router.replace("/login"),
     },
    ]);
   }
  } catch (err) {
   if (err instanceof Error) {
    Alert.alert("Ошибка", err.message || "Произошла ошибка при регистрации");
   } else {
    console.error("Register error:", err);
   }
  } finally {
   setIsLoadingButton(false);
  }
 };

 const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

 return (
  <LinearGradient
   colors={["#0f0f23", "#1a1a2e", "#16213e"]}
   start={{ x: 0, y: 0 }}
   end={{ x: 1, y: 1 }}
   style={{ flex: 1 }}
  >
   <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
   >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
     <Flex direction="column" align="center" justify="center" className="px-8 py-10" gap={40}>
      <Flex direction="column" align="center" gap={25} className="w-full">
       <Logo />
       <View className="w-full text-center">
        <TextC size={32} className="w-full text-center font-bold text-text-primary">
         Создать аккаунт
        </TextC>
        <TextC size={16} className="w-full text-center mt-3 font-medium text-text-secondary">
         Присоединяйтесь к K-Коннект
        </TextC>
       </View>
      </Flex>

      <Flex direction="column" gap={25} className="w-full">
       <View className="relative">
        <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
         <Icon source="account" size={22} color="#b0b0b0" />
        </View>
        <TextInput
         value={username}
         onChangeText={(text) => setUsername(text)}
         placeholder="Имя пользователя"
         placeholderTextColor="#b0b0b0"
         className="input-field w-full pl-12 pr-4 py-5 text-lg font-medium"
         style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 }}
        />
        {errors.username && <TextC size={14} color="#ff6b6b" className="mt-2 font-medium">{errors.username}</TextC>}
       </View>

       <View className="relative">
        <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
         <Icon source="email" size={22} color="#b0b0b0" />
        </View>
        <TextInput
         value={email}
         onChangeText={(text) => setEmail(text)}
         placeholder="Email"
         placeholderTextColor="#b0b0b0"
         keyboardType="email-address"
         autoCapitalize="none"
         className="input-field w-full pl-12 pr-4 py-5 text-lg font-medium"
         style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 }}
        />
        {errors.email && <TextC size={14} color="#ff6b6b" className="mt-2 font-medium">{errors.email}</TextC>}
       </View>

       <View className="relative">
        <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
         <Icon source="lock" size={22} color="#b0b0b0" />
        </View>
        <TextInput
         value={password}
         onChangeText={(text) => setPassword(text)}
         placeholder="Пароль"
         placeholderTextColor="#b0b0b0"
         secureTextEntry={!passwordVisible}
         className="input-field w-full pl-12 pr-14 py-5 text-lg font-medium"
         style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 }}
        />
        <Button
         compact
         onPress={togglePasswordVisibility}
         style={{
           position: "absolute",
           top: "50%",
           right: 10,
           transform: [{ translateY: -22 }],
         }}
        >
         <Icon
          source={!passwordVisible ? "eye-off" : "eye"}
          size={22}
          color="#b0b0b0"
         />
        </Button>
        {errors.password && <TextC size={14} color="#ff6b6b" className="mt-2 font-medium">{errors.password}</TextC>}
       </View>

       <View className="relative">
        <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
         <Icon source="account-outline" size={22} color="#b0b0b0" />
        </View>
        <TextInput
         value={name}
         onChangeText={(text) => setName(text)}
         placeholder="Имя (опционально)"
         placeholderTextColor="#b0b0b0"
         className="input-field w-full pl-12 pr-4 py-5 text-lg font-medium"
         style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 }}
        />
       </View>

       <View className="w-full mt-5">
        <Button
         onPress={handleRegister}
         className="btn-primary w-full"
         style={{ borderRadius: 20, shadowColor: "#6366f1", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }}
         loading={isLoadingButton}
         disabled={isLoadingButton}
        >
         <TextC size={18} weight="bold">
          Зарегистрироваться
         </TextC>
        </Button>
       </View>

       <Flex align="center" gap={6} justify="center" className="w-full mt-6">
        <TextC size={16} className="text-text-secondary">Уже есть аккаунт?</TextC>
        <TextC size={16} className="text-primary font-bold" onPress={() => router.replace("/login")}>
         Войти
        </TextC>
       </Flex>

       {error && (
        <View className="w-full bg-error bg-opacity-20 border border-error rounded-2xl p-4 mt-4">
         <TextC size={16} className="text-error text-center font-medium">
          {error}
         </TextC>
        </View>
       )}
      </Flex>
     </Flex>
    </ScrollView>
   </KeyboardAvoidingView>
  </LinearGradient>
 );
};

export default RegisterContent;
