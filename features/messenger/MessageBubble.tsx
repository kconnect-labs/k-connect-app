import React from "react";
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import TGSSticker from "./TGSSticker";

const { width: screenWidth } = Dimensions.get('window');
const API_BASE = "https://k-connect.ru";
const STICKER_BASE = "https://k-connect.ru";

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

interface Props {
  message: any;
  isOwn: boolean;
  isGroupChat?: boolean;
  chatMembers?: any[];
  previousMessage?: any;
  nextMessage?: any;
  currentUserId?: number;
}

// Компонент для рендеринга стикеров разных типов
const StickerRenderer: React.FC<{
  url: string;
  style: any;
  onLoad?: () => void;
  onError?: (error: any) => void;
}> = ({ url, style, onLoad, onError }) => {
  const [stickerType, setStickerType] = React.useState<'tgs' | 'static' | 'unknown' | 'loading'>('loading');
  const [loading, setLoading] = React.useState(true);
  const [fileUrl, setFileUrl] = React.useState<string>(url);

  React.useEffect(() => {
    const checkStickerType = async () => {
      try {
        setLoading(true);
        console.log('StickerRenderer: Checking sticker at URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('StickerRenderer: Content-Type for', url, ':', contentType);
        
        // Если это JSON, значит сервер вернул метаданные стикера
        if (contentType === 'application/json') {
          const jsonData = await response.json();
          console.log('StickerRenderer: Received JSON data:', JSON.stringify(jsonData, null, 2));
          
          // Проверяем, есть ли URL файла в ответе
          if (jsonData.file_url) {
            // Загружаем сам файл стикера
            const fileResponse = await fetch(jsonData.file_url);
            const fileContentType = fileResponse.headers.get('content-type');
            console.log('StickerRenderer: File Content-Type:', fileContentType);
            console.log('StickerRenderer: File URL:', jsonData.file_url);
            
            setFileUrl(jsonData.file_url);
            
            if (fileContentType === 'application/x-tgsticker') {
              setStickerType('tgs');
            } else if (fileContentType && fileContentType.startsWith('image/')) {
              setStickerType('static');
            } else {
              setStickerType('unknown');
            }
          } else {
            // Если нет file_url, пробуем определить по расширению или другим полям
            console.log('StickerRenderer: No file_url found, checking other fields:', Object.keys(jsonData));
            if (jsonData.type === 'tgs' || jsonData.animated) {
              setStickerType('tgs');
            } else {
              setStickerType('static');
            }
          }
        } else if (contentType === 'application/x-tgsticker') {
          setStickerType('tgs');
        } else if (contentType && contentType.startsWith('image/')) {
          setStickerType('static');
        } else {
          setStickerType('unknown');
        }
      } catch (error) {
        console.error('StickerRenderer: Error checking sticker type:', error);
        setStickerType('unknown');
      } finally {
        setLoading(false);
      }
    };

    checkStickerType();
  }, [url]);

  if (loading) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D0BCFF" />
      </View>
    );
  }

  if (stickerType === 'tgs') {
    return (
      <TGSSticker
        src={fileUrl}
        style={style}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  if (stickerType === 'static') {
    return (
      <Image 
        source={{ uri: fileUrl }} 
        style={style}
        resizeMode="contain"
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  // Fallback для неизвестного типа
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 0.1)' }]}>
      <ActivityIndicator size="small" color="#ff6b6b" />
    </View>
  );
};

const MessageBubble: React.FC<Props> = ({ 
  message, 
  isOwn, 
  isGroupChat = false, 
  chatMembers = [], 
  previousMessage, 
  nextMessage,
  currentUserId 
}) => {
  const [imageModalVisible, setImageModalVisible] = React.useState(false);
  const [modalImageLoading, setModalImageLoading] = React.useState(false);

  // Получаем информацию об отправителе
  const getSenderInfo = () => {
    if (!chatMembers.length) {
      console.log('MessageBubble.getSenderInfo: no chatMembers');
      return { name: 'Пользователь', avatar: null };
    }
    
    // Если есть данные отправителя в сообщении
    if (message.sender?.avatar) {
      console.log('MessageBubble.getSenderInfo: using message.sender data');
      return {
        name: message.sender.name || message.sender.username || 'Пользователь',
        avatar: message.sender.avatar
      };
    }
    
    const member = chatMembers.find((m: any) => {
      const memberId = m.user_id || m.id;
      return memberId === message.sender_id;
    });
    
    if (!member) {
      console.log('MessageBubble.getSenderInfo: member not found for sender_id:', message.sender_id, 'available members:', chatMembers.map((m: any) => ({ id: m.user_id || m.id, name: m.name })));
      return { name: 'Пользователь', avatar: null };
    }
    
    let avatarUrl = null;
    if (member.avatar || member.photo) {
      const photoPath = member.avatar || member.photo;
      if (photoPath?.startsWith('/static/')) {
        avatarUrl = `${API_BASE}${photoPath}`;
      } else {
        avatarUrl = buildAvatarUrl(member.user_id || member.id, photoPath);
      }
    }
    
    const result = { 
      name: member.name || member.username || 'Пользователь',
      avatar: avatarUrl
    };
    
    console.log('MessageBubble.getSenderInfo: found member:', {
      senderId: message.sender_id,
      memberId: member.user_id || member.id,
      memberName: member.name,
      memberUsername: member.username,
      result
    });
    
    return result;
  };

  const senderInfo = getSenderInfo();

  // Форматируем время
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      return '';
    }
  };

  // Определяем, короткое ли сообщение (меньше 30 символов)
  const isShortMessage = message.content && message.content.length < 30;

  // Проверяем, является ли сообщение стикером
  const isSticker = message.content && message.content.match(/\[STICKER_(\d+)_(\d+)\]/) || message.message_type === 'sticker';
  
  // Улучшенная логика для серий сообщений
  const isSeriesStart = () => {
    if (!isGroupChat || isOwn) return false;
    
    // Это начало серии, если:
    // 1. Предыдущего сообщения нет
    // 2. Предыдущее сообщение от другого пользователя
    // 3. Предыдущее сообщение от меня (currentUserId)
    if (!previousMessage) return true;
    
    const prevIsOwn = previousMessage.sender_id === currentUserId;
    const prevFromSameSender = previousMessage.sender_id === message.sender_id;
    
    return !prevFromSameSender || prevIsOwn;
  };

  const isSeriesEnd = () => {
    if (!isGroupChat || isOwn) return false;
    
    // Это конец серии, если:
    // 1. Следующего сообщения нет
    // 2. Следующее сообщение от другого пользователя
    // 3. Следующее сообщение от меня (currentUserId)
    if (!nextMessage) return true;
    
    const nextIsOwn = nextMessage.sender_id === currentUserId;
    const nextFromSameSender = nextMessage.sender_id === message.sender_id;
    
    return !nextFromSameSender || nextIsOwn;
  };

  const isSeriesMiddle = () => {
    return !isSeriesStart() && !isSeriesEnd();
  };

  // Определяем позицию в серии
  const showAvatar = isSeriesEnd() && !isOwn && isGroupChat;
  const showSenderName = isSeriesStart() && !isOwn && isGroupChat;

  // Определяем стиль скругления углов в зависимости от позиции в серии
  const getBorderRadius = () => {
    if (isSticker) return 0;
    
    const baseRadius = 18;
    const smallRadius = 4;
    
    if (isOwn) {
      if (isSeriesStart() && isSeriesEnd()) {
        // Одиночное сообщение
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: baseRadius,
        };
      } else if (isSeriesStart()) {
        // Начало серии
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: smallRadius,
        };
      } else if (isSeriesEnd()) {
        // Конец серии
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: smallRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: baseRadius,
        };
      } else {
        // Середина серии
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: smallRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: smallRadius,
        };
      }
    } else {
      if (isSeriesStart() && isSeriesEnd()) {
        // Одиночное сообщение
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: baseRadius,
        };
      } else if (isSeriesStart()) {
        // Начало серии
        return {
          borderTopLeftRadius: baseRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: smallRadius,
          borderBottomRightRadius: baseRadius,
        };
      } else if (isSeriesEnd()) {
        // Конец серии
        return {
          borderTopLeftRadius: smallRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: baseRadius,
          borderBottomRightRadius: baseRadius,
        };
      } else {
        // Середина серии
        return {
          borderTopLeftRadius: smallRadius,
          borderTopRightRadius: baseRadius,
          borderBottomLeftRadius: smallRadius,
          borderBottomRightRadius: baseRadius,
        };
      }
    }
  };

  // Рендерим вложение в зависимости от типа
  const renderAttachment = () => {
    console.log('MessageBubble.renderAttachment:', {
      message_type: message.message_type,
      content: message.content,
      photo_url: message.photo_url,
      is_temp: message.is_temp,
      isSticker,
      message: message
    });

    // Если это стикер, обрабатываем его отдельно
    if (isSticker) {
      let packId, stickerId;
      
      // Проверяем паттерн в content
      const stickerMatch = message.content && message.content.match(/\[STICKER_(\d+)_(\d+)\]/);
      if (stickerMatch) {
        packId = stickerMatch[1];
        stickerId = stickerMatch[2];
        console.log('MessageBubble: Found sticker pattern:', { packId, stickerId, content: message.content });
      } else if (message.message_type === 'sticker') {
        // Если message_type === 'sticker', но нет паттерна в content,
        // возможно стикер пришел в другом формате
        console.log('MessageBubble: sticker message without pattern, checking for sticker data:', message);
        // Попробуем извлечь ID из других полей или использовать дефолтные значения
        packId = '1';
        stickerId = '1';
      }
      
      if (packId && stickerId) {
        const stickerUrl = `${STICKER_BASE}/api/messenger/stickers/${packId}/${stickerId}`;
        console.log('MessageBubble: Rendering sticker with URL:', stickerUrl);
        
        return (
          <View style={styles.stickerContainer}>
            <StickerRenderer 
              url={stickerUrl}
              style={styles.stickerImage}
              onLoad={() => console.log('Sticker loaded successfully:', stickerUrl)}
              onError={(error: any) => console.error('Sticker load error:', error)}
            />
          </View>
        );
      } else {
        console.log('MessageBubble: Could not extract packId and stickerId from sticker message:', message);
      }
    }

    if (!message.message_type || message.message_type === 'text') {
      console.log('MessageBubble: no attachment, message_type is text or empty');
      return null;
    }

    // Если это временное сообщение, показываем индикатор загрузки
    if (message.is_temp) {
      console.log('MessageBubble: showing loading indicator for temp message');
      return (
        <View style={styles.loadingContainer}>
          <Icon source="loading" size={24} color="#9365FF" />
          <Text style={styles.loadingText}>{message.content}</Text>
        </View>
      );
    }

    switch (message.message_type) {
      case 'photo':
        console.log('MessageBubble: processing photo attachment, photo_url:', message.photo_url);
        if (message.photo_url) {
          return (
            <TouchableOpacity 
              style={styles.photoContainer} 
              onPress={() => {
                setImageModalVisible(true);
                setModalImageLoading(true);
              }}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: message.photo_url }} 
                style={styles.attachmentImage}
                resizeMode="cover"
                onError={(error) => {
                  console.error('Image load error:', error);
                  console.error('Failed URL:', message.photo_url);
                }}
                onLoad={() => console.log('Image loaded successfully:', message.photo_url)}
              />
            </TouchableOpacity>
          );
        } else {
          console.log('MessageBubble: photo_url is missing for photo message');
          return (
            <View style={styles.errorContainer}>
              <Icon source="image-off" size={24} color="#666" />
              <Text style={styles.errorText}>Image not available</Text>
            </View>
          );
        }
      case 'video':
        console.log('MessageBubble: processing video attachment');
        return (
          <View style={styles.videoContainer}>
            <Icon source="video" size={32} color="#fff" />
            <Text style={styles.videoText}>Video</Text>
          </View>
        );
      case 'audio':
        console.log('MessageBubble: processing audio attachment');
        return (
          <View style={styles.audioContainer}>
            <Icon source="music" size={24} color="#fff" />
            <Text style={styles.audioText}>Audio</Text>
          </View>
        );
      case 'file':
        console.log('MessageBubble: processing file attachment');
        return (
          <View style={styles.fileContainer}>
            <Icon source="file" size={24} color="#fff" />
            <Text style={styles.fileText}>File</Text>
          </View>
        );
      default:
        console.log('MessageBubble: unknown message_type:', message.message_type);
        return null;
    }
  };

  return (
    <>
      <View style={[
        styles.messageWrapper,
        isOwn ? styles.ownWrapper : styles.otherWrapper,
        isSeriesStart() && styles.seriesStart,
        isSeriesEnd() && styles.seriesEnd,
        isSeriesMiddle() && styles.seriesMiddle,
      ]}>
        {/* Аватарка только в конце серии */}
        {showAvatar && senderInfo && (
          <View style={styles.avatarContainer}>
            {senderInfo.avatar ? (
              <Image source={{ uri: senderInfo.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarLetter}>{senderInfo.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Пустое место для аватарки в середине серии */}
        {!showAvatar && !isOwn && isGroupChat && (
          <View style={styles.avatarSpacer} />
        )}

        <View style={[
          styles.messageContentWrapper,
          isOwn ? styles.ownMessageContent : styles.otherMessageContent,
        ]}>
          {/* Ник отправителя только в начале серии */}
          {showSenderName && (
            <Text style={styles.senderName}>{senderInfo.name}</Text>
          )}
          
          <View style={[
            styles.container,
            isOwn ? styles.own : styles.other,
            isSticker && styles.stickerContainerStyle,
            getBorderRadius(),
          ]}>
            <View style={[
              styles.messageContent,
              isShortMessage ? styles.shortMessageContent : styles.longMessageContent,
              isSticker && styles.stickerMessageContent
            ]}>
              {message.message_type === 'text' && !isSticker && isShortMessage && (
                <>
                  <Text style={[
                    isOwn ? styles.ownText : styles.text,
                    styles.shortMessageText
                  ]}>{message.content}</Text>
                  {message.created_at && (
                    <Text style={[
                      styles.time, 
                      isOwn ? styles.ownTime : styles.otherTime,
                      styles.shortMessageTime
                    ]}>
                      {formatTime(message.created_at)}
                    </Text>
                  )}
                </>
              )}
              {message.message_type === 'text' && !isSticker && !isShortMessage && (
                <Text style={isOwn ? styles.ownText : styles.text}>{message.content}</Text>
              )}
              {renderAttachment()}
              {message.created_at && !isSticker && !isShortMessage && (
                <Text style={[
                  styles.time, 
                  isOwn ? styles.ownTime : styles.otherTime,
                  styles.longMessageTime
                ]}>
                  {formatTime(message.created_at)}
                </Text>
              )}
              {message.created_at && isSticker && (
                <Text style={styles.stickerTime}>
                  {formatTime(message.created_at)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Модальное окно для просмотра изображения */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon source="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalImageContainer}
            onPress={() => setImageModalVisible(false)}
            activeOpacity={1}
          >
            {modalImageLoading && (
              <View style={styles.modalLoadingContainer}>
                <Icon source="loading" size={32} color="#fff" />
                <Text style={styles.modalLoadingText}>Loading...</Text>
              </View>
            )}
            <Image 
              source={{ uri: message.photo_url }} 
              style={styles.modalImage}
              resizeMode="contain"
              onLoadStart={() => {
                console.log('Modal image loading started:', message.photo_url);
                setModalImageLoading(true);
              }}
              onLoad={() => {
                console.log('Modal image loaded successfully:', message.photo_url);
                setModalImageLoading(false);
              }}
              onError={(error) => {
                console.error('Modal image load error:', error);
                console.error('Modal image URL:', message.photo_url);
                setModalImageLoading(false);
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Основные стили контейнера
  container: {
    maxWidth: "85%",
    minWidth: 48,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginVertical: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  own: {
    backgroundColor: "#d0bcff",
    alignSelf: "flex-end",
  },
  other: {
    backgroundColor: "#2a2a2a",
    alignSelf: "flex-start",
  },
  
  // Стили для текста
  messageContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  ownText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  
  // Стили для времени
  time: {
    fontSize: 10,
    alignSelf: "flex-end",
    flexShrink: 0,
    marginTop: 2,
  },
  ownTime: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  otherTime: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  
  // Стили для длинных/коротких сообщений
  shortMessageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 60,
  },
  longMessageContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  longMessageTime: {
    marginTop: 4,
  },
  shortMessageTime: {
    marginLeft: 8,
    alignSelf: "flex-end",
  },
  shortMessageText: {
    flexShrink: 1,
  },
  
  // Стили для вложений
  attachmentImage: {
    width: 250,
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
  },
  videoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  videoText: {
    color: "#fff",
    fontSize: 12,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  audioText: {
    color: "#fff",
    fontSize: 12,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileText: {
    color: "#fff",
    fontSize: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  loadingText: {
    color: "#9365FF",
    fontSize: 12,
  },
  photoContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
  },
  errorText: {
    color: "#fff",
    fontSize: 12,
  },
  
  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalLoadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalLoadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
  
  // Стили для стикеров
  stickerContainer: {
    position: "relative",
    maxWidth: 256,
    minWidth: 150,
  },
  stickerImage: {
    width: 128,
    height: 128,
  },
  stickerMessageContent: {
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
    backgroundColor: "transparent",
  },
  stickerTime: {
    position: "absolute",
    bottom: 4,
    right: 4,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stickerContainerStyle: {
    backgroundColor: "transparent",
    padding: 0,
  },
  
  // Стили для layout сообщений
  messageWrapper: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "flex-end",
  },
  ownWrapper: {
    justifyContent: "flex-end",
  },
  otherWrapper: {
    justifyContent: "flex-start",
  },
  
  // Стили для серий сообщений
  seriesStart: {
    marginTop: 8,
  },
  seriesEnd: {
    marginBottom: 8,
  },
  seriesMiddle: {
    marginVertical: 1,
  },
  
  // Стили для аватарки
  avatarContainer: {
    marginRight: 8,
    marginBottom: 2,
  },
  avatarSpacer: {
    width: 32,
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: "#9365FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Стили для контента сообщений
  messageContentWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  ownMessageContent: {
    alignItems: "flex-end",
  },
  otherMessageContent: {
    alignItems: "flex-start",
  },
  
  // Стили для имени отправителя
  senderName: {
    fontSize: 14,
    color: "#9365FF",
    marginBottom: 4,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
});

export default MessageBubble; 