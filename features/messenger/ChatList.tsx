import { useMessenger } from "contexts/MessengerContext";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import ChatItem from "./ChatItem";

interface ChatListProps {
  onSelectChat?: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { chats, refreshChats } = useMessenger();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshChats();
    setRefreshing(false);
  }, [refreshChats]);

  const filtered = useMemo(() => {
    if (!search.trim()) return chats;
    const q = search.toLowerCase();
    return chats.filter((c: any) => {
      if (c.title && c.title.toLowerCase().includes(q)) return true;
      if (c.name && c.name.toLowerCase().includes(q)) return true;
      if (c.last_message?.content && c.last_message.content.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [search, chats]);

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Поиск…"
        placeholderTextColor="#777"
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <ChatItem
            chat={item}
            onPress={() => {
              if (onSelectChat) onSelectChat(item.id);
              router.push(`/messenger/chat/${item.id}` as any);
            }}
          />
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={{color:'#888'}}>Нет чатов</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    backgroundColor: "#1f1f1f",
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
  },
  empty: { alignItems: 'center', marginTop: 40 },
});

export default ChatList; 