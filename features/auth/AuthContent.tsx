import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import Logo from "./Logo";

const AuthContent = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login, loading, error } = useAuthStore();

  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingButton(loading);
  }, [loading]);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    try {
      setIsLoadingButton(true);
      const response = await login(usernameOrEmail, password);
      if (response.success) {
        if (response.needsProfileSetup) {
          router.replace("/profile/setup");
        } else {
          router.replace("/profile");
        }
      }
    } catch (err: any) {
      let errorMessage = "Ошибка при входе";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        // Handle specific network errors
        if (err.message.includes("Network Error") || err.message.includes("timeout")) {
          errorMessage = "Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.";
        } else if (err.message.includes("Request failed")) {
          errorMessage = "Сервер временно недоступен. Попробуйте позже.";
        } else {
          errorMessage = err.message;
        }
      } else if (error) {
        errorMessage = error;
      }

      Alert.alert("Ошибка", errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

 return (
    <View className="flex-1 theme-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Flex direction="column" align="center" justify="center" className="px-8 py-10" gap={40}>
            <Flex direction="column" align="center" gap={25} className="w-full">
              <Logo />
              <View className="w-full text-center">
                <TextC size={32} className="w-full text-center font-bold text-theme-primary">
                  Добро пожаловать
                </TextC>
                <TextC size={16} className="w-full text-center mt-3 font-medium text-theme-secondary">
                  Войдите в свой аккаунт K-Коннект
                </TextC>
              </View>
            </Flex>

            <Flex direction="column" gap={25} className="w-full">
              <View className="relative">
                <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
                  <Icon source="account" size={22} color="var(--theme-text-secondary)" />
                </View>
                <TextInput
                  value={usernameOrEmail}
                  onChangeText={(text) => setUsernameOrEmail(text)}
                  placeholder="Имя пользователя или Email"
                  placeholderTextColor="var(--theme-text-secondary)"
                  className="input-field w-full pl-12 pr-4 py-5 text-lg font-medium"
                  style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 }}
                />
              </View>

              <View className="relative">
                <View style={{ position: "absolute", left: 15, top: "50%", transform: [{ translateY: -10 }] }}>
                  <Icon source="lock" size={22} color="var(--theme-text-secondary)" />
                </View>
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Пароль"
                  placeholderTextColor="var(--theme-text-secondary)"
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
                    color="var(--theme-text-secondary)"
                  />
                </Button>
              </View>

              <View className="w-full">
                <Button
                  onPress={handleLogin}
                  className="btn-primary w-full"
                  style={{ borderRadius: 20, shadowColor: "var(--theme-main-color)", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }}
                  loading={isLoadingButton}
                  disabled={isLoadingButton}
                >
                  <TextC size={18} weight="bold">
                    Войти
                  </TextC>
                </Button>
              </View>

              <Flex align="center" gap={6} justify="center" className="w-full mt-6">
                <TextC size={16} className="text-theme-secondary">Нет аккаунта?</TextC>
                <TextC size={16} className="text-theme-accent font-bold" onPress={() => router.replace("/register")}>
                  Зарегистрироваться
                </TextC>
              </Flex>
              {/* Removed guest login button as per request */}
              {/* <View className="w-full mt-6">
                <Button
                  onPress={guestLogin}
                  textColor="#ffffff"
                  className="w-full rounded-2xl"
                  contentStyle={{ backgroundColor: "#9ca3af", paddingVertical: 12 }}
                  style={{ borderRadius: 16 }}
                  loading={isLoadingButton}
                  disabled={isLoadingButton}
                >
                  <TextC size={16} color="#ffffff" weight="bold">
                    Войти как гость
                  </TextC>
                </Button>
              </View> */}

              {error && (
                <View className="w-full bg-red-500 bg-opacity-20 border border-red-500 rounded-theme-main p-4 mt-4">
                  <TextC size={16} className="text-theme-error text-center font-medium">
                    {error}
                  </TextC>
                </View>
              )}
            </Flex>
          </Flex>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthContent;
