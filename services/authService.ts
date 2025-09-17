import * as SecureStorage from 'expo-secure-store';
import api from './api';

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
          headers: { 'X-Mobile-Client': '1', 'X-API-Key': 'liquide-v2' },
        }
      );

      console.log('AuthService.login raw response', response.data);
      if (response.data.success) {
        // Если вход выполнен успешно, сохраняем данные пользователя
        if (response.data.user) {
          await SecureStorage.setItemAsync('user', JSON.stringify(response.data.user));
          await SecureStorage.setItemAsync('needsProfileSetup', 'false');

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
            await SecureStorage.setItemAsync('authToken', authTokenToStore);
            console.log('AuthService: stored authToken', authTokenToStore);

            // сохраняем sessionKey, если пришёл сразу
            if (sessionKeyToStore) {
              await SecureStorage.setItemAsync('sessionKey', sessionKeyToStore);
              console.log('AuthService: stored sessionKey', sessionKeyToStore);
            } else {
              // если всё же ещё нет sessionKey, попробуем получить старым способом
              try {
                const skRes = await api.get('/apiMes/auth/get-session-key', {
                  headers: { 'Cache-Control': 'no-cache', Authorization: `Bearer ${authTokenToStore}` },  
                });
                if (skRes.data?.session_key) {
                  await SecureStorage.setItemAsync('sessionKey', skRes.data.session_key);
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
            const at = await SecureStorage.getItemAsync('authToken');
            const sk = await SecureStorage.getItemAsync('sessionKey');
            console.log('SecureStore snapshot (final)', { authToken: at, sessionKey: sk });
          } catch {}
        }

        if (response.data.needsProfileSetup) {
          await SecureStorage.setItemAsync('needsProfileSetup', 'true');

          if (response.data.chat_id) {
            await SecureStorage.setItemAsync('chatId', response.data.chat_id);
          }
        } else {
          await SecureStorage.deleteItemAsync('needsProfileSetup');
        }

        return response.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
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
          'X-API-Key': 'liquide-v2'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);

      let errorMessage = 'Registration failed';

      if (!error.response) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.response.status >= 500) {
        // Server error
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response.status === 429) {
        // Rate limit
        errorMessage = error.response.data?.error || 'Too many registration attempts. Please try again later.';
      } else if (error.response.status >= 400) {
        // Client error (validation, etc.)
        errorMessage = error.response.data?.error || 'Invalid input. Please check your details and try again.';
      } else {
        // Other errors
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      throw new Error(errorMessage);
    }
  },

  setupProfile: async (profileData: ProfileData): Promise<ProfileSetupResponse> => {
    try {
      const chatId = await SecureStorage.getItemAsync('chatId');
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
        await SecureStorage.setItemAsync('user', JSON.stringify(response.data.user));
        await SecureStorage.setItemAsync('needsProfileSetup', 'false');
        await SecureStorage.deleteItemAsync('chatId');
      }

      return response.data;
    } catch (error) {
      console.error('Profile setup error:', error.response?.data || error.message);
      throw error;
    }
  },

  checkAuth: async (): Promise<AuthCheckResponse> => {
    try {
      const response = await api.get<AuthCheckResponse>('/api/auth/check');

      if (response.data.isAuthenticated && response.data.user) {
        await SecureStorage.setItemAsync('user', JSON.stringify(response.data.user));
        await SecureStorage.setItemAsync('needsProfileSetup', 'false');
      } else if (response.data.needsProfileSetup) {
        await SecureStorage.setItemAsync('needsProfileSetup', 'true');
      } else {
        await SecureStorage.deleteItemAsync('user');
        await SecureStorage.deleteItemAsync('needsProfileSetup');
      }

      return response.data;
    } catch (error) {
      console.error('Auth check error:', error.response?.data || error.message);
      return {
        isAuthenticated: false,
        error: error.response?.data?.error || 'Ошибка проверки аутентификации',
      };
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    try {
      await api.post('/api/auth/logout');

      await SecureStorage.deleteItemAsync('user');
      await SecureStorage.deleteItemAsync('authToken');
      await SecureStorage.deleteItemAsync('needsProfileSetup');
      await SecureStorage.deleteItemAsync('chatId');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);

      await SecureStorage.deleteItemAsync('user');
      await SecureStorage.deleteItemAsync('authToken');
      await SecureStorage.deleteItemAsync('needsProfileSetup');
      await SecureStorage.deleteItemAsync('chatId');

      throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userString = await SecureStorage.getItemAsync('user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении пользователя из хранилища:', error);
      return null;
    }
  },

  needsProfileSetup: async (): Promise<boolean> => {
    try {
      const needsSetup = await SecureStorage.getItemAsync('needsProfileSetup');
      return needsSetup === 'true';
    } catch (error) {
      console.error('Ошибка при проверке настройки профиля:', error);
      return false;
    }
  },
};

export default AuthService;
