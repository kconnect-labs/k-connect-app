import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import api from './api';

// Wrapper functions for cross-platform storage
const storage = {
  setItemAsync: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

interface User {

}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  needsProfileSetup?: boolean;
  chat_id?: string;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface ProfileSetupResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthCheckResponse {
  isAuthenticated: boolean;
  user?: User;
  needsProfileSetup?: boolean;
  error?: string;
}

interface LogoutResponse {
  success: boolean;
}

interface ProfileData {
  [key: string]: any;
  photo?: {
    uri: string;
  };
}

const AuthService = {
  login: async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(
        '/api/auth/login?mobile=1',
        {
          username: usernameOrEmail,
          password,
        },
        {
          headers: { 'X-Mobile-Client': '1', 'X-API-Key': 'liquide-gg-v2' },
        }
      );

      console.log('AuthService.login raw response', response.data);
      if (response.data.success) {
        // Если вход выполнен успешно, сохраняем данные пользователя
        if (response.data.user) {
          await storage.setItemAsync('user', JSON.stringify(response.data.user));
          await storage.setItemAsync('needsProfileSetup', 'false');

          // Сохраняем токен, если он предоставлен
          let authTokenToStore = response.data.token;
          if (!authTokenToStore) {
            const hdr = response.headers as any;
            authTokenToStore = hdr?.authorization || hdr?.['auth-token'] || hdr?.['x-auth-token'] || null;
            if (authTokenToStore && typeof authTokenToStore === 'string' && authTokenToStore.startsWith('Bearer ')) {
              authTokenToStore = authTokenToStore.replace('Bearer ', '');
            }
          }

          // --- session key ---
          let sessionKeyToStore: string | null | undefined = (response.data as any).session_key;
          if (!sessionKeyToStore) {
            const hdr = response.headers as any;
            sessionKeyToStore = hdr?.['x-session-key'] || null;
          }

          if (authTokenToStore) {
            await storage.setItemAsync('authToken', authTokenToStore);
            console.log('AuthService: stored authToken', authTokenToStore);

            // сохраняем sessionKey, если пришёл сразу
            if (sessionKeyToStore) {
              await storage.setItemAsync('sessionKey', sessionKeyToStore);
              console.log('AuthService: stored sessionKey', sessionKeyToStore);
            } else {
              // если всё же ещё нет sessionKey, попробуем получить старым способом
              try {
                const skRes = await api.get('/apiMes/auth/get-session-key', {
                  headers: { 'Cache-Control': 'no-cache', Authorization: `Bearer ${authTokenToStore}` },
                });
                if (skRes.data?.session_key) {
                  await storage.setItemAsync('sessionKey', skRes.data.session_key);
                  console.log('AuthService: stored sessionKey (fallback)', skRes.data.session_key);
                }
              } catch (e) {
                console.warn('Не удалось получить session_key', e);
              }
            }

            // если есть sessionKey, обновляем default header сразу
            if (sessionKeyToStore) {
              api.defaults.headers.common['Authorization'] = `Bearer ${sessionKeyToStore}`;
            }
          }

          // Всегда выводим содержимое SecureStore даже если token не пришёл
          try {
            const at = await storage.getItemAsync('authToken');
            const sk = await storage.getItemAsync('sessionKey');
            console.log('SecureStore snapshot (final)', { authToken: at, sessionKey: sk });
          } catch {}
        }

        if (response.data.needsProfileSetup) {
          await storage.setItemAsync('needsProfileSetup', 'true');

          if (response.data.chat_id) {
            await storage.setItemAsync('chatId', response.data.chat_id);
          }
        } else {
          await storage.deleteItemAsync('needsProfileSetup');
        }

        return response.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        throw error;
      } else {
        console.error('Login error:', error);
        throw new Error('Login failed due to unknown error');
      }
    }
  },



  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', {
        username,
        email,
        password,
      }, {
        headers: {
          'X-API-Key': 'liquide-gg-v2'
        }
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Register error:', error.message);
        throw error;
      } else {
        console.error('Register error:', error);
        throw new Error('Registration failed due to unknown error');
      }
    }
  },

  setupProfile: async (profileData: ProfileData): Promise<ProfileSetupResponse> => {
    try {
      const chatId = await storage.getItemAsync('chatId');
      if (chatId) {
        profileData.chat_id = chatId;
      }

      const formData = new FormData();

      Object.keys(profileData).forEach((key) => {
        if (key === 'photo' && profileData.photo && profileData.photo.uri) {
          const photoUri = profileData.photo.uri;
          const filename = photoUri.split('/').pop() || '';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';

          formData.append('photo', {
            uri: photoUri,
            name: filename,
            type,
          } as any);
        } else {
          formData.append(key, profileData[key]);
        }
      });

      const response = await api.post<ProfileSetupResponse>('/api/auth/register-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.user) {
        // Store user data
        await storage.setItemAsync('user', JSON.stringify(response.data.user));
        await storage.setItemAsync('needsProfileSetup', 'false');
        await storage.deleteItemAsync('chatId');
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Profile setup error:', error.message);
        throw error;
      } else {
        console.error('Profile setup error:', error);
        throw new Error('Profile setup failed due to unknown error');
      }
    }
  },

  checkAuth: async (): Promise<AuthCheckResponse> => {
    try {
      const response = await api.get<AuthCheckResponse>('/api/auth/check');

      if (response.data.isAuthenticated && response.data.user) {
        await storage.setItemAsync('user', JSON.stringify(response.data.user));
        await storage.setItemAsync('needsProfileSetup', 'false');
      } else if (response.data.needsProfileSetup) {
        await storage.setItemAsync('needsProfileSetup', 'true');
      } else {
        await storage.deleteItemAsync('user');
        await storage.deleteItemAsync('needsProfileSetup');
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Auth check error:', error.message);
        return {
          isAuthenticated: false,
          error: error.message,
        };
      } else {
        console.error('Auth check error:', error);
        return {
          isAuthenticated: false,
          error: 'Ошибка проверки аутентификации',
        };
      }
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    try {
      await api.post('/api/auth/logout');

      await storage.deleteItemAsync('user');
      await storage.deleteItemAsync('authToken');
      await storage.deleteItemAsync('needsProfileSetup');
      await storage.deleteItemAsync('chatId');

      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Logout error:', error.message);
      } else {
        console.error('Logout error:', error);
      }

      await storage.deleteItemAsync('user');
      await storage.deleteItemAsync('authToken');
      await storage.deleteItemAsync('needsProfileSetup');
      await storage.deleteItemAsync('chatId');

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Logout failed due to unknown error');
      }
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userString = await storage.getItemAsync('user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка при получении пользователя из хранилища:', error.message);
      } else {
        console.error('Ошибка при получении пользователя из хранилища:', error);
      }
      return null;
    }
  },

  needsProfileSetup: async (): Promise<boolean> => {
    try {
      const needsSetup = await storage.getItemAsync('needsProfileSetup');
      return needsSetup === 'true';
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка при проверке настройки профиля:', error.message);
      } else {
        console.error('Ошибка при проверке настройки профиля:', error);
      }
      return false;
    }
  },
};

export default AuthService;
