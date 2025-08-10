import { Stack } from "expo-router";

export default function MessengerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="chat/[chatId]" />
    </Stack>
  );
} 