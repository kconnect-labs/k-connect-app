
import api from "./api";

const API_BASE = "https://k-connect.ru";

export interface SendMessageResult {
  success: boolean;
  error?: string;
  message?: any;
}

class MessengerService {
  private websocket: WebSocket | null = null;
  private sessionKey: string | null = null;


  public connect(sessionKey?: string) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) return;

    if (sessionKey) {
      this.sessionKey = sessionKey;
    }

    try {
      const wsProtocol = API_BASE.startsWith("https") ? "wss" : "ws";
      const wsUrl = `${wsProtocol}://k-connect.ru/ws/messenger`;
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        if (this.sessionKey) {
          const authMsg = {
            type: "auth",
            session_key: this.sessionKey,
          } as const;
          this.websocket?.send(JSON.stringify(authMsg));
        }
      };

      // In this stub we only log inbound messages.
      this.websocket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("Messenger WS message", data);
        } catch (err) {
          console.warn("Unable to parse WS data", err);
        }
      };

      this.websocket.onerror = (err) => {
        console.error("Messenger WS error", err);
      };
    } catch (err) {
      console.error("Messenger WebSocket connect error", err);
    }
  }

  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  public setSessionKey(key: string) {
    this.sessionKey = key;
  }

  public async sendMessage(
    chatId: number,
    content: string
  ): Promise<SendMessageResult> {
    if (!chatId || !content) {
      return { success: false, error: "chatId and content are required" };
    }

    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      try {
        this.websocket.send(
          JSON.stringify({ type: "send_message", chatId, content })
        );
        return { success: true };
      } catch (err) {
        console.warn("WS send failed, falling back to HTTP", err);
      }
    }

    try {
      const res = await api.post(
        `/apiMes/messenger/chats/${chatId}/messages`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            ...(this.sessionKey ? { Authorization: `Bearer ${this.sessionKey}` } : {}),
          },
        }
      );
      return res.data ?? { success: true };
    } catch (err) {
      console.error("HTTP sendMessage error", err);
      return { success: false, error: "Network error" };
    }
  }

  public async getChats(page: number = 1, perPage: number = 50) {
    try {
      const res = await api.get(`/apiMes/messenger/chats`, {
        params: { page, per_page: perPage },
        headers: {
          "Content-Type": "application/json",
          ...(this.sessionKey ? { Authorization: `Bearer ${this.sessionKey}` } : {}),
        },
      });
      return res.data;
    } catch (err) {
      console.error("getChats error", err);
      return {
        success: false,
        error: "Network error",
        chats: [],
      };
    }
  }

  public async getMessages(chatId: number, limit: number = 50, beforeId?: number) {
    try {
      const res = await api.get(`/apiMes/messenger/chats/${chatId}/messages`, {
        params: { limit, before_id: beforeId },
        headers: {
          ...(this.sessionKey ? { Authorization: `Bearer ${this.sessionKey}` } : {}),
        },
      });
      return res.data;
    } catch (err) {
      console.error("getMessages error", err);
      return { success: false, messages: [] };
    }
  }
}

export default MessengerService; 