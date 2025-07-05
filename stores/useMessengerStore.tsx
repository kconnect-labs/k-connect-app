import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface MessengerStore {
  sessionKey: string | null;
  setSessionKey: (key: string) => void;
  getSessionKey: () => Promise<string | null>;
}

const useMessengerStore = create<MessengerStore>((set, get) => ({
  sessionKey: null,
  
  setSessionKey: (key: string) => {
    set({ sessionKey: key });
    SecureStore.setItemAsync('sessionKey', key);
  },
  
  getSessionKey: async () => {
    const { sessionKey } = get();
    if (sessionKey) return sessionKey;
    
    try {
      const storedKey = await SecureStore.getItemAsync('sessionKey');
      if (storedKey) {
        set({ sessionKey: storedKey });
        return storedKey;
      }
    } catch (error) {
      console.error('Error getting session key from storage:', error);
    }
    
    return null;
  },
}));

export default useMessengerStore; 