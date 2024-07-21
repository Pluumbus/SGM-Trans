import { create } from "zustand";
import { persist, StateStorage } from "zustand/middleware";

import mockData from "../Table/mock.data";
import { CargoType } from "@/app/workflow/_feature/types";

type CargoState = {
  cargoData: CargoType[];
  updateCargo: (id: number, updatedCargo: Partial<CargoType>) => void;
  updateCargoArray: (newCargoArray: CargoType[]) => void;
};

const getDynamicStorage = (id: string): StateStorage => ({
  getItem: (name) => {
    const data = localStorage.getItem(`${name}-${id}`);
    return data ? data : JSON.stringify(mockData);
  },
  setItem: (name, value) => localStorage.setItem(`${name}-${id}`, value),
  removeItem: (name) => localStorage.removeItem(`${name}-${id}`),
});

export const createCargoStore = (id: string) =>
  create<CargoState>()(
    persist(
      (set) => ({
        cargoData: mockData,
        updateCargo: (cargoId, updatedCargo) =>
          set((state) => ({
            cargoData: state.cargoData.map((cargo) =>
              cargo.id === cargoId ? { ...cargo, ...updatedCargo } : cargo
            ),
          })),
        updateCargoArray: (newCargoArray) => set({ cargoData: newCargoArray }),
      }),
      {
        name: "cargo-storage",
        getStorage: () => getDynamicStorage(id),
      }
    )
  );
