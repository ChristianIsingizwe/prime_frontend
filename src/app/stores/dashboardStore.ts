import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { DashboardData } from "../lib/apiUsers/performance";

interface DashboardState {
  weeklyData: { day: string; clients: number }[];
  performanceData: { name: string; value: number; color: string }[];
  setDashboardData: (
    data: Pick<DashboardData, "weeklyData" | "performanceData">
  ) => void;
  clearDashboardData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      weeklyData: [],
      performanceData: [],
      setDashboardData: (data) =>
        set({
          weeklyData: data.weeklyData,
          performanceData: data.performanceData,
        }),
      clearDashboardData: () =>
        set({
          weeklyData: [],
          performanceData: [],
        }),
    }),
    { name: "dashboard-store" }
  )
);
