import { create } from 'zustand';

interface AppState {
  user: User | null;
}

export const useAppState = create<AppState>((set) => ({
  user: null,
}));
