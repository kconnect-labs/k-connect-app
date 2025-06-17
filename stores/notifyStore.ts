import { create } from 'zustand';

interface NotifyState {
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
  visible: boolean;
  show: (options: { message: string; icon?: string; color?: string; duration?: number }) => void;
  hide: () => void;
}

export const useNotifyStore = create<NotifyState>((set) => ({
  message: '',
  icon: 'information',
  color: '#d0bcff',
  duration: 3000,
  visible: false,
  show: ({ message, icon, color, duration }) =>
    set({
      message,
      icon,
      color,
      duration,
      visible: true,
    }),
  hide: () => set({ visible: false }),
}));
