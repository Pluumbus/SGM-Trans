import { create } from "zustand";

type RowSelectionType = {
  number: number;
  isSelected: boolean;
};

type SelectionStoreType = {
  rowSelected: RowSelectionType[];
  setRowSelected: (
    updater:
      | RowSelectionType[]
      | ((prev: RowSelectionType[]) => RowSelectionType[])
  ) => void;
};

export const useSelectionStore = create<SelectionStoreType>((set) => ({
  rowSelected: [],
  setRowSelected: (updater) =>
    set((state) => ({
      rowSelected:
        typeof updater === "function" ? updater(state.rowSelected) : updater,
    })),
}));
