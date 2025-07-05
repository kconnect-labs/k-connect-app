import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import MessengerService, { SendMessageResult } from "../services/messengerService";
import useAuthStore from "../stores/useAuthStore";

interface MessengerContextValue {
  sendMessage: (chatId: number, content: string) => Promise<SendMessageResult>;
  isConnected: boolean;
  chats: any[];
  refreshChats: () => Promise<void>;
}

const MessengerContext = createContext<MessengerContextValue | null>(null);

export const MessengerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const [service] = useState(() => new MessengerService());
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<any[]>([]);

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
          // override api default header for subsequent requests
          api.defaults.headers.common["Authorization"] = `Bearer ${sessionKey}`;
        }
        service.connect(sessionKey || undefined);
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
      setChats(data.chats);
    }
  }, [service]);

  // Load chats when connection established
  useEffect(() => {
    if (isConnected) {
      refreshChats();
    }
  }, [isConnected, refreshChats]);

  const value = useMemo<MessengerContextValue>(
    () => ({
      sendMessage: service.sendMessage.bind(service),
      isConnected,
      chats,
      refreshChats,
    }),
    [service, isConnected, chats, refreshChats]
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