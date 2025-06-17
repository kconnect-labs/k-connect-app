import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import useAuthStore from "stores/useAuthStore";

export default function Index() {
 const [checking, setChecking] = useState(true);
 const { checkAuthStatus, isAuthenticated } = useAuthStore();

 useEffect(() => {
  const checkAuth = async () => {
   try {
    await checkAuthStatus();
    if (isAuthenticated()) {
     router.replace("/profile");
    } else {
     router.replace("/(auth)/login");
    }
   } catch (error) {
    console.error("Error checking auth status:", error);
    router.replace("/(auth)/login");
   } finally {
    setChecking(false);
   }
  };

  checkAuth();
 }, []);

 if (checking) {
  return (
   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#r" />
   </View>
  );
 }

 return null;
}
