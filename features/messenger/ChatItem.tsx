import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatItemProps {
  chat: any;
  unreadCount?: number;
  onPress?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, unreadCount = 0, onPress }) => {
  const title = chat.title || chat.name || "Чат";
  const lastMessageText = chat.last_message?.content || chat.last_message?.text || "";
  let avatarUri = chat.avatar || chat.photo || undefined;
  if (avatarUri && typeof avatarUri === "string" && avatarUri.startsWith("/")) {
    avatarUri = `https://k-connect.ru${avatarUri}`;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]} />
      )}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessageText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#444",
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    color: "#fff",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#d0bcff",
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  badgeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ChatItem; 