import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAuthStore from "stores/useAuthStore";
import { parseDate } from "../../utils/formatter";

interface ChatItemProps {
  chat: any;
  unreadCount?: number;
  onPress?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, unreadCount = 0, onPress }) => {
  const { user } = useAuthStore();
  
  // Определяем название чата
  const getChatTitle = () => {
    // Если это группа, используем название группы
    if (chat.is_group && chat.title) {
      return chat.title;
    }
    
    // Если это личный чат, ищем собеседника
    if (!chat.is_group && chat.members && Array.isArray(chat.members)) {
      const otherMember = chat.members.find(m => {
        const memberId = m.user_id || m.id;
        const memberIdStr = memberId ? String(memberId) : null;
        const currentUserIdStr = user?.id ? String(user.id) : null;
        return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
      });
      
      if (otherMember) {
        return otherMember.name || otherMember.username || `Пользователь #${otherMember.user_id || otherMember.id}`;
      }
    }
    
    // Fallback
    return chat.title || chat.name || "Чат";
  };
  
  const title = getChatTitle();
  
  // Обработка текста последнего сообщения
  const getLastMessageText = () => {
    const content = chat.last_message?.content || chat.last_message?.text || "";
    
    // Проверяем, является ли сообщение стикером
    if (content.match(/\[STICKER_\d+_\d+\]/) || chat.last_message?.message_type === 'sticker') {
      return "Стикер";
    }
    
    // Проверяем другие типы сообщений
    if (chat.last_message?.message_type === 'photo') {
      return "Фото";
    }
    
    if (chat.last_message?.message_type === 'video') {
      return "Видео";
    }
    
    if (chat.last_message?.message_type === 'audio') {
      return "Голосовое сообщение";
    }
    
    if (chat.last_message?.message_type === 'file') {
      return "Файл";
    }
    
    return content;
  };
  
  const lastMessageText = getLastMessageText();
  let avatarUri = chat.avatar || chat.photo || undefined;
  if (avatarUri && typeof avatarUri === "string" && avatarUri.startsWith("/")) {
    avatarUri = `https://k-connect.ru${avatarUri}`;
  }

  // Format last message time
  const formatLastMessageTime = (dateString: string) => {
    if (!dateString) return '';
    
    const date = parseDate(dateString);
    if (!date) {
      console.warn('Could not parse date in ChatItem:', dateString);
      return '';
    }
    
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const lastMessageTime = formatLastMessageTime(chat.last_message?.created_at);

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
          <View style={styles.rightSection}>
            {lastMessageTime && (
              <Text style={styles.timeText}>{lastMessageTime}</Text>
            )}
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
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
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
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