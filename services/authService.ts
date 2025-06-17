import api from './api';
import * as SecureStorage from 'expo-secure-store';

interface User {
  // Define user properties here
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
      const response = await api.post<LoginResponse>('/api/auth/login', {
        username: usernameOrEmail,
        password,
      });

      if (response.data.success) {
        // Если вход выполнен успешно, сохраняем данные пользователя
        if (response.data.user) {
          await SecureStorage.setItemAsync('user', JSON.stringify(response.data.user));
          await SecureStorage.setItemAsync('needsProfileSetup', 'false');

          // Сохраняем токен, если он предоставлен
          if (response.data.token) {
            await SecureStorage.setItemAsync('authToken', response.data.token);
          }
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
      });

      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  setupProfile: async (profileData: ProfileData): Promise<ProfileSetupResponse> => {
    try {
      const chatId = await SecureStorage.getItemAsyncAsync('chatId');
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

      // Очищаем хранилище данных независимо от ответа API
      await SecureStorage.deleteItemAsync('user');
      await SecureStorage.deleteItemAsync('authToken');
      await SecureStorage.deleteItemAsync('needsProfileSetup');
      await SecureStorage.deleteItemAsync('chatId');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);

      // Still clear data even if API call fails
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
