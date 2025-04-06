import { create } from 'zustand';

interface ResourceStore {
  isInEditMode: boolean;
  setIsInEditMode: (isInEditMode: boolean) => void;
  selectedResourceIds: number[];
  setSelectedResourceIds: (selectedResourceIds: number[]) => void;
}

export const useResourcesStore = create<ResourceStore>((set) => ({
  isInEditMode: false,
  setIsInEditMode: (isInEditMode) => set({ isInEditMode }),
  selectedResourceIds: [],
  setSelectedResourceIds: (selectedResourceIds) => set({ selectedResourceIds }),
}));
