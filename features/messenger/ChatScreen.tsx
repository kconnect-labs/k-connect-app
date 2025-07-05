import { useMessenger } from "contexts/MessengerContext";
import * as DocumentPicker from 'expo-document-picker';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import MessageBubble from "./MessageBubble";
import StickerPicker from "./StickerPicker";

const API_BASE = "https://k-connect.ru";

// Функция для построения URL аватара
const buildAvatarUrl = (userId: number, avatarFilename: string) => {
  if (!avatarFilename || !userId) {
    return null;
  }
  
  if (avatarFilename.startsWith('http')) {
    return avatarFilename;
  }
  
  if (avatarFilename.startsWith('/static/')) {
    return `${API_BASE}${avatarFilename}`;
  }
  
  let filename = avatarFilename;
  if (avatarFilename.includes('uploads/avatar/') || avatarFilename.includes('avatar/')) {
    const parts = avatarFilename.split('/');
    filename = parts[parts.length - 1];
  }
  
  return `${API_BASE}/static/uploads/avatar/${userId}/${filename}`;
};

// Функция форматирования разделителя даты
const formatDateSeparator = (dateKey: string) => {
  if (!dateKey) return '';
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  if (dateKey === todayKey) return 'Сегодня';
  if (dateKey === yesterdayKey) return 'Вчера';
  const date = new Date(dateKey);
  return date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const ChatScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const { sendMessage, messages, getMessages, uploadFile, chats } = useMessenger();
  const chatId = params.chatId as string;
  const [text, setText] = useState("");
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const flatRef = useRef<FlatList>(null);

  // Получаем информацию о чате из списка чатов
  const chatInfo = chats.find((c: any) => c.id === Number(chatId));

  // Отладочная информация
  console.log('ChatScreen: chatInfo:', {
    chatId,
    chatInfo: chatInfo ? {
      id: chatInfo.id,
      is_group: chatInfo.is_group,
      title: chatInfo.title,
      membersCount: chatInfo.members?.length || 0,
      members: chatInfo.members?.map((m: any) => ({ id: m.user_id || m.id, name: m.name }))
    } : null
  });

  // Определяем название чата для заголовка
  const getChatTitle = () => {
    if (!chatInfo) return `Чат #${chatId}`;
    
    // Если это группа, используем название группы
    if (chatInfo.is_group && chatInfo.title) {
      return chatInfo.title;
    }
    
    // Если это личный чат, ищем собеседника
    if (!chatInfo.is_group && chatInfo.members && Array.isArray(chatInfo.members)) {
      const otherMember = chatInfo.members.find((m: any) => {
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
    return chatInfo.title || chatInfo.name || "Чат";
  };

  // Получаем аватар чата
  const getChatAvatar = () => {
    if (!chatInfo) return null;
    
    let avatarUri = chatInfo.avatar || chatInfo.photo || undefined;
    if (avatarUri && typeof avatarUri === "string" && avatarUri.startsWith("/")) {
      avatarUri = `https://k-connect.ru${avatarUri}`;
    }
    
    return avatarUri;
  };

  // Получаем букву для аватара (если нет фото)
  const getAvatarLetter = () => {
    const title = getChatTitle();
    return title ? title.charAt(0).toUpperCase() : 'Ч';
  };

  // Получаем сообщения для текущего чата
  const chatMessages = messages[Number(chatId)] || [];



  // Загружаем сообщения при открытии чата
  useEffect(() => {
    getMessages(Number(chatId), 50).then(() => {
      // Скролл вниз после загрузки сообщений
      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: false });
      }, 500);
    });
  }, [chatId, getMessages]);

  // Автоматический скролл при изменении сообщений
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [chatMessages.length]);

  // 1. Порядок сообщений: сортируем chatMessages по created_at ASC
  const sortedChatMessages = [...chatMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Группировка сообщений с разделителями дат
  const messagesWithSeparators = useMemo(() => {
    if (!sortedChatMessages.length) return [];
    const result: any[] = [];
    let lastDateKey: string | null = null;
    sortedChatMessages.forEach((message: any, index: number) => {
      let dateKey = message.date_key;
      if (!dateKey && message.created_at) {
        try {
          const date = new Date(message.created_at);
          if (!isNaN(date.getTime())) {
            dateKey = date.toISOString().slice(0, 10);
          }
        } catch (e) {
          console.warn('Invalid date format:', message.created_at);
        }
      }
      if (dateKey && dateKey !== lastDateKey) {
        result.push({
          type: 'date_separator',
          text: formatDateSeparator(dateKey),
          id: `separator_${dateKey}_${index}`
        });
        lastDateKey = dateKey;
      }
      result.push({
        type: 'message',
        data: message
      });
    });
    return result;
  }, [chatMessages]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === 'date_separator') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>{item.text}</Text>
        </View>
      );
    }
    const message = item.data;
    const messageUserId = Number(message.sender_id);
    const currentUserId = Number(user?.id);
    const isOwn = messageUserId === currentUserId;
    // Найти предыдущее сообщение (если есть)
    let previousMessage = null;
    for (let i = index - 1; i >= 0; i--) {
      const prev = messagesWithSeparators[i];
      if (prev.type === 'message') {
        previousMessage = prev.data;
        break;
      }
    }
    // Найти следующее сообщение (если есть)
    let nextMessage = null;
    for (let i = index + 1; i < messagesWithSeparators.length; i++) {
      const next = messagesWithSeparators[i];
      if (next.type === 'message') {
        nextMessage = next.data;
        break;
      }
    }
    return (
      <MessageBubble 
        message={message} 
        isOwn={isOwn} 
        isGroupChat={chatInfo?.is_group || false}
        chatMembers={chatInfo?.members || []}
        previousMessage={previousMessage}
        nextMessage={nextMessage}
        currentUserId={currentUserId}
      />
    );
  };

  const handleSendMessage = async () => {
    console.log('ChatScreen.handleSendMessage called:', { text, chatId });
    
    if (!text.trim()) {
      console.log('ChatScreen.handleSendMessage: empty message');
      return;
    }

    const messageText = text.trim();
    setText('');
    console.log('ChatScreen.handleSendMessage: calling context.sendMessage');
    
    const result = await sendMessage(Number(chatId), messageText);
    console.log('ChatScreen.handleSendMessage: result:', result);
    
    if (!result.success) {
      console.error('ChatScreen.handleSendMessage: failed to send message:', result.error);
      // Optionally show error to user
      Alert.alert('Error', result.error || 'Failed to send message');
    } else {
      // Скролл вниз после отправки сообщения
      scrollToBottom(true);
    }
  };

  // Обработчик выбора стикера
  const handleStickerSelect = async (stickerData: { pack_id: string; sticker_id: string; name: string; emoji: string }) => {
    console.log('ChatScreen.handleStickerSelect called:', stickerData);
    
    const stickerMessage = `[STICKER_${stickerData.pack_id}_${stickerData.sticker_id}]`;
    console.log('ChatScreen.handleStickerSelect: sending sticker message:', stickerMessage);
    
    const result = await sendMessage(Number(chatId), stickerMessage);
    console.log('ChatScreen.handleStickerSelect: result:', result);
    
    if (!result.success) {
      console.error('ChatScreen.handleStickerSelect: failed to send sticker:', result.error);
      Alert.alert('Error', result.error || 'Failed to send sticker');
    } else {
      // Скролл вниз после отправки стикера
      scrollToBottom(true);
    }
  };

  // Переключение показа пикера стикеров
  const toggleStickerPicker = () => {
    setShowStickerPicker(prev => !prev);
  };

  // Функция выбора изображения
  const pickImage = async () => {
    try {
      console.log('ChatScreen.pickImage: starting image picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('ChatScreen.pickImage: result:', result);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
        
        console.log('ChatScreen: uploading image:', file);
        const uploadResult = await uploadFile(Number(chatId), file, 'photo');
        console.log('ChatScreen: upload result:', uploadResult);
      } else {
        console.log('ChatScreen.pickImage: cancelled or no asset selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Функция выбора файла
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name,
        };
        
        console.log('ChatScreen: uploading file:', file);
        await uploadFile(Number(chatId), file, 'file');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  // Исправленный keyExtractor:
  const keyExtractor = (item: any, index: number) => {
    if (item.type === 'date_separator') return item.id || `separator_${index}`;
    if (item.data && item.data.id !== undefined) return String(item.data.id);
    return String(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon source="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        {/* Аватар чата */}
        <View style={styles.avatarContainer}>
          {getChatAvatar() ? (
            <Image source={{ uri: getChatAvatar() }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarLetter}>{getAvatarLetter()}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{getChatTitle()}</Text>
          {chatInfo?.is_group && chatInfo.members && (
            <Text style={styles.headerSubtitle}>
              {chatInfo.members.length} участников
            </Text>
          )}
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 45 : 20}
        enabled={true}
      >
        <FlatList
          ref={flatRef}
          data={messagesWithSeparators}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 6, flexGrow: 1 }}
          style={{ flex: 1 }}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={pickImage} style={styles.attachBtn}>
            <Icon source="image" size={24} color="#9365FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleStickerPicker} style={styles.attachBtn}>
            <Icon source="emoticon" size={24} color={showStickerPicker ? "#D0BCFF" : "#9365FF"} />
          </TouchableOpacity>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Сообщение" 
            placeholderTextColor="#777"
            style={styles.input}
            multiline
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            onPress={handleSendMessage} 
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            disabled={!text.trim()}
          >
            <Icon source="send" size={24} color={text.trim() ? "#fff" : "#666"} />
          </TouchableOpacity>
        </View>
        
        {/* Пикер стикеров */}
        <StickerPicker
          isOpen={showStickerPicker}
          onStickerSelect={handleStickerSelect}
          onClose={() => setShowStickerPicker(false)}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backButton: {
    padding: 4,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#9365FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  headerRight: {
    width: 32,
  },
  chatContainer: { 
    flex: 1,
    backgroundColor: "#121212",
  },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "flex-end",
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    minHeight: 60,
    paddingBottom: Platform.OS === "ios" ? 10 : 16,
    gap: 2,
  },
  input: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: "#fff",
    maxHeight: 100,
    minHeight: 30,
  },
  sendBtn: {
    marginLeft: 5,
    backgroundColor: "#9365FF",
    borderRadius: 20,
    padding: 6,
  },
  sendBtnDisabled: {
    backgroundColor: "#444",
  },
  attachBtn: {
    padding: 6,
  },
  dateSeparator: {
    padding: 8,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
  },
  dateSeparatorText: {
    color: "#888",
    fontSize: 12,
  },
});

export default ChatScreen; 