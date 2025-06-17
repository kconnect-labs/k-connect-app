import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function ServicesLayout() {
 return (
  <PaperProvider>
   <Stack
    screenOptions={{
     animation: "none",
     headerShown: false,
     contentStyle: {
      backgroundColor: "#121212",
     },
    }}
   />
  </PaperProvider>
 );
}
