// store/modalStore.ts
import { create } from "zustand";

type ModalStore = {
 isOpen: boolean;
 content: React.ReactNode | null;
 openModal: (content: React.ReactNode, title: string) => void;
 closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
 isOpen: false,
 content: null,
 openModal: (content, title) => set({ isOpen: true, content }),
 closeModal: () => set({ isOpen: false }),
}));
