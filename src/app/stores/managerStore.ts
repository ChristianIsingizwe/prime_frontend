import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  phoneNumber: string;
  workId: string;
}

interface ManagerState {
  managers: Manager[];
  setManagers: (managers: Manager[]) => void;
  addManager: (manager: Manager) => void;
  removeManager: (id: string) => void;
}

export const useManagerStore = create<ManagerState>()(
  devtools(
    (set) => ({
      managers: [],
      setManagers: (managers) => set({ managers }),
      addManager: (manager) =>
        set((state) => ({ managers: [...state.managers, manager] })),
      removeManager: (id) =>
        set((state) => ({
          managers: state.managers.filter((manager) => manager.id !== id),
        })),
    }),
    { name: "manager-store" }
  )
);
