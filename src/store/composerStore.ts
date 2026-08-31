import { create } from 'zustand';

interface ComposerState {
  isOpen: boolean;
  activeTab: 'Composer' | 'Preview';
  openComposer: (tab?: 'Composer' | 'Preview') => void;
  closeComposer: () => void;
  setActiveTab: (tab: 'Composer' | 'Preview') => void;
}

export const useComposerStore = create<ComposerState>((set) => ({
  isOpen: false,
  activeTab: 'Composer',
  openComposer: (tab = 'Composer') => set({ isOpen: true, activeTab: tab }),
  closeComposer: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
