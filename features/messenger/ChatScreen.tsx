import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import MessengerService from "../../services/messengerService";
import MessageBubble from "./MessageBubble";

const service = new MessengerService();

const ChatScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const res = await service.getMessages(Number(chatId), 50);
      if (res?.messages) {
        setMessages(res.messages.reverse()); // newest last
      }
    })();
  }, [chatId]);

  const send = async () => {
    if (!text.trim()) return;
    const temp = {
      id: Date.now(),
      content: text,
      user_id: user?.id,
    };
    setMessages((prev) => [...prev, temp]);
    setText("");
    flatRef.current?.scrollToEnd();
    await service.sendMessage(Number(chatId), text.trim());
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.user_id === user?.id} />
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Сообщение" placeholderTextColor="#777"
          style={styles.input}
        />
        <TouchableOpacity onPress={send} style={styles.sendBtn}>
          <Icon source="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#fff",
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#9365FF",
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatScreen; 