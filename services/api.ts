import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { BASE_URL } from "../utils/constants";

// Cross-platform storage wrapper
const storage = {
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.default.getItemAsync(key);
    }
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.default.deleteItemAsync(key);
    }
  },
};

// Создаем экземпляр axios с базовым URL
const api: AxiosInstance = axios.create({
 baseURL: BASE_URL,
 timeout: 30000, // Увеличиваем timeout до 30 секунд
 headers: {
  "X-API-Key": "liquide-gg-v2",
  "Content-Type": "application/json",
 },
});

// Перехватчик запросов для добавления токена аутентификации
api.interceptors.request.use(
 async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  try {
   const token = await storage.getItemAsync("authToken");
   if (token && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
   }
  } catch (error) {
   console.error("Ошибка при получении токена из хранилища:", error);
  }
  return config;
 },
 (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
 }
);

// Перехватчик ответов для обработки ошибок
api.interceptors.response.use(
 (response: AxiosResponse): AxiosResponse => response,
 async (error: AxiosError): Promise<AxiosError> => {
  // Улучшенная обработка ошибок
  if (error.code === "ECONNABORTED") {
   console.error("Таймаут запроса:", error.message);
   // Можно добавить повторную попытку соединения
   return Promise.reject(
    new Error("Превышено время ожидания. Проверьте подключение к интернету.")
   );
  }

  const originalRequest = error.config as InternalAxiosRequestConfig & {
   _retry?: boolean;
  };

  // Если ошибка 401 (неавторизован) и запрос еще не повторялся
  if (error.response?.status === 401 && !originalRequest._retry) {
   originalRequest._retry = true;

   try {
    // Можно добавить логику обновления токена
    // const refreshToken = await AsyncStorage.getItem('refreshToken');
    // const response = await api.post('/api/auth/refresh', { refreshToken });
    // await AsyncStorage.setItem('authToken', response.data.token);

    // return api(originalRequest);

    // Пока просто выходим из системы при истечении токена
    await storage.deleteItemAsync("authToken");
    return Promise.reject(error);
   } catch (refreshError) {
    // При ошибке обновления токена выходим из системы
    await storage.deleteItemAsync("authToken");
    return Promise.reject(refreshError);
   }
  }

  return Promise.reject(error);
 }
);

export default api;
