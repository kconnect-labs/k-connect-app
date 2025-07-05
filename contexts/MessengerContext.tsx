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
  refreshChats: () => Promise<void>;
  getMessages: (chatId: number, limit?: number) => Promise<any>;
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
          console.log('MessengerContext: received message via WebSocket:', message);
          
          // Process attachments if present
          processMessageAttachments(message, message.chat_id);
          
          setMessages(prev => {
            const chatMessages = prev[message.chat_id] || [];
            
            // Check if we have a temporary message for this content
            const tempMessageIndex = chatMessages.findIndex(msg => 
              msg.is_temp && 
              msg.content === message.content && 
              msg.sender_id === message.sender_id
            );
            
            let newMessages;
            if (tempMessageIndex !== -1) {
              // Replace temporary message with real message
              console.log('MessengerContext: replacing temp message with real message');
              newMessages = [...chatMessages];
              newMessages[tempMessageIndex] = message;
            } else {
              // Add new message if no matching temp message found
              console.log('MessengerContext: adding new message');
              newMessages = [...chatMessages, message];
            }
            
            return {
              ...prev,
              [message.chat_id]: newMessages
            };
          });
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

  const value = useMemo<MessengerContextValue>(
    () => ({
      sendMessage,
      uploadFile,
      isConnected,
      chats,
      messages,
      refreshChats,
      getMessages,
    }),
    [sendMessage, uploadFile, isConnected, chats, messages, refreshChats, getMessages]
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