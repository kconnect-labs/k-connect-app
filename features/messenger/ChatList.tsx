import { useMessenger } from "contexts/MessengerContext";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import useAuthStore from "stores/useAuthStore";
import ChatItem from "./ChatItem";

interface ChatListProps {
  onSelectChat?: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { chats, refreshChats, unreadCounts, getTotalUnreadCount } = useMessenger();
  const { user } = useAuthStore();
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Мессенджер</Text>
          {getTotalUnreadCount() > 0 && (
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{getTotalUnreadCount()}</Text>
            </View>
          )}
        </View>
      </View>

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
            unreadCount={unreadCounts[item.id] || 0}
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
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  totalBadge: {
    backgroundColor: "#d0bcff",
    borderRadius: 12,
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  totalBadgeText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  search: {
    backgroundColor: "#1f1f1f",
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#fff",
  },
  empty: { alignItems: 'center', marginTop: 40 },
});

export default ChatList; 