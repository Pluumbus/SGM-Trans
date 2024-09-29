import { create } from "zustand";

type RowSelectionType = {
  number: number;
  isSelected: boolean;
};

type SelectionStoreType = {
  rowSelected: RowSelectionType[];
  setRowSelected: (newSelection: RowSelectionType[]) => void;
};

export const useSelectionStore = create<SelectionStoreType>((set) => ({
  rowSelected: [],
  setRowSelected: (newSelection) => set({ rowSelected: newSelection }),
}));
