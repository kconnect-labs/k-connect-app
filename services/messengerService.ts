import api from "./api";

const API_BASE = "https://k-connect.ru";

export interface SendMessageResult {
  success: boolean;
  error?: string;
}

export interface Message {
  id: number | string;
  content: string;
  sender_id: number;
  chat_id: number;
  message_type: string;
  created_at: string;
  is_temp?: boolean;
  photo_url?: string;
  video_url?: string;
  audio_url?: string;
  file_url?: string;
}

class MessengerService {
  private websocket: WebSocket | null = null;
  private sessionKey: string | null = null;
  public onMessage?: (message: Message) => void;


  public connect(sessionKey?: string) {
    console.log('MessengerService.connect called:', { sessionKey: !!sessionKey, wsState: this.websocket?.readyState });
    
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      console.log('MessengerService.connect: WebSocket already connected');
      return;
    }

    if (sessionKey) {
      this.sessionKey = sessionKey;
      console.log('MessengerService.connect: sessionKey set');
    }

    try {
      const wsProtocol = API_BASE.startsWith("https") ? "wss" : "ws";
      const wsUrl = `${wsProtocol}://k-connect.ru/ws/messenger`;
      console.log('MessengerService.connect: connecting to:', wsUrl);
      
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('MessengerService.connect: WebSocket opened');
        if (this.sessionKey) {
          const authMsg = {
            type: "auth",
            session_key: this.sessionKey,
          } as const;
          console.log('MessengerService.connect: sending auth message:', authMsg);
          this.websocket?.send(JSON.stringify(authMsg));
        }
      };

      // Handle incoming messages
      this.websocket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("Messenger WS message", data);
          
          // Handle new message
          if (data.type === 'new_message' && data.message) {
            console.log('MessengerService: received new message:', data.message);
            // Add chat_id to the message from the WebSocket data
            const messageWithChatId = {
              ...data.message,
              chat_id: data.chatId
            };
            console.log('MessengerService: message with chat_id:', messageWithChatId);
            if (this.onMessage) {
              this.onMessage(messageWithChatId);
            }
          }
        } catch (err) {
          console.warn("Unable to parse WS data", err);
        }
      };

      this.websocket.onerror = (err) => {
        console.error("Messenger WS error", err);
      };
      
      this.websocket.onclose = (event) => {
        console.log("Messenger WS closed:", event.code, event.reason);
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

  public isWebSocketConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }

  public setSessionKey(key: string) {
    this.sessionKey = key;
  }

  public async sendMessage(
    chatId: number,
    content: string
  ): Promise<SendMessageResult> {
    console.log('MessengerService.sendMessage called:', { chatId, content, sessionKey: !!this.sessionKey });
    
    if (!chatId || !content) {
      console.log('MessengerService.sendMessage: missing params');
      return { success: false, error: "chatId and content are required" };
    }

    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      console.log('MessengerService.sendMessage: using WebSocket');
      try {
        const message = { 
          type: "send_message", 
          chatId, 
          text: content 
        };
        console.log('MessengerService.sendMessage: sending WebSocket message:', message);
        this.websocket.send(JSON.stringify(message));
        return { success: true };
      } catch (err) {
        console.warn("WS send failed, falling back to HTTP", err);
      }
    } else {
      console.log('MessengerService.sendMessage: WebSocket not available, using HTTP');
    }

    console.log('MessengerService.sendMessage: using HTTP fallback');
    try {
      const payload = { text: content };
      console.log('MessengerService.sendMessage: HTTP payload:', payload);
      
      const res = await api.post(
        `/apiMes/messenger/chats/${chatId}/messages`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(this.sessionKey ? { Authorization: `Bearer ${this.sessionKey}` } : {}),
          },
        }
      );
      console.log('MessengerService.sendMessage: HTTP response:', res.data);
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

  public getFileUrl(chatId: number, filePath: string): string {
    console.log('MessengerService.getFileUrl called:', { chatId, filePath, hasSessionKey: !!this.sessionKey });
    console.log('MessengerService.getFileUrl: API_BASE =', API_BASE);
    
    if (!this.sessionKey || !filePath) {
      console.log('MessengerService.getFileUrl: missing params:', { hasSessionKey: !!this.sessionKey, filePath });
      return '';
    }
    
    // Если путь уже содержит /static/, это аватар или статический файл
    if (filePath.includes('/static/')) {
      // Проверяем, не содержит ли путь уже /api/messenger/files/
      if (filePath.includes('/api/messenger/files/')) {
        // Убираем лишнюю часть пути
        const staticIndex = filePath.indexOf('/static/');
        if (staticIndex !== -1) {
          filePath = filePath.substring(staticIndex);
          console.log(`Исправлен двойной путь: ${filePath}`);
        }
      }
      
      // Для аватаров и статических файлов просто добавляем токен авторизации
      const authParam = `token=${encodeURIComponent(this.sessionKey)}`;
      const url = `${filePath}?${authParam}`;
      console.log(`Generated static file URL: ${url}`);
      return url;
    }
    
    // Для файлов сообщений используем API messenger/files
    const authParam = `token=${encodeURIComponent(this.sessionKey)}`;
    let url = `${API_BASE}/api/messenger/files/${chatId}/`;
    
    console.log('MessengerService.getFileUrl: building URL with /api prefix:', url);
    
    if (filePath.includes(`attachments/chat_${chatId}/`)) {
      // Убираем префикс с ID чата
      const pathParts = filePath.split(`attachments/chat_${chatId}/`);
      url += pathParts[1];
    } else {
      // Добавляем путь как есть
      url += filePath;
    }
    
    url += `?${authParam}`;
    console.log(`Generated message file URL: ${url}`);
    return url;
  }

  public async uploadFile(chatId: number, file: any, type: string, replyToId?: number): Promise<any> {
    console.log('MessengerService.uploadFile called:', { chatId, type, replyToId, file });
    
    if (!this.sessionKey || !chatId || !file) {
      console.log('MessengerService.uploadFile: missing required params:', { 
        hasSessionKey: !!this.sessionKey, 
        chatId, 
        hasFile: !!file 
      });
      return null;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message_type', type);
      
      if (replyToId) {
        formData.append('reply_to_id', String(replyToId));
      }
      
      console.log('MessengerService.uploadFile: sending request to:', `${API_BASE}/apiMes/messenger/chats/${chatId}/upload`);
      console.log('MessengerService.uploadFile: formData entries:', {
        file: file,
        message_type: type,
        reply_to_id: replyToId
      });
      
      const response = await fetch(`${API_BASE}/apiMes/messenger/chats/${chatId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionKey}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      console.log('MessengerService.uploadFile: response status:', response.status);
      console.log('MessengerService.uploadFile: response headers:', response.headers);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
        throw new Error('API returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('MessengerService.uploadFile: response data:', data);
      
      if (data.success) {
        console.log('MessengerService.uploadFile: upload successful, returning message:', data.message);
        return data.message;
      } else {
        console.error('Upload failed:', data.error);
        return null;
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      return null;
    }
  }

  public async testImageUrl(url: string): Promise<{ success: boolean; contentType?: string; error?: string }> {
    try {
      console.log('Testing image URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
        }
      });
      
      console.log('Image URL test response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          return { success: true, contentType };
        } else {
          const text = await response.text();
          console.log('Server returned non-image content:', text.substring(0, 200));
          return { success: false, error: `Server returned ${contentType}, not an image` };
        }
      } else {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      console.error('Error testing image URL:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export default MessengerService; 