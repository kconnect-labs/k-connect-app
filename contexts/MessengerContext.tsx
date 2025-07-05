import useMessengerStore from "@stores/useMessengerStore";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import MessengerService, { Message, SendMessageResult } from "../services/messengerService";
import useAuthStore from "../stores/useAuthStore";

interface MessengerContextValue {
  sendMessage: (chatId: number, content: string) => Promise<SendMessageResult>;
  uploadFile: (chatId: number, file: any, type: string, replyToId?: number) => Promise<any>;
  isConnected: boolean;
  chats: any[];
  messages: { [chatId: number]: any[] };
  unreadCounts: { [key: number]: number };
  getTotalUnreadCount: () => number;
  refreshChats: () => Promise<void>;
  getMessages: (chatId: number, limit?: number) => Promise<any>;
  markMessageAsRead: (messageId: number) => Promise<void>;
  markAllMessagesAsRead: (chatId: number) => Promise<void>;
}

const MessengerContext = createContext<MessengerContextValue | null>(null);

export const MessengerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const { setSessionKey } = useMessengerStore();
  const [service] = useState(() => new MessengerService());
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<{ [chatId: number]: any[] }>({});
  const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>({});

  // Helper function to process attachments in messages
  const processMessageAttachments = (message: any, chatId: number) => {
    if (message.message_type && message.message_type !== 'text') {
      console.log('processMessageAttachments: processing attachment message:', {
        message_type: message.message_type,
        content: message.content,
        chat_id: chatId
      });
      
      const messageType = message.message_type;
      const content = message.content;
      
      if (content) {
        if (messageType === 'photo' && !message.photo_url) {
          message.photo_url = service.getFileUrl(chatId, content);
          console.debug(`Generated URL for photo: ${message.photo_url}`);
        } else if (messageType === 'video' && !message.video_url) {
          message.video_url = service.getFileUrl(chatId, content);
          console.debug(`Generated URL for video: ${message.video_url}`);
        } else if (messageType === 'audio' && !message.audio_url) {
          message.audio_url = service.getFileUrl(chatId, content);
          console.debug(`Generated URL for audio: ${message.audio_url}`);
        } else if (messageType === 'file' && !message.file_url) {
          message.file_url = service.getFileUrl(chatId, content);
          console.debug(`Generated URL for file: ${message.file_url}`);
        }
      } else {
        console.warn(`Message ${message.id} of type ${messageType} has no content`);
      }
    }
    return message;
  };

  // Connect WS when user appears
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const setup = async () => {
      try {
        // 1. Try load from storage
        let sessionKey = await SecureStore.getItemAsync("sessionKey");

        // 2. If not found, fetch from API
        if (!sessionKey) {
          try {
            const res = await api.get("/apiMes/auth/get-session-key", {
              headers: { "Cache-Control": "no-cache" },
            });
            if (res.data?.session_key) {
              sessionKey = res.data.session_key;
              await SecureStore.setItemAsync("sessionKey", sessionKey as string);
            } else {
              console.warn("get-session-key returned no key", res.data);
            }
          } catch (err) {
            console.error("Ошибка получения session_key", err);
          }
        }

        // 3. Fallback: use JWT authToken as sessionKey (backend accepts it)
        if (!sessionKey) {
          const jwtToken = await SecureStore.getItemAsync("authToken");
          if (jwtToken) {
            console.log("Messenger: using JWT as sessionKey fallback");
            sessionKey = jwtToken;
            await SecureStore.setItemAsync("sessionKey", jwtToken as string);
          }
        }

        // Connect WS (may be without key)
        if (sessionKey) {
          service.setSessionKey(sessionKey);
          setSessionKey(sessionKey); // Update store
          // override api default header for subsequent requests
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionKey}`;
        }
        service.connect(sessionKey || undefined);
        
        // Set up message handler
        service.onMessage = (message: Message) => {
          console.log('MessengerContext: received message via WebSocket:', {
            id: message.id,
            chat_id: message.chat_id,
            content: message.content,
            sender_id: message.sender_id,
            created_at: message.created_at
          });
          console.log('MessengerContext: processing message...');
          
          // Process attachments if present
          processMessageAttachments(message, message.chat_id);
          
          // Store original timestamp for sorting
          const originalTimestamp = message.created_at;
          
          // Format message time for display (but keep original for sorting)
          if (message.created_at) {
            const date = new Date(message.created_at);
            if (!isNaN(date.getTime())) {
              message.created_at = date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
              // Store original timestamp for sorting
              (message as any).original_timestamp = originalTimestamp;
            }
          }
          
          setMessages(prev => {
            const chatMessages = prev[message.chat_id] || [];
            
            // Check if message already exists (avoid duplicates)
            if (chatMessages.some(msg => msg.id === message.id)) {
              console.log('MessengerContext: message already exists, ignoring duplicate');
              return prev;
            }
            
            // Add new message and sort by ID (like in sample)
            const newMessages = [...chatMessages, message].sort((a: any, b: any) => {
              const aId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
              const bId = typeof b.id === 'string' ? parseInt(b.id) : b.id;
              return aId - bId;
            });
            
            console.log(`MessengerContext: added message ${message.id} to chat ${message.chat_id}, new count: ${newMessages.length}`);
            
            return {
              ...prev,
              [message.chat_id]: newMessages
            };
          });
          
          // Update unread count if message is from another user
          const isFromCurrentUser = message.sender_id === user?.id;
          if (!isFromCurrentUser) {
            setUnreadCounts(prev => ({
              ...prev,
              [message.chat_id]: (prev[message.chat_id] || 0) + 1
            }));
            console.log(`Incremented unread count for chat ${message.chat_id}`);
          }
          
          // Update last message in chat list
          setChats(prev => {
            const chatIndex = prev.findIndex(c => c.id === message.chat_id);
            if (chatIndex === -1) {
              console.log(`Chat ${message.chat_id} not found in chat list, refreshing chats...`);
              setTimeout(() => refreshChats(), 100);
              return prev;
            }
            
            const chat = { ...prev[chatIndex], last_message: message };
            
            // Update avatar for personal chats
            if (!chat.is_group && chat.members) {
              const otherMember = chat.members.find((m: any) => {
                const memberId = m.user_id || m.id;
                const memberIdStr = memberId ? String(memberId) : null;
                const currentUserIdStr = user?.id ? String(user.id) : null;
                return memberIdStr && currentUserIdStr && memberIdStr !== currentUserIdStr;
              });
              
              if (otherMember) {
                const otherUserId = otherMember.user_id || otherMember.id;
                
                // Update avatar if needed
                if (!chat.avatar || 
                    (chat.avatar && typeof chat.avatar === 'string' && !chat.avatar.startsWith('/static/'))) {
                  
                  const photo = otherMember.photo || otherMember.avatar;
                  if (otherUserId && photo) {
                    // Build avatar URL manually since service doesn't have getAvatarUrl
                    if (photo.startsWith('/static/')) {
                      chat.avatar = `https://k-connect.ru${photo}`;
                    } else {
                      chat.avatar = `https://k-connect.ru/static/uploads/avatar/${otherUserId}/${photo}`;
                    }
                    console.log(`Updated chat ${message.chat_id} avatar: ${chat.avatar}`);
                  }
                }
              }
            }
            
            // Move chat to top of list
            const newChats = [...prev];
            newChats.splice(chatIndex, 1);
            console.log(`Moving chat ${message.chat_id} to top of chat list`);
            return [chat, ...newChats];
          });
          
          console.log('MessengerContext: message processing completed');
        };
        
        if (isMounted) setIsConnected(true);
      } catch (err) {
        console.error("MessengerProvider connect error", err);
      }
    };

    setup();

    return () => {
      isMounted = false;
      service.disconnect();
      setIsConnected(false);
    };
  }, [user]);

  const refreshChats = React.useCallback(async () => {
    const data = await service.getChats();
    if (data?.chats) {
      // Process attachments for last messages in chats
      const processedChats = data.chats.map((chat: any) => {
        if (chat.last_message) {
          processMessageAttachments(chat.last_message, chat.id);
        }
        return chat;
      });
      
      setChats(processedChats);
      
      // Update unread counts from server data
      const newUnreadCounts: { [key: number]: number } = {};
      processedChats.forEach((chat: any) => {
        newUnreadCounts[chat.id] = chat.unread_count || 0;
      });
      
      setUnreadCounts(prevCounts => {
        const prevKeys = Object.keys(prevCounts);
        const newKeys = Object.keys(newUnreadCounts);

        if (prevKeys.length === newKeys.length && prevKeys.every(k => prevCounts[parseInt(k)] === newUnreadCounts[parseInt(k)])) {
          return prevCounts;
        }

        return newUnreadCounts;
      });
      
      console.log('Updated unread counts from server:', newUnreadCounts);
    }
  }, [service]);

  const getMessages = React.useCallback(async (chatId: number, limit: number = 50) => {
    const data = await service.getMessages(chatId, limit);
    if (data?.messages) {
      // Process attachments for messages loaded via HTTP
      const processedMessages = data.messages.map((message: any) => {
        return processMessageAttachments(message, chatId);
      });
      
      setMessages(prev => ({
        ...prev,
        [chatId]: processedMessages
      }));
    }
    return data;
  }, [service]);

  // Enhanced sendMessage with temporary message support
  const sendMessage = React.useCallback(async (chatId: number, content: string): Promise<SendMessageResult> => {
    console.log('sendMessage called:', { chatId, content, user: user?.id });
    
    if (!content.trim()) {
      console.log('sendMessage: empty content');
      return { success: false, error: "Message cannot be empty" };
    }

    // Create temporary message for immediate display
    const tempMessage = {
      id: `temp_${Date.now()}_${Math.random()}`,
      content: content,
      sender_id: user?.id,
      chat_id: chatId,
      message_type: 'text',
      created_at: new Date().toISOString(),
      is_temp: true
    };

    // Process attachments for temporary message if needed
    processMessageAttachments(tempMessage, chatId);

    console.log('sendMessage: created temp message:', tempMessage);

    // Add temporary message to state
    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      const newMessages = [...chatMessages, tempMessage];
      console.log('sendMessage: updated messages for chat', chatId, 'count:', newMessages.length);
      return {
        ...prev,
        [chatId]: newMessages
      };
    });

    // Send message via service
    console.log('sendMessage: calling service.sendMessage');
    const result = await service.sendMessage(chatId, content);
    console.log('sendMessage: service result:', result);

    if (result.success) {
      console.log('sendMessage: success, keeping temp message until real message arrives');
      // Don't remove temporary message immediately - let it stay until real message arrives via WebSocket
      // The temporary message will be replaced when the real message comes in
      console.log('sendMessage: WebSocket connected:', service.isWebSocketConnected());
    } else {
      console.log('sendMessage: error, removing temp message');
      // Remove temporary message on error
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMessages.filter(msg => msg.id !== tempMessage.id)
        };
      });
    }

    return result;
  }, [service, user?.id]);

  // Upload file function
  const uploadFile = React.useCallback(async (chatId: number, file: any, type: string, replyToId?: number): Promise<any> => {
    console.log('uploadFile called:', { chatId, type, replyToId });
    
    if (!file) {
      console.log('uploadFile: no file provided');
      return null;
    }

    // Create temporary message for immediate display
    const tempMessage = {
      id: `temp_${Date.now()}_${Math.random()}`,
      content: `Uploading ${type}...`,
      sender_id: user?.id,
      chat_id: chatId,
      message_type: type,
      created_at: new Date().toISOString(),
      is_temp: true
    };

    console.log('uploadFile: created temp message:', tempMessage);

    // Add temporary message to state
    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      const newMessages = [...chatMessages, tempMessage];
      return {
        ...prev,
        [chatId]: newMessages
      };
    });

    // Upload file via service
    console.log('uploadFile: calling service.uploadFile');
    const result = await service.uploadFile(chatId, file, type, replyToId);
    console.log('uploadFile: service result:', result);

    if (result) {
      console.log('uploadFile: success, removing temp message');
      // Remove temporary message when real message arrives
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMessages.filter(msg => msg.id !== tempMessage.id)
        };
      });
    } else {
      console.log('uploadFile: error, removing temp message');
      // Remove temporary message on error
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMessages.filter(msg => msg.id !== tempMessage.id)
        };
      });
    }

    return result;
  }, [service, user?.id]);

  // Load chats when connection established
  useEffect(() => {
    if (isConnected) {
      refreshChats();
    }
  }, [isConnected, refreshChats]);

  // Function to get total unread count
  const getTotalUnreadCount = React.useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  }, [unreadCounts]);

  // Function to mark message as read
  const markMessageAsRead = React.useCallback(async (messageId: number) => {
    if (!user || !messageId) return;
    
    try {
      // Find message in cache
      const message = Object.values(messages).flat().find(msg => msg.id === messageId);
      
      // Check if it's not our own message
      if (message && message.sender_id === user?.id) {
        console.log(`Skipping read receipt for own message ${messageId}`);
        return;
      }
      
      // Send request to server
      const response = await api.post(`/apiMes/messenger/read/${messageId}`);
      
      if (response.data?.success) {
        console.log(`Message ${messageId} marked as read via API`);
        
        // Update local state - remove from unread counts
        setUnreadCounts(prev => {
          const updated = { ...prev };
          // Find which chat this message belongs to
          Object.keys(messages).forEach(chatId => {
            const chatMessages = messages[parseInt(chatId)];
            if (chatMessages.some((msg: any) => msg.id === messageId)) {
              const chatIdNum = parseInt(chatId);
              if (updated[chatIdNum] && updated[chatIdNum] > 0) {
                updated[chatIdNum] = Math.max(0, updated[chatIdNum] - 1);
              }
            }
          });
          return updated;
        });
        
        // Send read receipt via WebSocket
        const chatId = Object.keys(messages).find(chatId => 
          messages[parseInt(chatId)].some((msg: any) => msg.id === messageId)
        );
        
        if (chatId && service.isWebSocketConnected()) {
          const targetMessage = messages[parseInt(chatId)].find((msg: any) => msg.id === messageId);
          if (targetMessage && targetMessage.sender_id !== user?.id) {
            console.log(`Sending read receipt for message ${messageId} in chat ${chatId}`);
            service.sendReadReceipt(messageId, parseInt(chatId));
          }
        }
      } else {
        console.warn(`Failed to mark message ${messageId} as read:`, response.data);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [user, messages]);

  // Function to mark all messages in chat as read
  const markAllMessagesAsRead = React.useCallback(async (chatId: number) => {
    if (!user || !chatId) return;
    
    try {
      // Try new API endpoint first
      const response = await api.post(`/apiMes/messenger/chats/${chatId}/read-all`);
      
      if (response.data?.success) {
        console.log(`All messages in chat ${chatId} marked as read via API`);
        
        // Update local state - clear unread count for this chat
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
        
        // Send read receipt via WebSocket for the last unread message
        if (service.isWebSocketConnected()) {
          const chatMessages = messages[chatId] || [];
          const unreadMessages = chatMessages.filter((msg: any) => 
            msg.sender_id !== user?.id && 
            (!msg.read_by || !msg.read_by.includes(user?.id))
          );
          
          if (unreadMessages.length > 0) {
            const lastUnread = unreadMessages.reduce((a: any, b: any) => (a.id > b.id ? a : b));
            if (lastUnread && lastUnread.sender_id !== user?.id) {
              console.log(`Sending read receipt for last unread message ${lastUnread.id} in chat ${chatId}`);
              service.sendReadReceipt(lastUnread.id, chatId);
            }
          }
        }
      } else {
        console.warn(`Failed to mark all messages as read in chat ${chatId}:`, response.data);
      }
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      
      // Fallback: try old API endpoint
      try {
        const fallbackResponse = await api.post(`/messenger/read-all/${chatId}`);
        if (fallbackResponse.data?.success) {
          console.log(`All messages in chat ${chatId} marked as read via fallback API`);
          setUnreadCounts(prev => ({
            ...prev,
            [chatId]: 0
          }));
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
    }
  }, [user]);

  const value = useMemo<MessengerContextValue>(
    () => ({
      sendMessage,
      uploadFile,
      isConnected,
      chats,
      messages,
      unreadCounts,
      getTotalUnreadCount,
      refreshChats,
      getMessages,
      markMessageAsRead,
      markAllMessagesAsRead,
    }),
    [sendMessage, uploadFile, isConnected, chats, messages, unreadCounts, getTotalUnreadCount, refreshChats, getMessages, markMessageAsRead, markAllMessagesAsRead]
  );

  return (
    <MessengerContext.Provider value={value}>{children}</MessengerContext.Provider>
  );
};

export const useMessenger = () => {
  const ctx = useContext(MessengerContext);
  if (!ctx) {
    throw new Error("useMessenger must be used inside MessengerProvider");
  }
  return ctx;
}; 